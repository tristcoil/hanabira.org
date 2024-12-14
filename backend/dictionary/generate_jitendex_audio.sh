#!/bin/bash

# Directory where audio files will be saved
mkdir -p jitendex_audio

# Read each entry from the JSON array in test.json
jq -c '.[]' test.json | while read i; do
  # Extract the Japanese word (from the "1" key for audio) and the label (from the "0" key for filename)
  japanese_word=$(echo $i | jq -r '.["1"]')
  label=$(echo $i | jq -r '.["0"]')

  # Check if japanese_word is empty, if so assign the value of label to it
  if [[ -z "$japanese_word" ]]; then
    japanese_word="$label"
  fi

  # Generate filename for the MP3 file using the label from the "0" key
  filename="jitendex_audio/v_${label}.mp3"

  # Use gtts-cli to generate an MP3 file from the Japanese word
  echo "Generating $filename"
  gtts-cli "$japanese_word" --lang ja --output $filename
  
  sleep 1
done

echo "Audio files generated in the jitendex_audio directory."

exit 0






# -------------------------------------------------------------------
# #!/bin/bash

# # Directory where audio files will be saved
# mkdir -p jitendex_audio

# # Read each entry from the JSON array in test.json
# jq -c '.[]' test.json | while read i; do
#   # Extract the Japanese word (from the "1" key for audio) and the label (from the "0" key for filename)
#   japanese_word=$(echo $i | jq -r '.["1"]')
#   label=$(echo $i | jq -r '.["0"]')

#   # Generate filename for the MP3 file using the label from the "0" key
#   filename="jitendex_audio/v_${label}.mp3"

#   # Use gtts-cli to generate an MP3 file from the Japanese word
#   echo "Generating $filename"
#   gtts-cli "$japanese_word" --lang ja --output $filename
  
#   sleep 1
# done

# echo "Audio files generated in the jitendex_audio directory."

# exit 0