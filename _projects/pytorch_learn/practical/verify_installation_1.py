import torch
import numpy as np # We'll use NumPy for comparison later

# Print PyTorch version
print(f"PyTorch Version: {torch.__version__}")

# Check if CUDA (GPU support) is available
if torch.cuda.is_available():
    print(f"CUDA is available. Device: {torch.cuda.get_device_name(0)}")
    # Get the default device PyTorch will use
    device = torch.device("cuda")
else:
    print("CUDA not available. Using CPU.")
    device = torch.device("cpu")

print(f"Default device: {device}")
