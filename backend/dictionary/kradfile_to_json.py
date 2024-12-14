import json

def parse_kanji_file(file_path):
    kanji_dict = {}
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()
            if line.startswith("#") or not line:
                continue
            parts = line.split(" : ")
            if len(parts) == 2:
                kanji, radicals = parts
                kanji_dict[kanji] = radicals.split()
    return kanji_dict

def write_json(data, output_path):
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    input_file = 'kradfile_decoded_euc_jp.txt'  # Replace with your input file path
    output_file = 'kradfile_decoded_euc_jp.json'  # Replace with your desired output file path

    kanji_data = parse_kanji_file(input_file)
    write_json(kanji_data, output_file)

    print(f"Kanji radicals have been successfully written to {output_file}")
