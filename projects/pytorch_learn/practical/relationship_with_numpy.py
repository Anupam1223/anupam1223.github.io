import numpy as np
import torch

# Create a NumPy array
numpy_array = np.array([[1, 2], [3, 4]], dtype=np.float32)
print(f"NumPy array:\n{numpy_array}")
print(f"NumPy array type: {numpy_array.dtype}")

# Convert NumPy array to PyTorch Tensor
pytorch_tensor = torch.from_numpy(numpy_array)
print(f"\nPyTorch Tensor:\n{pytorch_tensor}")
print(f"PyTorch Tensor type: {pytorch_tensor.dtype}")

# Modify the NumPy array
numpy_array[0, 0] = 99
print(f"\nModified NumPy array:\n{numpy_array}")
print(f"PyTorch Tensor after modifying NumPy array:\n{pytorch_tensor}")

# Modify the PyTorch Tensor
pytorch_tensor[1, 1] = -1
print(f"\nModified PyTorch Tensor:\n{pytorch_tensor}")
print(f"NumPy array after modifying PyTorch Tensor:\n{numpy_array}")

# Create a PyTorch Tensor on the CPU
cpu_tensor = torch.tensor([[10.0, 20.0], [30.0, 40.0]])
print(f"Original PyTorch Tensor (CPU):\n{cpu_tensor}")

# Convert Tensor to NumPy array
numpy_array_converted = cpu_tensor.numpy()
print(f"\nConverted NumPy array:\n{numpy_array_converted}")
print(f"NumPy array type: {numpy_array_converted.dtype}")

# Modify the Tensor
cpu_tensor[0, 1] = 25.0
print(f"\nModified PyTorch Tensor:\n{cpu_tensor}")
print(f"NumPy array after modifying Tensor:\n{numpy_array_converted}")

# Modify the NumPy array
numpy_array_converted[1, 0] = 35.0
print(f"\nModified NumPy array:\n{numpy_array_converted}")
print(f"Tensor after modifying NumPy array:\n{cpu_tensor}")

# Example assuming a GPU is available
if torch.cuda.is_available():
    gpu_tensor = torch.tensor([[1.0, 2.0], [3.0, 4.0]], device='cuda')
    print(f"\nTensor on GPU:\n{gpu_tensor}")

    # This would cause an error: numpy_from_gpu = gpu_tensor.numpy()

    # Correct way: move to CPU first
    cpu_tensor_from_gpu = gpu_tensor.cpu()
    numpy_from_gpu = cpu_tensor_from_gpu.numpy()
    print(f"\nConverted NumPy array (from GPU Tensor):\n{numpy_from_gpu}")

    # Note: numpy_from_gpu shares memory with cpu_tensor_from_gpu,
    # but NOT with the original gpu_tensor.
else:
    print("\nCUDA not available, skipping GPU to NumPy example.")

