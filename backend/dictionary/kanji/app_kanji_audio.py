import os
import subprocess
import json
import logging
from datetime import datetime
import time
import glob

# Set up logging
logging.basicConfig(filename="kanji_conversion.log", level=logging.INFO)

# Get the current date and time in the format yyyy-mm-dd-hh-mm-ss
now = datetime.now()
date_time = now.strftime("%Y-%m-%d-%H-%M-%S")

# Create a new directory to save the mp3 files
dir_name = f"kanji_{date_time}"
if not os.path.exists(dir_name):
    os.makedirs(dir_name)

# Get all the .json files in the current directory
json_files = glob.glob("*kanji*.json")

# Initialize counters
total_processed = 0
total_failed = 0

# Iterate over each JSON file
for input_file in json_files:
    try:
        with open(input_file) as json_file:
            data = json.load(json_file)

        # Iterate through each kanji object in the JSON data
        words_processed = 0
        words_failed = 0
        for entry in data:
            try:
                file_name = f"k_{entry['kanji']}.mp3"  # Naming convention for the audio file
                # Create the mp3 file using gtts-cli and save it to the new directory
                subprocess.run(
                    [
                        "gtts-cli",
                        entry["reading"],  # Using the reading for text-to-speech conversion
                        "--lang",
                        "ja",
                        "--output",
                        os.path.join(dir_name, file_name),
                    ]
                )
                words_processed += 1

                print(f'Converted {entry["reading"]} to mp3 and saved to {dir_name}/{file_name}')
                time.sleep(2)  # Add a sleep time to avoid overloading the system
            except Exception as e:
                logging.error(f"Error processing kanji: {entry['kanji']}, Error: {e}")
                print(f"Error processing kanji: {entry['kanji']}")
                words_failed += 1

        logging.info(f"Words processed: {words_processed}, Words failed: {words_failed}")
        print(f"Words processed: {words_processed}, Words failed: {words_failed}")

        total_processed += words_processed
        total_failed += words_failed

    except json.decoder.JSONDecodeError as e:
        logging.error(f"Error decoding JSON file {input_file}: {e}")
        print(f"Error decoding JSON file {input_file}: {e}")

print(f"Total processed: {total_processed}, Total failed: {total_failed}")
