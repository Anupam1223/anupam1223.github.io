import torch

# Tensor A: Shape [2, 3]
a = torch.tensor([[1, 2, 3], [4, 5, 6]])
# Scalar B: Shape [] (0 dimensions)
b = torch.tensor(10)

# Add scalar to tensor
c = a + b

print(f"Shape of a: {a.shape}")
# Shape of a: torch.Size([2, 3])
print(f"Shape of b: {b.shape}")
# Shape of b: torch.Size([])
print(f"Shape of c: {c.shape}")
# Shape of c: torch.Size([2, 3])
print(f"Result c:\n{c}")
# Result c:
# tensor([[11, 12, 13],
#         [14, 15, 16]])

# Tensor A: Shape [2, 3]
a = torch.tensor([[1, 2, 3],
                  [4, 5, 6]])
# Tensor B: Shape [3] (can be seen as [1, 3] for broadcasting)
b = torch.tensor([10, 20, 30])

# Add row vector to matrix
c = a + b

print(f"Shape of a: {a.shape}") # torch.Size([2, 3])
print(f"Shape of b: {b.shape}") # torch.Size([3])
print(f"Shape of c: {c.shape}") # torch.Size([2, 3])
print(f"Result c:\n{c}")
# Result c:
# tensor([[11, 22, 33],
#         [14, 25, 36]])

# Tensor A: Shape [2, 3]
a = torch.tensor([[1, 2, 3],
                  [4, 5, 6]])
# Tensor B: Shape [2, 1]
b = torch.tensor([[10], [20]])

# Add column vector to matrix
c = a + b

print(f"Shape of a: {a.shape}") # torch.Size([2, 3])
print(f"Shape of b: {b.shape}") # torch.Size([2, 1])
print(f"Shape of c: {c.shape}") # torch.Size([2, 3])
print(f"Result c:\n{c}")
# Result c:
# tensor([[11, 12, 13],
#         [24, 25, 26]])

# Tensor A: Shape [2, 3]
a = torch.tensor([[1, 2, 3], [4, 5, 6]])
# Tensor B: Shape [2]
b = torch.tensor([10, 20])

try:
    c = a + b
except RuntimeError as e:
    print(f"Error: {e}")
# Error: The size of tensor a (3) must match the size of tensor b (2) at non-singleton dimension 1
