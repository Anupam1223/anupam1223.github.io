import os
from pathlib import Path
import torch
from torch.utils.data import Dataset, DataLoader

class AudioLatentDataset(Dataset):
    """
    Loads the preprocessed Mel-Spectrogram tensors (.pt files) 
    to feed into the VAE and Normalizing Flow.
    """
    def __init__(self, data_dir="data/processed"):
        self.data_dir = Path(data_dir)
        # Find all the .pt files created by our preprocessing script
        self.file_paths = list(self.data_dir.glob("*.pt"))
        
        if len(self.file_paths) == 0:
            raise RuntimeError(f"No .pt files found in {self.data_dir}. Did you run preprocessing?")
            
    def __len__(self):
        # Tells PyTorch exactly how many audio files we have
        return len(self.file_paths)
        
    def __getitem__(self, idx):
        # This function is called by PyTorch every time it needs a new data point
        tensor_path = self.file_paths[idx]
        mel_spec = torch.load(tensor_path)
        
        # The tensor is already shape [1, 80, 258] and normalized.
        # For our generative model, we only need the audio data itself, no labels.
        return mel_spec

# --- Quick Local Test Block ---
if __name__ == "__main__":
    print("Testing the Dataset pipeline...")
    
    # 1. Initialize the dataset
    dataset = AudioLatentDataset()
    print(f"✅ Dataset successfully loaded {len(dataset)} items.")
    
    # 2. Grab a single item
    sample_tensor = dataset[0]
    print(f"✅ Single tensor shape: {sample_tensor.shape}")
    
    # 3. Test the DataLoader (this is what your training loop actually uses)
    # It grabs 32 random audio files and stacks them into one massive tensor block
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    batch = next(iter(dataloader))
    
    print(f"✅ Batch shape: {batch.shape}")
    print("🚀 Data pipeline is complete and ready for the Neural Network!")