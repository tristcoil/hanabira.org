import os
import subprocess
import logging
from datetime import datetime
import time
import glob

# Set up logging
logging.basicConfig(filename="reading_conversion.log", level=logging.INFO)

# Get the current date and time in the format yyyy-mm-dd-hh-mm-ss
now = datetime.now()
date_time = now.strftime("%Y-%m-%d-%H-%M-%S")

# Create a new directory to save the mp3 files
dir_name = f"reading_{date_time}"
if not os.path.exists(dir_name):
    os.makedirs(dir_name)

# Get all the reading*.txt files in the current directory
text_files = glob.glob("*en_reading*.txt")

# Initialize counters
total_processed = 0
total_failed = 0

# Iterate over each txt file
for input_file in text_files:
    try:
        with open(input_file, 'r', encoding="utf-8") as file:
            data = file.read()

        try:
            file_name = os.path.splitext(input_file)[0] + ".mp3"  # Naming convention for the audio file based on txt file name
            # Create the mp3 file using gtts-cli and save it to the new directory
            subprocess.run(
                [
                    "gtts-cli",
                    data,  # Using the reading text from the file for text-to-speech conversion
                    "--lang",
                    "en",
                    "--output",
                    os.path.join(dir_name, file_name),
                ]
            )

            print(f'Converted contents of {input_file} to mp3 and saved to {dir_name}/{file_name}')
            time.sleep(2)  # Add a sleep time to avoid overloading the system
            total_processed += 1
        except Exception as e:
            logging.error(f"Error processing file: {input_file}, Error: {e}")
            print(f"Error processing file: {input_file}")
            total_failed += 1

    except Exception as e:
        logging.error(f"Error reading file {input_file}: {e}")
        print(f"Error reading file {input_file}: {e}")

print(f"Total processed: {total_processed}, Total failed: {total_failed}")
