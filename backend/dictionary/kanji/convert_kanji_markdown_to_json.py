# script converts markdown file with kanji to json that can be seeded to db
# python3 convert_kanji_markdown_to_json.py n3kanji1.md n3kanji1.json JLPT_N3 part_1

import sys
import json


def extract_kanji_payload(markdown_content, p_tag, s_tag):
    lines = markdown_content.split("\n")

    # Extracting lines with Kanji data
    kanji_data = [
        line
        for line in lines
        if line.startswith("|") and "example word" not in line and len(line) > 10
    ][
        1:
    ]  # Skip table headers and very short lines

    payload = []

    for line in kanji_data:
        parts = [
            part.strip() for part in line.split("|")[1:-1]
        ]  # split by | and remove leading and trailing empty parts

        if len(parts) < 5:  # sanity check
            continue

        # Cleaning up the extracted data
        kanji = parts[0]
        reading = parts[1].replace("（", "").replace("）", "")
        example_word = parts[2]
        example_reading = parts[3].replace("（", "").replace("）", "")
        translation = parts[4]

        payload.append(
            {
                "kanji": kanji,
                "reading": reading,
                "k_audio": f"/audio/japanese/kanji/k_{kanji}.mp3",
                "exampleWord": example_word,
                "exampleReading": example_reading,
                "translation": translation,
                "audio": f"/audio/japanese/kanji/v_{example_word}.mp3",
                "p_tag": p_tag,
                "s_tag": s_tag,
            }
        )

    return payload


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(
            "Usage: python3 script_name.py <input_markdown_file> <output_json_file> <parent_tag> <sub_tag>"
        )
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    p_tag = sys.argv[3]
    s_tag = sys.argv[4]

    with open(input_file, "r", encoding="utf-8") as f:
        markdown_content = f.read()

    payload = extract_kanji_payload(markdown_content, p_tag, s_tag)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Data has been written to {output_file}.")
