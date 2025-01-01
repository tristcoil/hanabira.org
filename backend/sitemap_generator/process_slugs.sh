#!/bin/bash

#input_file="grammar_slugs.txt"
#output_file="output_slugs.txt"
#prefix=""

# input_file="grammar_slugs_korean.txt"
# output_file="output_slugs_korean.txt"
# prefix="/langs/korean"

# input_file="grammar_slugs_thai.txt"
# output_file="output_slugs_thai.txt"
# prefix="/langs/thai"


# input_file="grammar_slugs_vietnamese.txt"
# output_file="output_slugs_vietnamese.txt"
# prefix="/langs/vietnamese"


input_file="grammar_slugs_mandarin.txt"
output_file="output_slugs_mandarin.txt"
prefix="/langs/mandarin"



# Check if the input file exists
if [ ! -f "$input_file" ]; then
  echo "Input file '$input_file' not found."
  exit 1
fi

# Create or overwrite the output file
> "$output_file"

# Read each line from the input file and process it
while IFS= read -r line; do
  # Remove trailing comma, whitespace, and double quotes
  line=$(echo "$line" | sed 's/, *$//; s/"//g')

  # Convert the line to the desired format
  output_line="{ url: '${prefix}/grammarpoint/${line}' },"
  echo "$output_line" >> "$output_file"
done < "$input_file"

echo "Conversion completed. Output saved to '$output_file'."
