# pip install --upgrade deepl


import deepl

# Replace 'YOUR_AUTH_KEY' with your actual DeepL API authentication key
auth_key = "YOUR_AUTH_KEY"

# Create a translator object
translator = deepl.Translator(auth_key)

def translate_japanese_to_english(text):
    try:
        # Translate text from Japanese to English
        result = translator.translate_text(text, target_lang="EN-US")
        translated_text = result.text
        return translated_text
    except deepl.DeepLException as e:
        print(f"Translation error: {e}")
        return None

# Example usage
japanese_text = "今日はいい天気ですね"
english_translation = translate_japanese_to_english(japanese_text)
print("Japanese Text:", japanese_text)
print("English Translation:", english_translation)




