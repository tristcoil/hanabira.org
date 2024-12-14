 # Import necessary libraries
import os

# List of common encodings to try
encodings = [
    'utf-8',
    'shift_jis',
    'euc_jp',
    'gb2312',
    'gb18030',
    'big5',
    'iso-2022-jp',
]

# Path to the input file
input_file_path = 'kradfile'

# Function to attempt reading the file with different encodings
def try_encodings(file_path, encodings):
    # Check if the input file exists
    if not os.path.exists(file_path):
        print(f"Input file '{file_path}' not found.")
        return

    # Read the file with different encodings
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                content = f.read()

            # Write the content to a new file with the encoding name
            output_file_path = f'output_{encoding}.txt'
            with open(output_file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Successfully decoded with {encoding}. Output written to '{output_file_path}'.")

        except Exception as e:
            print(f"Failed to decode with {encoding}: {e}")

# Run the function with the provided input file and encodings
try_encodings(input_file_path, encodings)

