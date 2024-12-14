import os
import subprocess
import logging
import time
import json
from datetime import datetime

# Set up logging
logging.basicConfig(filename="reading_conversion.log", level=logging.INFO)

# Get the current date and time in the format yyyy-mm-dd-hh-mm-ss
now = datetime.now()
date_time = now.strftime("%Y-%m-%d-%H-%M-%S")

# Create a new directory to save the mp3 files with timestamp in the name
dir_name = f"reading_{date_time}"
if not os.path.exists(dir_name):
    os.makedirs(dir_name)

# Get the JSON file name from command line arguments
import sys
if len(sys.argv) != 2:
    print("Usage: python script_name.py reading_payload.json")
    sys.exit(1)

json_file = sys.argv[1]

# Load the data from the provided JSON file
with open(json_file, "r", encoding="utf-8") as file:
    payload = json.load(file)
    readings = payload.get("sentencePayload", [])

# Initialize counters
total_processed_jp = 0
total_failed_jp = 0
total_processed_en = 0
total_failed_en = 0

# Iterate over each entry in the readings
for reading in readings:
    # Process Japanese audio
    try:
        japanese_text = reading["japanese"]
        output_file_jp_name = os.path.basename(reading["audioPath"])  # Extracting file name for Japanese audio
        
        # Create the Japanese mp3 file using gtts-cli and save it to the new directory
        subprocess.run(
            [
                "gtts-cli",
                japanese_text,  # Using the Japanese text for text-to-speech conversion
                "--lang",
                "ja",
                "--output",
                os.path.join(dir_name, output_file_jp_name),
            ],
            check=True  # This will raise an exception if the command fails
        )
        
        print(f'Converted Japanese text to mp3 and saved to {os.path.join(dir_name, output_file_jp_name)}')
        total_processed_jp += 1
    except Exception as e:
        logging.error(f"Error processing Japanese entry with audioPath {reading['audioPath']}: {e}")
        print(f"Error processing Japanese entry with audioPath {reading['audioPath']}: {e}")
        total_failed_jp += 1

    # Add a sleep time to avoid overloading the system
    time.sleep(2)

    # Process English audio
    try:
        english_text = reading["translation"]
        output_file_en_name = os.path.basename(reading["audioPathEn"])  # Extracting file name for English audio
        
        # Create the English mp3 file using gtts-cli and save it to the new directory
        subprocess.run(
            [
                "gtts-cli",
                english_text,  # Using the English translation for text-to-speech conversion
                "--lang",
                "en",
                "--output",
                os.path.join(dir_name, output_file_en_name),
            ],
            check=True  # This will raise an exception if the command fails
        )
        
        print(f'Converted English text to mp3 and saved to {os.path.join(dir_name, output_file_en_name)}')
        total_processed_en += 1
    except Exception as e:
        logging.error(f"Error processing English entry with audioPathEn {reading['audioPathEn']}: {e}")
        print(f"Error processing English entry with audioPathEn {reading['audioPathEn']}: {e}")
        total_failed_en += 1

    # Add a sleep time to avoid overloading the system
    time.sleep(2)

# Print out the total counts
print(f"Total processed Japanese: {total_processed_jp}, Total failed Japanese: {total_failed_jp}")
print(f"Total processed English: {total_processed_en}, Total failed English: {total_failed_en}")
