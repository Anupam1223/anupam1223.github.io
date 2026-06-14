import os
import yaml
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader, random_split
from tqdm import tqdm
import wandb
from pathlib import Path

import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for background training loops
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

# Fix path resolution if running from root
import sys
ROOT = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(str(ROOT))

def load_config(path: Path) -> dict:
    """Load a YAML config file and return it as a nested dict."""
    with open(path, "r") as f:
        return yaml.safe_load(f)

from src.data.dataset import AudioLatentDataset
from src.models.components import VAE

def loss_function(recon_x, x, mu, logvar, beta=0.1):
    """
    Combines Reconstruction Loss (MSE) with KL Divergence.
    Beta controls how 'regularized' the latent space is.
    """
    MSE = F.mse_loss(recon_x, x, reduction='mean')
    # KL Divergence
    KLD = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
    
    return MSE + beta * KLD, MSE, KLD

@torch.no_grad()
def evaluate(model, val_loader, device, beta):
    """Runs the validation set to monitor overfitting."""
    model.eval()
    total_loss, total_mse, total_kld = 0, 0, 0
    
    for batch in val_loader:
        batch = batch.to(device)
        recon_batch, mu, logvar = model(batch)
        
        # STFT Frame Trimming
        if recon_batch.shape[-1] != batch.shape[-1]:
            min_time_frames = min(recon_batch.shape[-1], batch.shape[-1])
            recon_batch = recon_batch[..., :min_time_frames]
            batch = batch[..., :min_time_frames]
            
        # FIX: Pass the dynamic beta from YAML into the validation loss calculation
        loss, mse, kld = loss_function(recon_batch, batch, mu, logvar, beta=beta)
        
        total_loss += loss.item()
        total_mse += mse.item()
        total_kld += kld.item()
        
    return total_loss / len(val_loader), total_mse / len(val_loader), total_kld / len(val_loader)

@torch.no_grad()
def log_vae_visuals(model, val_loader, epoch, device):
    """Generates Latent Space PCA and Reconstruction Image plots for WandB."""
    model.eval()
    # Grab one fixed batch from validation for plotting
    batch = next(iter(val_loader)).to(device)
    recon_batch, mu, logvar = model(batch)
    
    # Frame trimming for plotting
    if recon_batch.shape[-1] != batch.shape[-1]:
        min_frames = min(recon_batch.shape[-1], batch.shape[-1])
        recon_batch = recon_batch[..., :min_frames]
        batch = batch[..., :min_frames]

    # --- 1. PLOT RECONSTRUCTIONS (Original vs Reconstructed) ---
    fig_mel, axes = plt.subplots(2, 4, figsize=(16, 6))
    for i in range(4): # Plot 4 random samples
        # Original (Top Row)
        axes[0, i].imshow(batch[i, 0].cpu().numpy(), origin='lower', aspect='auto', cmap='magma')
        axes[0, i].set_title(f"Original Audio {i+1}")
        axes[0, i].axis('off')
        
        # Reconstruction (Bottom Row)
        axes[1, i].imshow(recon_batch[i, 0].cpu().numpy(), origin='lower', aspect='auto', cmap='magma')
        axes[1, i].set_title(f"Reconstructed {i+1}")
        axes[1, i].axis('off')
    
    fig_mel.tight_layout()

    # --- 2. PLOT LATENT SPACE (PCA Projection) ---
    z_np = mu.cpu().numpy()
    pca = PCA(n_components=2)
    z_2d = pca.fit_transform(z_np)
    
    fig_pca, ax_pca = plt.subplots(figsize=(8, 6))
    ax_pca.scatter(z_2d[:, 0], z_2d[:, 1], alpha=0.7, c='cyan', edgecolors='white', s=50)
    ax_pca.set_title(f"Latent Space (2D PCA) — Epoch {epoch}\nGoal: A tight, centered circular cluster N(0,1)")
    ax_pca.set_xlabel("Principal Component 1")
    ax_pca.set_ylabel("Principal Component 2")
    
    # Dark mode styling
    ax_pca.set_facecolor('#0d1117')
    fig_pca.patch.set_facecolor('#0d1117')
    ax_pca.title.set_color('white')
    ax_pca.xaxis.label.set_color('white')
    ax_pca.yaxis.label.set_color('white')
    ax_pca.tick_params(colors='white')
    ax_pca.grid(True, alpha=0.2)
    fig_pca.tight_layout()

    # Send to Weights & Biases
    wandb.log({
        "viz/reconstructions": wandb.Image(fig_mel),
        "viz/latent_pca": wandb.Image(fig_pca),
    })
    
    plt.close(fig_mel)
    plt.close(fig_pca)

