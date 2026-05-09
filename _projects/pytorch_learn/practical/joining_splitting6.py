import torch

# Create two tensors
tensor_a = torch.randn(2, 3)
tensor_b = torch.randn(2, 3)
print(f"Tensor A (Shape: {tensor_a.shape}):\n{tensor_a}")
print(f"Tensor B (Shape: {tensor_b.shape}):\n{tensor_b}\n")

# Concatenate along dimension 0 (rows)
# Resulting shape: (2+2, 3) = (4, 3)
cat_dim0 = torch.cat((tensor_a, tensor_b), dim=0)
print(f"Concatenated along dim=0 (Shape: {cat_dim0.shape}):\n{cat_dim0}\n")

# Concatenate along dimension 1 (columns)
# Tensors must match in other dimensions (dim 0)
# Resulting shape: (2, 3+3) = (2, 6)
cat_dim1 = torch.cat((tensor_a, tensor_b), dim=1)
print(f"Concatenated along dim=1 (Shape: {cat_dim1.shape}):\n{cat_dim1}")

# Example with 3D tensors
tensor_c = torch.randn(1, 2, 3)
tensor_d = torch.randn(1, 2, 3)
# Concatenate along dim 0 (batch dimension)
# Resulting shape: (1+1, 2, 3) = (2, 2, 3)
cat_3d_dim0 = torch.cat((tensor_c, tensor_d), dim=0)
print(f"\nConcatenated 3D along dim=0 (Shape: {cat_3d_dim0.shape})")


# Create two tensors with the same shape
tensor_e = torch.arange(6).reshape(2, 3)
tensor_f = torch.arange(6, 12).reshape(2, 3)
print(f"Tensor E (Shape: {tensor_e.shape}):\n{tensor_e}")
print(f"Tensor F (Shape: {tensor_f.shape}):\n{tensor_f}\n")

# Stack along a new dimension 0
# Resulting shape: (2, 2, 3)
stack_dim0 = torch.stack((tensor_e, tensor_f), dim=0)
print(f"Stacked along new dim=0 (Shape: {stack_dim0.shape}):\n{stack_dim0}\n")

# Stack along a new dimension 1
# Resulting shape: (2, 2, 3)
stack_dim1 = torch.stack((tensor_e, tensor_f), dim=1)
print(f"Stacked along new dim=1 (Shape: {stack_dim1.shape}):\n{stack_dim1}\n")

# Stack along a new dimension 2 (last dimension)
# Resulting shape: (2, 3, 2)
stack_dim2 = torch.stack((tensor_e, tensor_f), dim=2)
print(f"Stacked along new dim=2 (Shape: {stack_dim2.shape}):\n{stack_dim2}")

# Create a tensor to split
tensor_g = torch.arange(12).reshape(6, 2)
print(f"Original Tensor (Shape: {tensor_g.shape}):\n{tensor_g}\n")

# Split into chunks of size 2 along dimension 0 (rows)
# 6 rows / 2 rows/chunk = 3 chunks
split_equal = torch.split(tensor_g, 2, dim=0)
print("Split into equal chunks of size 2 (dim=0):")
for i, chunk in enumerate(split_equal):
    print(f" Chunk {i} (Shape: {chunk.shape}):\n{chunk}")

print("-" * 20)

# Split into chunks of sizes [1, 2, 3] along dimension 0
# Total size must sum to the dimension size (1 + 2 + 3 = 6)
split_unequal = torch.split(tensor_g, [1, 2, 3], dim=0)
print("\nSplit into unequal chunks [1, 2, 3] (dim=0):")
for i, chunk in enumerate(split_unequal):
    print(f" Chunk {i} (Shape: {chunk.shape}):\n{chunk}")

print("-" * 20)

# Split along dimension 1 (columns)
# Shape: (6, 2). Split into chunks of size 1 along dim=1
split_dim1 = torch.split(tensor_g, 1, dim=1)
print("\nSplit into equal chunks of size 1 (dim=1):")
for i, chunk in enumerate(split_dim1):
    # Using squeeze removes the dimension of size 1 for clearer display
    print(f" Chunk {i} (Shape: {chunk.shape}):\n{chunk.squeeze()}")


# Create a tensor
tensor_h = torch.arange(10).reshape(5, 2) # Size 5 along dim 0
print(f"Original Tensor (Shape: {tensor_h.shape}):\n{tensor_h}\n")

# Split into 3 chunks along dimension 0
# 5 rows / 3 chunks -> sizes will be [2, 2, 1] ( ceil(5/3)=2 for first chunks)
chunked_tensor = torch.chunk(tensor_h, 3, dim=0)
print("Chunked into 3 parts (dim=0):")
for i, chunk in enumerate(chunked_tensor):
    print(f" Chunk {i} (Shape: {chunk.shape}):\n{chunk}")

print("-" * 20)

# Create another tensor
tensor_i = torch.arange(12).reshape(3, 4) # Size 4 along dim 1
print(f"\nOriginal Tensor (Shape: {tensor_i.shape}):\n{tensor_i}\n")

# Split into 2 chunks along dimension 1
# 4 cols / 2 chunks -> sizes will be [2, 2] ( ceil(4/2)=2 )
chunked_tensor_dim1 = torch.chunk(tensor_i, 2, dim=1)
print("Chunked into 2 parts (dim=1):")
for i, chunk in enumerate(chunked_tensor_dim1):
    print(f" Chunk {i} (Shape: {chunk.shape}):\n{chunk}")

