import os
import json
import re

# Define input files
jlpt_levels = ["N5", "N4", "N3", "N2", "N1"]
kanji_damage_links_file = "kanji_damage_links.txt"

# Function to parse kanji links
def parse_kanji_links(links_file):
    kanji_links = {}
    with open(links_file, "r", encoding="utf-8") as f:
        for line in f:
            match = re.search(r'<a href="(.*?)">(.*?)</a>', line)
            if match:
                uri, kanji = match.groups()
                kanji_links[kanji] = uri
    return kanji_links

# Function to process each JLPT file and create a JSON output
def process_jlpt_files(jlpt_levels, kanji_links):
    for level in jlpt_levels:
        kanji_file = f"tanos_kanji_{level}.txt"
        output_file = f"kanji_{level}.json"

        if not os.path.exists(kanji_file):
            print(f"File not found: {kanji_file}")
            continue

        kanji_list = []
        with open(kanji_file, "r", encoding="utf-8") as f:
            for line in f:
                kanji = line.strip()
                kanji_list.append({"kanji": kanji, "uri": kanji_links.get(kanji, "")})

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(kanji_list, f, ensure_ascii=False, indent=2)
        print(f"Generated: {output_file}")

# Main script
if __name__ == "__main__":
    kanji_links = parse_kanji_links(kanji_damage_links_file)
    process_jlpt_files(jlpt_levels, kanji_links)