import os
import torch
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from torch.optim import AdamW
from tqdm import tqdm
import wandb

class LatentFlowTrainer:
    def __init__(self, flow_model, vae_model, train_dataloader, val_dataloader,
                 learning_rate=3e-4, epochs=50, device="mps", log_to_wandb=False,
                 weight_decay=1e-5, grad_clip=1.0,
                 checkpoint_dir="outputs/checkpoints", checkpoint_filename="flow_best.pt"):
        
        self.flow_model = flow_model.to(device)
        self.device = device
        self.epochs = epochs
        self.log_to_wandb = log_to_wandb
        self.train_dataloader = train_dataloader
        self.val_dataloader = val_dataloader
        self.grad_clip = grad_clip
        self.checkpoint_dir = checkpoint_dir
        self.checkpoint_filename = checkpoint_filename
        
        # Setup the frozen VAE
        self.vae_model = vae_model.to(device).eval()
        for param in self.vae_model.parameters():
            param.requires_grad = False  # Completely freeze the VAE!
            
        # Optimizer purely for the Normalizing Flow
        self.optimizer = AdamW(self.flow_model.parameters(), lr=learning_rate, weight_decay=weight_decay)
        
        os.makedirs(self.checkpoint_dir, exist_ok=True)
        self.best_val_loss = float('inf')

    def train(self):
        print(f"\n🚀 Starting Normalizing Flow training on: {self.device.upper()}")
            
        for epoch in range(1, self.epochs + 1):
            self.flow_model.train()
            epoch_train_loss = 0.0
            
            pbar_train = tqdm(self.train_dataloader, desc=f"Epoch {epoch:03d}/{self.epochs} [TRAIN]")
            for mel_spec in pbar_train:
                mel_spec = mel_spec.to(self.device)
                
                # --- THE VAE BRIDGE ---
                # Pass the audio image through the frozen VAE to get the 256D Latent Vector
                with torch.no_grad():
                    mu, _ = self.vae_model.encoder(mel_spec)
                    z = mu # We train the flow on the deterministic mean encodings
                
                # --- TRAIN THE FLOW ---
                self.optimizer.zero_grad()
                loss = self.flow_model.compute_loss(z)
                
                loss.backward()
                torch.nn.utils.clip_grad_norm_(self.flow_model.parameters(), max_norm=self.grad_clip)
                self.optimizer.step()
                
                epoch_train_loss += loss.item()
                pbar_train.set_postfix({"loss": f"{loss.item():.4f}"})
                
            avg_train_loss = epoch_train_loss / len(self.train_dataloader)
            
            # --- VALIDATION ---
            avg_val_loss = self.evaluate(epoch)
            
            # --- LOGGING & SAVING ---
            if self.log_to_wandb:
                wandb.log({
                    "epoch": epoch,
                    "train_loss": avg_train_loss,
                    "val_loss": avg_val_loss,
                })
                self._log_generated_audio(epoch)
                
            if avg_val_loss < self.best_val_loss:
                self.best_val_loss = avg_val_loss
                path = os.path.join(self.checkpoint_dir, self.checkpoint_filename)
                torch.save(self.flow_model.state_dict(), path)
                print(f"   🌟 New best flow saved! (Val Loss: {avg_val_loss:.4f})")

    def evaluate(self, epoch):
        self.flow_model.eval()
        epoch_val_loss = 0.0
        
        pbar_val = tqdm(self.val_dataloader, desc=f"Epoch {epoch:03d}/{self.epochs} [VAL]  ")
        with torch.no_grad():
            for mel_spec in pbar_val:
                mel_spec = mel_spec.to(self.device)
                mu, _ = self.vae_model.encoder(mel_spec)
                loss = self.flow_model.compute_loss(mu)
                epoch_val_loss += loss.item()
                
        return epoch_val_loss / len(self.val_dataloader)

    @torch.no_grad()
    def _log_generated_audio(self, epoch):
        """
        Samples random noise, pushes it through the flow to generate audio latents,
        then pushes those latents through the VAE Decoder to plot the generated Mel-Spectrograms!
        """
        self.flow_model.eval()
        
        # Generate 4 brand new audio concepts from thin air
        z_generated = self.flow_model.sample(num_samples=4, device=self.device)
        
        # Decode them using the frozen VAE
        mel_specs = self.vae_model.decoder(z_generated).cpu().numpy()
        
        fig, axes = plt.subplots(1, 4, figsize=(16, 4))
        for i in range(4):
            # Plot the generated 2D Mel-Spectrogram
            axes[i].imshow(mel_specs[i][0], origin='lower', aspect='auto', cmap='magma')
            axes[i].set_title(f"Dreamt Sound {i+1}")
            axes[i].axis('off')
            
        plt.tight_layout()
        wandb.log({"viz/dreamt_mel_spectrograms": wandb.Image(fig)})
        plt.close(fig)