def log_gradients(model, global_step):
    """Plots the gradient flow across Convolutional and Linear layers."""
    layer_grads = {}
    for name, module in model.named_modules():
        if isinstance(module, (torch.nn.Conv2d, torch.nn.ConvTranspose2d, torch.nn.Linear)):
            if getattr(module, 'weight', None) is not None and module.weight.grad is not None:
                layer_grads[name] = module.weight.grad.abs().mean().item()
    
    if layer_grads:
        names = list(layer_grads.keys())
        avgs = list(layer_grads.values())
        
        fig, ax = plt.subplots(figsize=(12, 4))
        ax.plot(range(len(names)), avgs, marker="o", linewidth=2, color='cyan')
        ax.set_xticks(range(len(names)))
        ax.set_xticklabels(names, rotation=30, ha="right", fontsize=8)
        ax.set_ylabel("Mean Absolute Gradient")
        ax.set_title(f"CNN Gradient Flow — Step {global_step}")
        ax.grid(True, alpha=0.2)
        fig.tight_layout()
        wandb.log({"grad/cnn_flow": wandb.Image(fig)})
        plt.close(fig)

def main():
    # ── Load config ──────────────────────────────────────────────────────────
    cfg = load_config(ROOT / "configs" / "train_vae.yaml")
    print(f"Loaded config: configs/train_vae.yaml")

    # ── Hardware ─────────────────────────────────────────────────────────────
    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Using device: {device}")

    # ── Hyperparameters from config ───────────────────────────────────────────
    batch_size  = cfg["training"]["batch_size"]
    epochs      = cfg["training"]["epochs"]
    lr          = float(cfg["training"]["learning_rate"])
    latent_dim  = cfg["model"]["latent_dim"]
    beta        = float(cfg["training"]["beta"])
    grad_log_interval = cfg["training"]["grad_log_interval"]
    num_workers = cfg["data"]["num_workers"]
    train_split = cfg["data"]["train_split"]
    data_path   = cfg["data"]["path"]
    ckpt_dir    = Path(cfg["checkpointing"]["dir"])
    ckpt_name   = cfg["checkpointing"]["filename"]
    use_wandb   = cfg["logging"]["wandb"]
    wandb_project = cfg["logging"]["wandb_project"]

    # ── Initialize WandB ─────────────────────────────────────────────────────
    # FIX: Check the YAML boolean before initiating cloud sync
    if use_wandb:
        wandb.init(project=wandb_project, config=cfg)
    else:
        wandb.init(mode="disabled")

    # ── Load Data & Split ────────────────────────────────────────────────────
    print("Loading dataset...")
    full_dataset = AudioLatentDataset(data_dir=data_path)
    train_size = int(train_split * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True,  num_workers=num_workers)
    val_loader   = DataLoader(val_dataset,   batch_size=batch_size, shuffle=False, num_workers=num_workers)
    print(f"Dataset split: {train_size} Train | {val_size} Val")

    # ── Initialize Model & Optimizer ─────────────────────────────────────────
    model = VAE(latent_dim=latent_dim).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    # ── Ensure checkpoints directory exists ───────────────────────────────────
    ckpt_dir.mkdir(parents=True, exist_ok=True)
    
    best_val_loss = float('inf')
    global_step = 0
    
    print("Starting VAE Training Phase...")
    for epoch in range(epochs):
        model.train()
        epoch_train_loss = 0
        
        progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{epochs} [TRAIN]")
        
        for batch in progress_bar:
            batch = batch.to(device)
            
            # Forward pass
            optimizer.zero_grad()
            recon_batch, mu, logvar = model(batch)
            
            # STFT Frame Trimming
            if recon_batch.shape[-1] != batch.shape[-1]:
                min_time_frames = min(recon_batch.shape[-1], batch.shape[-1])
                recon_batch = recon_batch[..., :min_time_frames]
                batch = batch[..., :min_time_frames]
            
            # Compute loss
            loss, mse, kld = loss_function(recon_batch, batch, mu, logvar, beta=beta)
            
            # Backward pass
            loss.backward()
            optimizer.step()
            
            epoch_train_loss += loss.item()
            progress_bar.set_postfix({"Train Loss": f"{loss.item():.4f}"})
            
            # Log gradients periodically
            if use_wandb and global_step % grad_log_interval == 0:
                log_gradients(model, global_step)
            global_step += 1
            
        # --- VALIDATION & LOGGING ---
        avg_train_loss = epoch_train_loss / len(train_loader)
        # FIX: Added beta argument to evaluate()
        avg_val_loss, avg_val_mse, avg_val_kld = evaluate(model, val_loader, device, beta)
        
        # Send numerical metrics to WandB
        if use_wandb:
            wandb.log({
                "epoch": epoch + 1, 
                "train/loss": avg_train_loss,
                "val/loss": avg_val_loss,
                "val/recon_mse": avg_val_mse, 
                "val/kl_div": avg_val_kld
            })
            
            # Generate Visualizations for WandB
            log_vae_visuals(model, val_loader, epoch + 1, device)
        
        print(f"Epoch {epoch+1} | Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Val MSE: {avg_val_mse:.4f}")
        
        # Save best model based on unseen Validation Data
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            save_path = ckpt_dir / ckpt_name
            torch.save(model.state_dict(), save_path)
            print(f"🌟 Saved new best VAE model to {save_path} (Val Loss: {avg_val_loss:.4f})")

    if use_wandb:
        wandb.finish()
    print("🎉 VAE Training Complete! Your model is ready to compress audio.")

if __name__ == "__main__":
    main()