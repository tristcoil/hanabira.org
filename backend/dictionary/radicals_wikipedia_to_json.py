import json

def parse_kanji_radicals_file(file_path):
    kanji_radicals_dict = {}
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()
            if line.startswith("#") or not line:
                continue
            parts = line.split("\t:")
            if len(parts) == 2:
                kanji, description = parts
                kanji_radicals_dict[kanji.strip()] = description.strip()
    return kanji_radicals_dict

def write_json(data, output_path):
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    input_file = 'radicals_wikipedia.txt'  # Replace with your input file path
    output_file = 'radicals_wikipedia.json'  # Replace with your desired output file path

    kanji_radicals_data = parse_kanji_radicals_file(input_file)
    write_json(kanji_radicals_data, output_file)

    print(f"Kanji radicals descriptions have been successfully written to {output_file}")