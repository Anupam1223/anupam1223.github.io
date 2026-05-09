import torch

# Create two tensors
a = torch.tensor([[1., 2.], [3., 4.]])
b = torch.tensor([[5., 6.], [7., 8.]])

# Addition
sum_tensor = a + b
print("Addition (a + b):\n", sum_tensor)
print("Addition (torch.add(a, b)):\n", torch.add(a, b))

# Subtraction
diff_tensor = a - b
print("\nSubtraction (a - b):\n", diff_tensor)

# Element-wise Multiplication
mul_tensor = a * b
print("\nElement-wise Multiplication (a * b):\n", mul_tensor)
print("Element-wise Multiplication (torch.mul(a, b)):\n", torch.mul(a, b))

# Division
div_tensor = a / b
print("\nDivision (a / b):\n", div_tensor)

# Exponentiation
pow_tensor = a ** 2
print("\nExponentiation (a ** 2):\n", pow_tensor)
print("Exponentiation (torch.pow(a, 2)):\n", torch.pow(a, 2))


a = torch.tensor([[1., 2.], [3., 4.]])
b = torch.tensor([[5., 6.], [7., 8.]])

print("Original tensor 'a':\n", a)

# Perform in-place addition
a.add_(b) # a is modified directly
print("\nTensor 'a' after a.add_(b):\n", a)

# This would raise an error if uncommented,
# because the result of a + b is a new tensor,
# not suitable for direct assignment back to 'a's memory
# a = a + b # Standard addition creates a new tensor

# Another in-place operation
a.mul_(2) # Multiply 'a' by 2 in-place
print("\nTensor 'a' after a.mul_(2):\n", a)

t = torch.tensor([[1, 2, 3], [4, 5, 6]])
scalar = 10

# Add scalar
print("t + scalar:\n", t + scalar)

# Multiply by scalar
print("\nt * scalar:\n", t * scalar)

# Subtract scalar
print("\nt - scalar:\n", t - scalar)

t = torch.tensor([[1., 4.], [9., 16.]])

# Square root
print("Square Root (torch.sqrt(t)):\n", torch.sqrt(t))

# Exponential
print("\nExponential (torch.exp(t)):\n", torch.exp(t)) # e^x

# Natural Logarithm
# Note: Ensure values are positive for log
t_pos = torch.abs(t) + 1e-6 # Add small epsilon for stability if zeros exist
print("\nNatural Log (torch.log(t_pos)):\n", torch.log(t_pos))

# Absolute value
t_neg = torch.tensor([[-1., 2.], [-3., 4.]])
print("\nAbsolute Value (torch.abs(t_neg)):\n", torch.abs(t_neg))