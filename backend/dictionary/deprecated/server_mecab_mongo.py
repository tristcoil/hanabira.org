from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors module
from pymongo import MongoClient
import json
import logging


PORT=5400


app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['mecabWords']  # Replace 'yourDatabaseName' with your actual database name



# Setup for the new database
def configure_language_db():
    return client['sentenceMining']     # this one is for sentence mining 

language_db = configure_language_db()





logging.basicConfig(level=logging.INFO)  # Set logging level to INFO



# -----

# from flask import Flask, request, jsonify

# from pymongo import MongoClient
# import json
# import logging

# app = Flask(__name__)
# CORS(app)  # Enable CORS for your Flask app

# # MongoDB connection
# client = MongoClient('mongodb://localhost:27017/')
# db = client['mecabWords']  # Replace 'yourDatabaseName' with your actual database name

# logging.basicConfig(level=logging.INFO)  # Set logging level to INFO











# API endpoint to receive POST calls w vocab knowledge status
# curl -X POST \
#   http://localhost:5400/user-vocabulary \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "username": "example_user",
#     "original": "行き",
#     "dictionary": "行く",
#     "furigana": "いき",
#     "status": "seen"
# }'
@app.route('/user-vocabulary', methods=['POST'])
def add_user_vocabulary():
    data = request.json
    app.logger.info(f'Incoming payload: {data}') 

    if 'username' not in data:
        app.logger.error('Username is missing in the payload')  # Example error logging
        return jsonify({'error': 'Username is missing'}), 400
    
    username = data['username']
    word_data = {
        'original': data['original'],
        'dictionary': data['dictionary'],
        'furigana': data['furigana'],
        'status': data['status']
    }
    
    # Update or insert data into MongoDB
    collection = db[username]  # Creating a collection for each user
    collection.update_one(
        {'original': data['original']},
        {'$set': word_data},
        upsert=True
    )
    
    return jsonify({'message': 'User vocabulary data added/updated successfully'}), 201








# API endpoint to receive POST calls with the payload
# curl -X POST \
#   http://localhost:5400/enhance-vocabulary \
#   -H 'Content-Type: application/json' \
#   -d '{
#         "username": "example_user",
#         "data": [
#             [
#                 {"original":"彼女","dictionary":"彼女","furigana":"かのじょ"},
#                 {"original":"は","dictionary":"は","furigana":""},
#                 {"original":"まったく","dictionary":"まったく","furigana":""},
#                 {"original":"遅れて","dictionary":"遅れる","furigana":"おくれて"},
#                 {"original":"い","dictionary":"いる","furigana":""},
#                 {"original":"ない","dictionary":"ない","furigana":""},
#                 {"original":"。","dictionary":"。","furigana":""}
#             ],
#             [
#                 {"original":"今日","dictionary":"今日","furigana":"きょう"},
#                 {"original":"は","dictionary":"は","furigana":""},
#                 {"original":"学校","dictionary":"学校","furigana":"がっこう"},
#                 {"original":"に","dictionary":"に","furigana":""},
#                 {"original":"行き","dictionary":"行く","furigana":"いき"},
#                 {"original":"ます","dictionary":"ます","furigana":""},
#                 {"original":"。","dictionary":"。","furigana":""}
#             ]
#         ]
#     }'
# @app.route('/enhance-vocabulary', methods=['POST'])
# def enhance_vocabulary():
#     data = request.json
#     username = data.get('username')
#     if not username:
#         return jsonify({'error': 'Username is missing in the payload'}), 400
    
#     enhanced_data = []
    
#     # Iterate through the input data
#     for sentence in data['data']:
#         enhanced_sentence = []
#         for word in sentence:
#             # Lookup word in the database
#             db_word = db[username].find_one({'original': word['original']})
#             if db_word:
#                 word['status'] = db_word['status']
#             else:
#                 word['status'] = 'unknown'
#             enhanced_sentence.append(word)
#         enhanced_data.append(enhanced_sentence)
    
#     return jsonify(enhanced_data)

@app.route('/enhance-vocabulary', methods=['POST'])
def enhance_vocabulary():
    data = request.json
    app.logger.info(f'Incoming payload: {data}') 

    username = data.get('username')
    if not username:
        return jsonify({'error': 'Username is missing in the payload'}), 400
    
    enhanced_data = []
    
    # Iterate through the input data
    for sentence in data['data']:
        enhanced_sentence = []
        for word in sentence:
            # Lookup word in the user's collection in the database
            db_word = db[username].find_one({'original': word['original']})
            if db_word:
                word['status'] = db_word['status']
            else:
                word['status'] = 'unknown'
            enhanced_sentence.append(word)
        enhanced_data.append(enhanced_sentence)
    
    return jsonify(enhanced_data)


# ----------------- sentence mining -------------------------- #

@app.route('/store-vocabulary-data', methods=['POST'])
def store_vocabulary_data():
    data = request.json
    app.logger.info(f'Incoming vocabulary data: {data}')
    
    if 'userId' not in data:
        app.logger.error('userId is missing in the payload')
        return jsonify({'error': 'userId is missing'}), 400
    
    userId = data['userId']
    vocabulary_collection = language_db['vocabulary']

    # Create a document for the vocabulary data, modified to fit new structure
    vocabulary_document = {
        "difficulty": data['difficulty'],
        "p_tag": data['p_tag'],
        "s_tag": data['s_tag'],
        "sentences": data['sentences'],
        "userId": userId,
        "vocabulary_audio": data['vocabulary_audio'],
        "vocabulary_english": data['vocabulary_english'],
        "vocabulary_original": data['vocabulary_original'],
        "vocabulary_simplified": data['vocabulary_simplified'],
        "word_type": data['word_type']
    }

    # Insert the document into the database
    insert_result = vocabulary_collection.update_one(
        {'userId': userId, 'vocabulary_original': data['vocabulary_original']},
        {'$set': vocabulary_document},
        upsert=True
    )
    
    if insert_result.upserted_id or insert_result.matched_count:
        return jsonify({'message': 'Vocabulary data stored successfully'}), 201 if insert_result.upserted_id else 200
    else:
        app.logger.error('Failed to store vocabulary data')
        return jsonify({'error': 'Failed to store data'}), 500



# ------------------- serving custom vocab cards ------------------------ #








# ------------------------------------ #
if __name__ == '__main__':
    app.run(debug=True, port=PORT)