import os
import subprocess
import logging
import time
import json
from datetime import datetime

# Usage:
# python3 app_reading_payload_audio.py reading_payload.json 
#
# example file contents
# [
#   {
#     "japanese": "2137年、地球はほとんどの天然資源を使い果たし。",
#     "romanization": "2137-nen, Chikyū wa hotondo no tennen shigen o tsukaihatashi.",
#     "translation": "In 2137, Earth had exhausted most of its natural resources.",
#     "audioPath": "/audio/japanese/reading_1/r_1.mp3"
#   },
#   {


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
    readings = json.load(file)

# Initialize counters
total_processed = 0
total_failed = 0

# Iterate over each entry in the readings
for reading in readings:
    try:
        japanese_text = reading["japanese"]
        output_file_name = os.path.basename(reading["audioPath"])  # Extracting file name like r_1.mp3 from the audioPath
        
        # Create the mp3 file using gtts-cli and save it to the new directory
        subprocess.run(
            [
                "gtts-cli",
                japanese_text,  # Using the Japanese text from the JSON entry for text-to-speech conversion
                "--lang",
                "ja",
                "--output",
                os.path.join(dir_name, output_file_name),
            ]
        )
        
        print(f'Converted text to mp3 and saved to {os.path.join(dir_name, output_file_name)}')
        time.sleep(2)  # Add a sleep time to avoid overloading the system
        total_processed += 1
    except Exception as e:
        logging.error(f"Error processing entry with audioPath {reading['audioPath']}: {e}")
        print(f"Error processing entry with audioPath {reading['audioPath']}: {e}")
        total_failed += 1

print(f"Total processed: {total_processed}, Total failed: {total_failed}")
