import os
import yaml
import torch
from torch.utils.data import DataLoader, random_split
import wandb
from pathlib import Path

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
from src.models.flow_model import AudioLatentFlow
from src.training.trainer import LatentFlowTrainer

def main():
    # ── Load config ──────────────────────────────────────────────────────────
    cfg = load_config(ROOT / "configs" / "train_flow.yaml")
    print("Loaded config: configs/train_flow.yaml")

    # ── Hardware ─────────────────────────────────────────────────────────────
    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Using device: {device}")

    # ── Hyperparameters from config ───────────────────────────────────────────
    batch_size   = cfg["training"]["batch_size"]
    epochs       = cfg["training"]["epochs"]
    lr           = cfg["training"]["learning_rate"]
    weight_decay  = cfg["training"]["weight_decay"]
    grad_clip     = cfg["training"]["grad_clip"]
    latent_dim    = cfg["model"]["latent_dim"]
    num_layers    = cfg["model"]["num_layers"]
    hidden_dim    = cfg["model"]["hidden_dim"]
    num_workers   = cfg["data"]["num_workers"]
    train_split   = cfg["data"]["train_split"]
    data_path     = cfg["data"]["path"]
    vae_ckpt      = Path(cfg["vae"]["checkpoint"])
    ckpt_dir      = cfg["checkpointing"]["dir"]
    ckpt_name     = cfg["checkpointing"]["filename"]
    use_wandb     = cfg["logging"]["wandb"]
    wandb_project = cfg["logging"]["wandb_project"]

    # ── Initialize WandB ─────────────────────────────────────────────────────
    if use_wandb:
        wandb.init(project=wandb_project, config=cfg)
    else:
        wandb.init(mode="disabled")

    # ── Load Data & Split ────────────────────────────────────────────────────
    print("Loading dataset...")
    full_dataset = AudioLatentDataset(data_dir=data_path)
    train_size = int(train_split * len(full_dataset))
    val_size   = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True,  num_workers=num_workers)
    val_loader   = DataLoader(val_dataset,   batch_size=batch_size, shuffle=False, num_workers=num_workers)
    print(f"Dataset split: {train_size} train samples, {val_size} validation samples.")

    # ── Load the trained VAE (The Bottleneck Bridge) ───────────────────────────
    print("Loading pre-trained VAE...")
    vae = VAE(latent_dim=latent_dim).to(device)
    if not vae_ckpt.exists():
        raise FileNotFoundError(f"Could not find {vae_ckpt}. Did you finish running train_vae.py?")
    vae.load_state_dict(torch.load(vae_ckpt, map_location=device, weights_only=True))
    # Note: The trainer automatically freezes the VAE, so we just pass it in!

    # ── Instantiate the Normalizing Flow ───────────────────────────────────────
    print("Initializing Audio Latent Flow...")
    flow = AudioLatentFlow(dim_theta=latent_dim, num_layers=num_layers, hidden_dim=hidden_dim).to(device)

    # ── Initialize the Trainer and Start! ──────────────────────────────────────
    trainer = LatentFlowTrainer(
        flow_model=flow,
        vae_model=vae,
        train_dataloader=train_loader,
        val_dataloader=val_loader,
        learning_rate=lr,
        weight_decay=weight_decay,
        grad_clip=grad_clip,
        epochs=epochs,
        device=str(device),
        log_to_wandb=use_wandb,
        checkpoint_dir=ckpt_dir,
        checkpoint_filename=ckpt_name,
    )

    trainer.train()

    wandb.finish()
    print("🎉 Flow Training Complete! The model has learned the subconscious sound distribution.")

if __name__ == "__main__":
    main()