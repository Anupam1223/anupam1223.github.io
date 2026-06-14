import os
import sys
import yaml
import torch
import torchaudio
import torchaudio.transforms as T
import librosa
import soundfile as sf
import matplotlib
matplotlib.use('Agg') # Safe for environments without a display
import matplotlib.pyplot as plt
from pathlib import Path

ROOT = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(str(ROOT))

from src.models.components import VAE
from src.models.flow_model import AudioLatentFlow

def load_config(path: Path) -> dict:
    with open(path, "r") as f:
        return yaml.safe_load(f)

def process_real_audio(file_path, device, sample_rate=22050, duration=3, n_mels=80):
    """Takes a raw .wav file and converts it to a normalized Mel-Spectrogram tensor."""
    target_samples = sample_rate * duration
    
    # Load and resample
    waveform, sr = torchaudio.load(file_path)
    if sr != sample_rate:
        waveform = T.Resample(sr, sample_rate)(waveform)
        
    # Mono conversion
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)
        
    # Pad or trim to exactly 3 seconds
    if waveform.shape[1] > target_samples:
        waveform = waveform[:, :target_samples]
    elif waveform.shape[1] < target_samples:
        padding = target_samples - waveform.shape[1]
        waveform = torch.nn.functional.pad(waveform, (0, padding))
        
    # Mel Transform
    mel_transform = T.MelSpectrogram(sample_rate=sample_rate, n_fft=1024, hop_length=256, n_mels=n_mels)
    mel_spec = mel_transform(waveform)
    
    # Amplitude to DB and Normalize
    mel_spec_db = T.AmplitudeToDB()(mel_spec)
    mel_spec_normalized = (mel_spec_db - mel_spec_db.mean()) / (mel_spec_db.std() + 1e-5)
    
    # Add batch dimension: [1, 1, 80, 258]
    return mel_spec_normalized.unsqueeze(0).to(device)

def mel_to_audio(mel_tensor, save_path, sr=22050, hop_length=256, n_fft=1024):
    """Uses Griffin-Lim to convert a 2D Mel-Spectrogram back into a .wav file."""
    # Squeeze to 2D numpy array [80, 258]
    mel_numpy = mel_tensor.squeeze().cpu().numpy()
    
    # Un-normalize: We mapped dB to roughly [-1, 1] during training via Tanh.
    # We rescale this back to a realistic dB range of [-80, 0] dB for audio generation.
    mel_db = (mel_numpy + 1.0) * 40.0 - 80.0
    
    # Convert dB back to linear amplitude
    mel_amp = librosa.db_to_amplitude(mel_db)
    
    # Griffin-Lim Phase Reconstruction
    print(f"   ↳ Reconstructing audio phases for {save_path.name} (this takes a second)...")
    y = librosa.feature.inverse.mel_to_audio(
        M=mel_amp,
        sr=sr,
        n_fft=n_fft,
        hop_length=hop_length,
        n_iter=64 # Increased to 64 for better audio quality
    )
    
    # Save as .wav
    sf.write(save_path, y, sr)

def save_mel_comparison(original_mel, recon_mel, generated_mels, save_path):
    """Plots original, direct reconstruction, and variations in a clear grid."""
    num_gen = generated_mels.shape[0]
    
    # Create a 2-row figure. Top row for baseline, bottom row for variations.
    fig, axes = plt.subplots(2, max(2, num_gen), figsize=(16, 8))
    fig.patch.set_facecolor('#0d1117')
    
    # 1. Top Row: Original Input
    axes[0, 0].imshow(original_mel[0, 0].cpu().numpy(), origin='lower', aspect='auto', cmap='magma')
    axes[0, 0].set_title("Original Input (Seed)", color='white', pad=10)
    axes[0, 0].axis('off')
    
    # 2. Top Row: VAE Direct Reconstruction (No flow, just in and out)
    axes[0, 1].imshow(recon_mel[0, 0].cpu().numpy(), origin='lower', aspect='auto', cmap='magma')
    axes[0, 1].set_title("VAE Reconstruction (Baseline)", color='white', pad=10)
    axes[0, 1].axis('off')
    
    # Hide unused top row subplots
    for j in range(2, max(2, num_gen)):
        axes[0, j].axis('off')
        
    # 3. Bottom Row: Flow Generated Variations
    for i in range(num_gen):
        axes[1, i].imshow(generated_mels[i, 0].cpu().numpy(), origin='lower', aspect='auto', cmap='magma')
        axes[1, i].set_title(f"Flow Variation {i+1}", color='white', pad=10)
        axes[1, i].axis('off')
        
    plt.tight_layout()
    plt.savefig(save_path, bbox_inches='tight', dpi=150, facecolor='#0d1117')
    plt.close()
    print(f"   ↳ Saved Mel-Spectrogram comparison image to {save_path.name}")

