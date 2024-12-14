# given kanji related json file
# we are getting example word and generating audio for it
# call like
# python3 app_words.py n3kanji1.json



import os
import subprocess
import json
from datetime import datetime
import time
import logging
import sys

# Set up logging
logging.basicConfig(filename="word_conversion.log", level=logging.INFO)

# Get the current date and time in the format yyyy-mm-dd-hh-mm-ss
now = datetime.now()
date_time = now.strftime("%Y-%m-%d-%H-%M-%S")

# get the input json file
input_file = sys.argv[1]

# check if input file exists
if not os.path.exists(input_file):
    raise Exception("Input file not found")

# Create a new directory to save the mp3 files
dir_name = f"words_{date_time}"
if not os.path.exists(dir_name):
    os.makedirs(dir_name)

# Load the JSON file
try:
    with open(input_file) as json_file:
        data = json.load(json_file)
except json.decoder.JSONDecodeError as e:
    logging.error(f"Error decoding JSON file: {e}")
    print(f"Error decoding JSON file: {e}")
    exit()

# Iterate through each word object in the JSON data
words_processed = 0
words_failed = 0
for word in data:
    try:
        file_name = os.path.basename(word["audio"])  # Extract the filename from the audio path
        # Create the mp3 file using gtts-cli and save it to the new directory
        subprocess.run(
            [
                "gtts-cli",
                word["exampleWord"],  # Using the exampleWord for text-to-speech conversion
                "--lang",
                "ja",
                "--output",
                f"{dir_name}/{file_name}",
            ]
        )
        words_processed += 1

        print(f'Converted {word["exampleWord"]} to mp3 and saved to {dir_name}/{file_name}')
        # Add a sleep time to avoid overloading the system
        time.sleep(2)
    except Exception as e:
        logging.error(f"Error processing word: {word['exampleWord']}, Error: {e}")
        print(f"Error processing word: {word['exampleWord']}")
        words_failed += 1

logging.info(f"Words processed: {words_processed}, Words failed: {words_failed}")
print(f"Words processed: {words_processed}, Words failed: {words_failed}")
