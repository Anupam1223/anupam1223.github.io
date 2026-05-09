import torch

# Create a 1D tensor
x_1d = torch.tensor([10, 11, 12, 13, 14])
print(f"Original 1D tensor:\n{x_1d}")

# Access the first element
first_element = x_1d[0]
print(f"\nFirst element (x_1d[0]): {first_element}, Type: {type(first_element)}")

# Access the last element
last_element = x_1d[-1]
print(f"Last element (x_1d[-1]): {last_element}")

# Modify an element
x_1d[1] = 110
print(f"\nModified tensor:\n{x_1d}")

# Create a 2D tensor (e.g., a small matrix)
x_2d = torch.tensor([[1, 2, 3],
                     [4, 5, 6],
                     [7, 8, 9]])
print(f"Original 2D tensor:\n{x_2d}")

# Access the element at row 0, column 1
element_0_1 = x_2d[0, 1]
print(f"\nElement at [0, 1]: {element_0_1}")

# Access the entire first row (index 0)
first_row = x_2d[0] # or x_2d[0, :]
print(f"\nFirst row (x_2d[0]): {first_row}")

# Access the entire second column (index 1)
second_col = x_2d[:, 1]
print(f"Second column (x_2d[:, 1]): {second_col}")

# Modify an element
x_2d[1, 1] = 55
print(f"\nModified 2D tensor:\n{x_2d}")

# Create a 1D tensor
y_1d = torch.arange(10) # Tensor([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
print(f"Original 1D tensor: {y_1d}")

# Select elements from index 2 up to (not including) index 5
slice1 = y_1d[2:5]
print(f"\nSlice y_1d[2:5]: {slice1}")

# Select elements from the beginning up to index 4
slice2 = y_1d[:4]
print(f"Slice y_1d[:4]: {slice2}")

# Select elements from index 6 to the end
slice3 = y_1d[6:]
print(f"Slice y_1d[6:]: {slice3}")

# Select every second element
slice4 = y_1d[::2]
print(f"Slice y_1d[::2]: {slice4}")

# Select elements from index 1 to 7, with a step of 2
slice5 = y_1d[1:8:2]
print(f"Slice y_1d[1:8:2]: {slice5}")

# Reverse the tensor
slice6 = y_1d.flip(dims=[0])
print(f"Reversed tensor using .flip(dims=[0]): {slice6}")

# Create a 3x4 tensor
x_2d = torch.tensor([[ 0,  1,  2,  3],
                     [ 4,  5,  6,  7],
                     [ 8,  9, 10, 11]])
print(f"Original 2D tensor:\n{x_2d}")

# Select the first two rows and columns 1 and 2
sub_tensor1 = x_2d[0:2, 1:3]
print(f"\nSlice x_2d[0:2, 1:3]:\n{sub_tensor1}")

# Select all rows, but only the last two columns
sub_tensor2 = x_2d[:, -2:]
print(f"\nSlice x_2d[:, -2:]:\n{sub_tensor2}")

# Select the first row, columns 1 to the end
sub_tensor3 = x_2d[0, 1:]
print(f"\nSlice x_2d[0, 1:]:\n{sub_tensor3}")

# Select rows 0 and 2 (using step), all columns
sub_tensor4 = x_2d[::2, :]
print(f"\nSlice x_2d[::2, :]:\n{sub_tensor4}")

print(f"Original x_2d before modifying slice:\n{x_2d}")

# Get a slice
sub_tensor = x_2d[0:2, 1:3]

# Modify the slice
sub_tensor[0, 0] = 101

print(f"\nSlice after modification:\n{sub_tensor}")
print(f"\nOriginal x_2d after modifying slice:\n{x_2d}") # Note the change!

# Create a tensor
data = torch.tensor([[1, 2], [3, 4], [5, 6]])
print(f"Original data tensor:\n{data}")

# Create a boolean mask (e.g., select elements greater than 3)
mask = data > 3
print(f"\nBoolean mask (data > 3):\n{mask}")

# Apply the mask
selected_elements = data[mask]
print(f"\nElements selected by mask:\n{selected_elements}")
print(f"Shape of selected elements: {selected_elements.shape}")

# Modify elements based on a condition
data[data <= 3] = 0
print(f"\nData after setting elements <= 3 to zero:\n{data}")

# Select rows where the first column is greater than 2
row_mask = data[:, 0] > 2
print(f"\nRow mask (data[:, 0] > 2): {row_mask}")

selected_rows = data[row_mask, :] # Use ':' for selecting all columns in the chosen rows
# Or simply: data[row_mask] - PyTorch often infers the full row selection
print(f"\nRows where first column > 2:\n{selected_rows}")

x = torch.arange(10, 20) # Tensor([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
print(f"Original 1D tensor: {x}")

indices = torch.tensor([0, 4, 2, 2]) # Note the repeated index 2
selected = x[indices]
print(f"\nSelected elements using indices {indices}: {selected}")

# For 2D tensors
y = torch.arange(12).reshape(3, 4)
# [[ 0,  1,  2,  3],
#  [ 4,  5,  6,  7],
#  [ 8,  9, 10, 11]]
print(f"\nOriginal 2D tensor:\n{y}")

# Select specific rows
row_indices = torch.tensor([0, 2])
selected_rows = y[row_indices] # Selects rows 0 and 2
print(f"\nSelected rows using indices {row_indices}:\n{selected_rows}")

# Select specific columns
col_indices = torch.tensor([1, 3])
selected_cols = y[:, col_indices] # Selects columns 1 and 3 from all rows
print(f"\nSelected columns using indices {col_indices}:\n{selected_cols}")

# Select specific elements using pairs of indices
row_idx = torch.tensor([0, 1, 2])
col_idx = torch.tensor([1, 3, 0])
selected_elements = y[row_idx, col_idx] # Selects (0,1), (1,3), (2,0) -> [1, 7, 8]
print(f"\nSelected specific elements using (row_idx, col_idx):\n{selected_elements}")