def main():
    # --- CONFIGURATION ---
    # Put the path to the .wav file you want to use as your "Seed" here!
    INPUT_WAV_PATH = "data/raw/seed_audio.wav" 
    NUM_VARIATIONS = 3
    TEMPERATURE = 0.2  # 0.1 = Almost identical, 1.0 = Wildly different
    
    # --- FOLDER SETUP ---
    OUTPUT_DIR = Path("outputs/generated")
    SOUND_DIR = OUTPUT_DIR / "sound"
    IMAGE_DIR = OUTPUT_DIR / "mel_spectro_image"
    
    SOUND_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    print(f"🎸 Creative Mirror Explorer | Device: {device}")
    
    if not os.path.exists(INPUT_WAV_PATH):
        print(f"❌ Error: Please place a 3-second audio file at '{INPUT_WAV_PATH}' to use as a seed.")
        return

    # --- LOAD MODELS ---
    print("Loading AI Models...")
    cfg_vae = load_config(ROOT / "configs" / "train_vae.yaml")
    cfg_flow = load_config(ROOT / "configs" / "train_flow.yaml")
    
    latent_dim = cfg_vae["model"]["latent_dim"]
    
    vae = VAE(latent_dim=latent_dim).to(device).eval()
    vae.load_state_dict(torch.load(ROOT / "outputs" / "checkpoints" / "vae_best.pt", map_location=device, weights_only=True))
    
    flow = AudioLatentFlow(dim_theta=latent_dim, num_layers=cfg_flow["model"]["num_layers"], hidden_dim=cfg_flow["model"]["hidden_dim"]).to(device).eval()
    flow.load_state_dict(torch.load(ROOT / "outputs" / "checkpoints" / "flow_best.pt", map_location=device, weights_only=True))

    # --- INFERENCE ---
    with torch.no_grad():
        print(f"1. Encoding Seed Audio: {INPUT_WAV_PATH}")
        mel_seed = process_real_audio(INPUT_WAV_PATH, device)
        
        # Save the original reconstruction so you can compare baseline quality
        seed_reconstruction = vae.decoder(vae.encoder(mel_seed)[0])
        mel_to_audio(seed_reconstruction, SOUND_DIR / "0_seed_reconstruction.wav")
        
        print("2. Mapping to Flow Space (u)...")
        z_seed = vae.encoder(mel_seed)[0]
        u_seed, _ = flow.forward(z_seed)
        
        print(f"3. Generating {NUM_VARIATIONS} variations (Temperature: {TEMPERATURE})...")
        # Duplicate our seed point N times
        u_variations = u_seed.repeat(NUM_VARIATIONS, 1)
        
        # Add mathematical jitter (Gaussian noise * Temperature)
        jitter = torch.randn_like(u_variations) * TEMPERATURE
        u_jittered = u_variations + jitter
        
        print("4. Reversing Flow and Decoding to Audio...")
        # Reverse Flow manually
        z_generated = u_jittered
        for layer in reversed(flow.layers):
            z_generated = torch.flip(z_generated, dims=[-1]).contiguous()
            z_generated = layer.inverse(z_generated)
            
        # Decode VAE
        mel_generated = vae.decoder(z_generated)
        
        # Convert to Audio files
        for i in range(NUM_VARIATIONS):
            save_name = SOUND_DIR / f"variation_{i+1}_temp{TEMPERATURE}.wav"
            mel_to_audio(mel_generated[i:i+1], save_name)

        print("5. Generating Visual Comparison...")
        save_mel_comparison(
            original_mel=mel_seed, 
            recon_mel=seed_reconstruction, 
            generated_mels=mel_generated, 
            save_path=IMAGE_DIR / "spectrogram_comparison.png"
        )
            
    print(f"\n🎉 Done! Check the '{OUTPUT_DIR}' folder for your generated sounds and images!")

if __name__ == "__main__":
    main()