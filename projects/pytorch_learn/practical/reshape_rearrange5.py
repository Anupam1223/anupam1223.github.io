import torch

# Create a contiguous tensor
x = torch.arange(12) # tensor([ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11])
print(f"Original tensor: {x}")
print(f"Original shape: {x.shape}")
print(f"Is contiguous? {x.is_contiguous()}")

# Reshape using view()
y = x.view(3, 4)
print("\nTensor after view(3, 4):")
print(y)
print(f"New shape: {y.shape}")
print(f"Shares storage with x? {y.storage().data_ptr() == x.storage().data_ptr()}") # Check if they share memory
print(f"Is y contiguous? {y.is_contiguous()}")

# Try another view
z = y.view(2, 6)
print("\nTensor after view(2, 6):")
print(z)
print(f"New shape: {z.shape}")
print(f"Shares storage with x? {z.storage().data_ptr() == x.storage().data_ptr()}")
print(f"Is z contiguous? {z.is_contiguous()}")

# Using -1 for inference
w = x.view(2, 2, -1) # Infers the last dimension to be 3 (12 / (2*2) = 3)
print("\nTensor after view(2, 2, -1):")
print(w)
print(f"New shape: {w.shape}")

# Example of view() failing on a non-contiguous tensor
a = torch.arange(12).view(3, 4)
b = a.t() # Transpose creates a non-contiguous tensor
print(f"\nIs b contiguous? {b.is_contiguous()}")

try:
    c = b.view(12)
except RuntimeError as e:
    print(f"\nError trying b.view(12): {e}")

# Using reshape() on the non-contiguous tensor 'b'
print(f"\nOriginal non-contiguous tensor b:\n{b}")
print(f"Shape of b: {b.shape}")
print(f"Is b contiguous? {b.is_contiguous()}")

# Reshape works even if 'b' is not contiguous
c = b.reshape(12)
print(f"\nTensor c after b.reshape(12):\n{c}")
print(f"Shape of c: {c.shape}")
print(f"Is c contiguous? {c.is_contiguous()}")

# Check if 'c' shares storage with 'b'. It likely won't because reshape probably copied.
print(f"Shares storage with b? {c.storage().data_ptr() == b.storage().data_ptr()}")

# Reshape can also infer dimensions with -1
d = b.reshape(2, -1) # Infers the last dimension to be 6
print(f"\nTensor d after b.reshape(2, -1):\n{d}")
print(f"Shape of d: {d.shape}")

# Create a 3D tensor (e.g., representing C, H, W)
image_tensor = torch.randn(3, 32, 32) # Channels, Height, Width
print(f"Original shape: {image_tensor.shape}") # torch.Size([3, 32, 32])

# Permute to (Height, Width, Channels)
permuted_tensor = image_tensor.permute(1, 2, 0) # Specify new order: Dim 1, Dim 2, Dim 0
print(f"Permuted shape: {permuted_tensor.shape}") # torch.Size([32, 32, 3])

# Permute usually returns a non-contiguous view
print(f"Is permuted_tensor contiguous? {permuted_tensor.is_contiguous()}")

# Permuting back
original_again = permuted_tensor.permute(2, 0, 1) # Back to C, H, W
print(f"Shape after permuting back: {original_again.shape}") # torch.Size([3, 32, 32])
print(f"Is original_again contiguous? {original_again.is_contiguous()}") # Might still be non-contiguous

# Check storage sharing
print(f"Shares storage with original? {original_again.storage().data_ptr() == image_tensor.storage().data_ptr()}")

# Make the permuted tensor contiguous
contiguous_permuted = permuted_tensor.contiguous()
print(f"\nIs contiguous_permuted contiguous? {contiguous_permuted.is_contiguous()}")

# Now view() can be used safely
flattened_permuted = contiguous_permuted.view(-1)
print(f"Shape after flattening: {flattened_permuted.shape}")
