import os
import yaml
import zipfile
import tarfile
import torch
import torchaudio
import torchaudio.transforms as T
from pathlib import Path
from tqdm import tqdm

# ---------------------------------------------------------------------------
# Load configuration from configs/data/audio.yaml
# All pipeline constants are driven from that file — edit there, not here.
# ---------------------------------------------------------------------------
_ROOT   = Path(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
_CFG_PATH = _ROOT / "configs" / "data" / "audio.yaml"

with open(_CFG_PATH, "r") as _f:
    _cfg = yaml.safe_load(_f)

RAW_DATA_DIR       = _ROOT / _cfg["raw"]["dir"]
PROCESSED_DATA_DIR = _ROOT / _cfg["processed"]["dir"]
FILENAME_TEMPLATE  = _cfg["processed"]["filename_template"]

SAMPLE_RATE        = _cfg["audio"]["sample_rate"]
DURATION_SECONDS   = _cfg["audio"]["duration_seconds"]
TARGET_SAMPLES     = SAMPLE_RATE * DURATION_SECONDS   # recompute to stay consistent
N_MELS             = _cfg["mel"]["n_mels"]
N_FFT              = _cfg["mel"]["n_fft"]
HOP_LENGTH         = _cfg["mel"]["hop_length"]
F_MIN              = _cfg["mel"]["f_min"]
F_MAX              = _cfg["mel"]["f_max"]   # None → Nyquist
NORM_EPSILON       = _cfg["normalisation"]["epsilon"]

print(f"[preprocessing] Config loaded from {_CFG_PATH.relative_to(_ROOT)}")
print(f"  sample_rate={SAMPLE_RATE}  duration={DURATION_SECONDS}s  "
      f"n_mels={N_MELS}  n_fft={N_FFT}  hop={HOP_LENGTH}")

# Create directories if they don't exist
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)

# Define the MelSpectrogram transform (built once from config values)
mel_transform = T.MelSpectrogram(
    sample_rate=SAMPLE_RATE,
    n_fft=N_FFT,
    hop_length=HOP_LENGTH,
    n_mels=N_MELS,
    f_min=F_MIN,
    f_max=F_MAX,
)

def extract_archives():
    """Extracts archives listed in configs/data/audio.yaml → raw.datasets if not yet extracted."""
    print("Checking for archives to extract...")
    for ds in _cfg["raw"]["datasets"]:
        archive_path  = RAW_DATA_DIR / ds["archive"]
        extracted_dir = RAW_DATA_DIR / ds["extracted_dir"]
        if not archive_path.exists() or extracted_dir.exists():
            continue
        print(f"Extracting {archive_path.name}...")
        if ds["archive"].endswith(".zip"):
            with zipfile.ZipFile(archive_path, "r") as zf:
                zf.extractall(extracted_dir)
        elif ".tar" in ds["archive"]:
            with tarfile.open(archive_path, "r") as tf:
                tf.extractall(RAW_DATA_DIR)
    print("Extraction complete or already done.")

def process_audio(file_path):
    """Loads a .wav file, standardizes length, and converts to Mel-Spectrogram."""
    try:
        # Load audio
        waveform, sr = torchaudio.load(file_path)
        
        # Resample if necessary
        if sr != SAMPLE_RATE:
            resampler = T.Resample(sr, SAMPLE_RATE)
            waveform = resampler(waveform)
            
        # Convert stereo to mono by averaging channels
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
            
        # Standardize length (pad or trim)
        if waveform.shape[1] > TARGET_SAMPLES:
            # Trim
            waveform = waveform[:, :TARGET_SAMPLES]
        elif waveform.shape[1] < TARGET_SAMPLES:
            # Pad with silence
            padding = TARGET_SAMPLES - waveform.shape[1]
            waveform = torch.nn.functional.pad(waveform, (0, padding))
            
        # Convert to Mel-Spectrogram
        mel_spec = mel_transform(waveform)
        
        # Convert to Decibel scale (log scale is much better for neural networks)
        # We use a small epsilon to avoid log(0)
        mel_spec_db = T.AmplitudeToDB()(mel_spec)
        
        # Normalize the tensor to be roughly between -1 and 1
        mel_spec_normalized = (mel_spec_db - mel_spec_db.mean()) / (mel_spec_db.std() + NORM_EPSILON)
        
        return mel_spec_normalized
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def main():
    extract_archives()
    
    # Find all .wav files recursively (ignores .DS_Store and structure)
    print("Locating all .wav files...")
    wav_files = list(RAW_DATA_DIR.rglob("*.wav"))
    print(f"Found {len(wav_files)} audio files.")
    
    if len(wav_files) == 0:
        print("No .wav files found! Make sure your zip/tar files are in data/raw/")
        return
        
    print("Converting audio to Mel-Spectrogram Tensors...")
    processed_count = 0
    
    # Process each file and save as a PyTorch tensor
    for idx, wav_file in enumerate(tqdm(wav_files)):
        tensor = process_audio(wav_file)
        
        if tensor is not None:
            save_name = FILENAME_TEMPLATE.format(idx=idx, stem=wav_file.stem)
            save_path = PROCESSED_DATA_DIR / save_name
            
            torch.save(tensor, save_path)
            processed_count += 1
            
    print(f"\nSuccessfully processed and saved {processed_count} Mel-Spectrograms to {PROCESSED_DATA_DIR}")
    print("These .pt files are exactly what your Dataset class will feed into the VAE!")

if __name__ == "__main__":
    main()