markdown_content = """
| Kanji  |              | example word |                      | translation            |
| :----- | :----------- | :----------- | :------------------- | :------------------- |
| 駐     |（チュウ）| 駐車         | （ちゅうしゃ） | parking                   |
| 満     |（マン）| 満車         | （まんしゃ）  | full of cars              |
| 禁     |（キン）| 禁止         | （きんし）  | prohibition               |
| 関     |（カン）| 関心         | （カンシン）| interest                  |
"""

# we must have a header here, otherwise we will have n-1 kanji in json


def extract_kanji_payload(markdown_content):
    lines = markdown_content.split("\n")
    
    # Extracting lines with Kanji data
    kanji_data = [line for line in lines if line.startswith("|") and "example word" not in line and len(line) > 10][1:]  # Skip table headers and very short lines
    
    payload = []

    for line in kanji_data:
        parts = [part.strip() for part in line.split("|")[1:-1]]  # split by | and remove leading and trailing empty parts
        
        if len(parts) < 4:  # sanity check
            continue
        
        # Cleaning up the extracted data
        kanji = parts[0]
        reading = parts[1].replace("（", "").replace("）", "")
        example_word = parts[2]
        example_reading = parts[3].replace("（", "").replace("）", "")
        
        payload.append({
            "kanji": kanji,
            "reading": reading,
            "exampleWord": example_word,
            "exampleReading": example_reading,
            "audio": f"audio/japanese/kanji/v_{example_word}.mp3",
        })

    return payload

payload = extract_kanji_payload(markdown_content)

# Pretty printing the extracted payload
import json
print(json.dumps(payload, indent=2, ensure_ascii=False))
