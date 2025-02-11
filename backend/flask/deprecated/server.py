import random

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo, ObjectId
from pymongo.collection import ReturnDocument

# from bson import ObjectId
import requests

from pymongo import MongoClient
import json

import logging

from datetime import datetime, timedelta
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s",
)
# filename='app.log',  # Log to a file. Omit this to log to stderr.
# filemode='a')  # Append mode


app = Flask(__name__)
CORS(app)

# Database configuration
app.config["MONGO_URI_FLASKFLASHCARDDATABASE"] = (
    "mongodb://localhost:27017/flaskFlashcardDB"
)

# Initialize PyMongo
mongo_flaskFlashcardDB = PyMongo(app, uri="mongodb://localhost:27017/flaskFlashcardDB")

# ---------------------------------- Global vars ----------------------------------------------

flask_port = 5100

# Determine the environment (dev or prod) to use the correct port
# Reading environment variable with a default value of "dev"
# env var is baked into Dockerfile
env = os.getenv("APP_ENV", "dev")    # prod/dev
port = "8000"  # port of static DB container
host = "host.docker.internal" if env == "prod" else "localhost"


# ------------------------------------ Function definitions ----------------------------------------------


# def f_adjust_frequency_and_shuffle(combined_data):
#     # Categorize data based on difficulty
#     categorized_data = {"easy": [], "medium": [], "hard": [], "unknown": []}
#
#     for item in combined_data:
#         difficulty = item.get(
#             "difficulty", "unknown"
#         )  # Default to 'unknown' if not specified
#         categorized_data[difficulty].append(item)
#
#     # Determine frequency for each category (example frequencies)
#     frequencies = {
#         "easy": 1,  # Least frequent
#         "medium": 2,
#         "hard": 3,
#         "unknown": 4,  # Most frequent
#     }
#
#     # Duplicate data based on determined frequency
#     new_combined_data = []
#     for difficulty, items in categorized_data.items():
#         frequency = frequencies[difficulty]
#         for item in items:
#             new_combined_data.extend([item] * frequency)  # Duplicate item
#
#     # Shuffle the new combined data
#     random.shuffle(new_combined_data)
#
#     return new_combined_data





def f_adjust_frequency_and_shuffle(combined_data):
    # Categorize data based on difficulty
    categorized_data = {"easy": [], "medium": [], "hard": [], "unknown": []}

    for item in combined_data:
        difficulty = item.get("difficulty", "unknown")  # Default to 'unknown' if not specified
        categorized_data[difficulty].append(item)

    # Determine frequency for each category (example frequencies)
    frequencies = {
        "easy": 0.2,  # Least frequent
        "medium": 0.4,
        "hard": 0.6,
        "unknown": 0.8,  # Most frequent
    }

    # Calculate the number of items to pick from each category
    total_items = len(combined_data)
    new_combined_data = []

    for difficulty, items in categorized_data.items():
        if items:
            frequency = frequencies[difficulty]
            num_items_to_pick = int(total_items * frequency)
            # Add the items to the new_combined_data list, limited by the number of items available
            new_combined_data.extend(items * (num_items_to_pick // len(items)) + items[:num_items_to_pick % len(items)])

    # Shuffle the new combined data
    random.shuffle(new_combined_data)

    return new_combined_data











# looks like we do not need this anymore
def f_object_id_converter(obj):
    """Convert ObjectId to str for JSON serialization."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError("Could not convert object to JSON")


# Example usage
# combined_data = [
#    {'_id': '65c8fb31ffc3809088a77d16', 'kanji': '準', 'reading': 'ジュン', 'k_audio': '/audio/japanese/kanji/k_準.mp3', 'exampleWord': '準備', 'exampleReading': 'じゅんび', 'translation': 'preparation', 'audio': '/audio/japanese/kanji/v_準備.mp3', 'p_tag': 'JLPT_N3', 's_tag': 'part_2', '__v': 0, 'userId': 'testUser', 'userEmail': 'user@example.com', 'difficulty': None},
#    # Add more items...
# ]

# new_combined_data = f_adjust_frequency_and_shuffle(combined_data)
# print(new_combined_data)


# -------------------------------------------------------------------------------
# curl -X GET http://localhost:5100/health
@app.route("/health", methods=["GET"])
def health_check():
    # Responds with a simple JSON message and a 200 OK status
    return jsonify({"message": "OK"}), 200


# -----------------------------------------------------

# no point cloning the whole collection just initialize it
# with these fields and with userid and email
# // Create a schema for flashcard state in flashcardDB
# const flashcardStateSchema = new mongoose.Schema({
#   userId: String,
#   difficulty: String, // easy, medium, hard, unknown
#   kanji: String,
#   p_tag: String,
#   s_tag: String,
# });
# the email is security risk, do not contain email in flashcard state
# ideally we should have translation table userid <-> email

# ---

# --------------------------- LOGIN STREAK FUNCTIONS ---------------------------------------


@app.route('/f-api/v1/notify-login', methods=['POST'])
def notify_login():
    data = request.json
    username = data.get('username')
    if username:
        login_date = datetime.now().strftime('%Y-%m-%d')
        # Properly structured update with query and update operations
        result = mongo_flaskFlashcardDB.db.logins.find_one_and_update(
            {'username': username, 'date': login_date},  # Query both by username and date
            {'$inc': {'count': 1}},  # Increment count
            upsert=True,  # Create a new document if one doesn't exist
            return_document=True  # Return the updated document
        )
        # Log the successful login attempt
        logging.info(f"Login recorded for username: {username} on date: {login_date}. Count updated successfully.")
        
        # Feedback message
        return jsonify({'message': f'Login for {username} on {login_date} recorded successfully.', 'newCount': result['count'] if result else 1}), 200
    else:
        # Log the failed login attempt due to missing username
        logging.error("Login attempt without a username in the request.")
        return jsonify({'error': 'Username not provided'}), 400



# @app.route('/f-api/v1/get-logins', methods=['GET'])
# def get_logins():
#     # Retrieve all login records, excluding MongoDB '_id' field
#     logins = list(mongo_flaskFlashcardDB.db.logins.find({}, {'_id': 0, 'date': 1, 'count': 1}))
#     return jsonify(logins), 200

@app.route('/f-api/v1/get-logins/<username>', methods=['GET'])
def get_logins(username):
    # Ensure the username is not empty
    if not username:
        return jsonify({'error': 'Username is required'}), 400

    try:
        # Retrieve all login records for the specified username, excluding MongoDB '_id' field
        logins = list(mongo_flaskFlashcardDB.db.logins.find({"username": username}, {'_id': 0, 'date': 1, 'count': 1}).sort('date', 1))
        return jsonify(logins), 200
    except Exception as e:
        logging.error(f"Error fetching login history for {username}: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching login history'}), 500



@app.route('/f-api/v1/streak/<username>', methods=['GET'])
def longest_streak(username):
    logins = mongo_flaskFlashcardDB.db.logins.find({"username": username}).sort("date", 1)
    logins = list(logins)

    if not logins:
        return jsonify({'error': 'No login records found for the specified user'}), 404

    longest_streak = 0
    current_streak = 1
    previous_date = datetime.strptime(logins[0]['date'], '%Y-%m-%d')

    for login in logins[1:]:
        login_date = datetime.strptime(login['date'], '%Y-%m-%d')
        if login_date - timedelta(days=1) == previous_date:
            current_streak += 1
        else:
            longest_streak = max(longest_streak, current_streak)
            current_streak = 1
        previous_date = login_date

    longest_streak = max(longest_streak, current_streak)  # Compare the last streak

    return jsonify({'username': username, 'longest_streak': longest_streak}), 200





# ------------------------------- PROD READY ----------------------------------------------


# curl calls:
# curl -X POST http://localhost:5100/f-api/v1/clone-static-collection -H "Content-Type: application/json" -d '{"userId": "testUser", "collection": "kanji", "p_tag": "JLPT_N3", "s_tag": "part_1"}'  # likely we do not need to clone such small parts
# curl -X POST http://localhost:5100/f-api/v1/clone-static-collection -H "Content-Type: application/json" -d '{"userId": "testUser", "collection": "kanji", "p_tag": "JLPT_N3"}'  # w only p_tag
# POST endpoint to retrieve and clone a collection from sourceDB to flashcardDB
# we clone only given kanji and specific tags, and then we add SRS specific info - difficulty and so on
@app.route("/f-api/v1/clone-static-collection-kanji", methods=["POST"])
def clone_static_collection_kanji():
    """clones static collection from static db calling static api endpoint
    static prod endpoint runs typically on port 8000
    does only JLPT Nx level cloning
    so for JLPT N5-N1 we need to call this endpoint 5 times
    should work for kanji, vocabulary, grammar collections with p_tag and s_tag
    """

    # we get static data from here
    # GET endpoint to retrieve Kanji based on p_tag and optionally s_tag
    # curl "http://localhost:8000/e-api/v1/kanji?p_tag=JLPT_N3&s_tag=part_1"
    # curl "http://localhost:8000/e-api/v1/kanji?p_tag=JLPT_N3" - for only p_tag

    # data structurefrom remote static api:
    # curl "http://localhost:8000/e-api/v1/kanji?p_tag=JLPT_N3"
    # [
    #     {"_id":"65da44a5a033d2048bd1e4ce",
    #      "kanji":"駐",
    #      "reading":"チュウ",
    #      "k_audio":"/audio/japanese/kanji/k_駐.mp3",
    #      "exampleWord":"駐車",
    #      "exampleReading":"ちゅうしゃ",
    #      "translation":"parking",
    #      "audio":"/audio/japanese/kanji/v_駐車.mp3",
    #      "p_tag":"JLPT_N3",
    #      "s_tag":"part_1",
    #      "__v":0},
    #     {"_id":"65da44a5a033d2048bd1e4cf",
    #      "kanji":"満",
    #      "reading":"マン",
    #      "k_audio":"/audio/japanese/kanji/k_満.mp3",
    #      "exampleWord":"満車",
    #      "exampleReading":"まんしゃ",
    #      "translation":"full of cars",
    #      "audio":"/audio/japanese/kanji/v_満車.mp3",
    #      "p_tag":"JLPT_N3",
    #      "s_tag":"part_1",
    #      "__v":0},
    # ]

    logging.info("received POST at /f-api/v1/clone-static-collection-kanji")

    try:
        data = request.json
        user_id = data["userId"]
        collection_name = data[
            "collection"
        ]  # The name of the source collection, e.g., -d '{"collection": "kanji"}'
        p_tag = data.get("p_tag", None)  # Assuming primary tag is part of the request
        s_tag = data.get("s_tag", None)  # Assuming secondary tag is part of the request

        flashcard_collection = mongo_flaskFlashcardDB.db[
            collection_name
        ]  # collections should have the same name for simplicity

        # Construct the URL for the GET request
        url = f"http://{host}:{port}/e-api/v1/kanji?p_tag={p_tag}"

        if s_tag:
            url += f"&s_tag={s_tag}"

        # Make the GET request to the static data source API
        response = requests.get(url)
        if response.status_code == 200:
            documents = response.json()  # This should be a list of dictionaries
        else:
            return (
                jsonify({"error": "Failed to fetch data from static data source"}),
                response.status_code,
            )

        new_documents = []  # To hold documents that need to be cloned
        for doc in documents:

            # Check if the document already exists in the flashcard collection
            exists = (
                flashcard_collection.count_documents(
                    {
                        "userId": user_id,
                        "kanji": doc["kanji"],
                        "p_tag": doc.get("p_tag", ""),
                        "s_tag": doc.get("s_tag", ""),
                    }
                )
                > 0
            )

            if not exists:
                # Prepare the document for insertion with only the specified fields
                new_doc = {
                    "userId": user_id,
                    "difficulty": "unknown",  # Default difficulty
                    "kanji": doc["kanji"],
                    "p_tag": doc.get("p_tag", ""),
                    "s_tag": doc.get("s_tag", ""),
                }
                new_documents.append(new_doc)

        if not new_documents:
            return jsonify({"message": "No new documents to clone"}), 200

        # Insert the new documents into the flashcard collection
        result = flashcard_collection.insert_many(new_documents)

        return (
            jsonify(
                {
                    "message": f"Successfully cloned {len(result.inserted_ids)} new documents."
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# curl calls:
# curl -X POST http://localhost:5100/f-api/v1/clone-static-collection-words -H "Content-Type: application/json" -d '{"userId": "testUser", "collection": "words", "p_tag": "essential_600_verbs", "s_tag": "part_1"}'  # likely we do not need to clone such small parts
# curl -X POST http://localhost:5100/f-api/v1/clone-static-collection-words -H "Content-Type: application/json" -d '{"userId": "testUser", "collection": "words", "p_tag": "suru_essential_600_verbs"}'  # w only p_tag
# curl -X POST http://localhost:5100/f-api/v1/clone-static-collection-words -H "Content-Type: application/json" -d '{"userId": "testUser", "collection": "words", "p_tag": "essential_600_verbs"}'  # w only p_tag
# POST endpoint to retrieve and clone a collection from sourceDB to flashcardDB
# we clone only given kanji and specific tags, and then we add SRS specific info - difficulty and so on
@app.route("/f-api/v1/clone-static-collection-words", methods=["POST"])
def clone_static_collection_words():
    """clones static collection from static db calling static api endpoint
    static prod endpoint runs typically on port 8000
    does only JLPT Nx level cloning
    so for JLPT N5-N1 we need to call this endpoint 5 times
    implemented for vocabulary p_tag and s_tag
    best to call just w p_tag, we get more data this way to clone
    """

    # we get static data from here
    # GET endpoint to retrieve Kanji based on p_tag and optionally s_tag
    # curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=essential_600_verbs'         # w only p_tag
    # curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=suru_essential_600_verbs'    # w only p_tag

    # curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=essential_600_verbs&s_tag=verbs-1'
    # curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=suru_essential_600_verbs&s_tag=verbs-1'

    # data structurefrom remote static api:
    #  curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=essential_600_verbs&s_tag=verbs-1'
    # {"words":
    #  [
    #      {"_id":"65eca95e43a799eec83434e1",
    #       "vocabulary_original":"抑える_",
    #       "vocabulary_simplified":"おさえる",
    #       "vocabulary_english":"to suppress, to control",
    #       "vocabulary_audio":"/audio/vocab/v_抑える.mp3",
    #       "word_type":"Verb",
    #       "p_tag":"essential_600_verbs",
    #       "s_tag":"verbs-1",
    #       "sentences":[
    #           {"_id":"65eca95f43a799eec8343dc8",
    #            "sentence_original":"彼は怒りを抑えることができなかった。",
    #            "sentence_simplified":"",
    #            "sentence_romaji":"Kare wa ikari o osaeru koto ga dekinakatta",
    #            "sentence_english":"He was unable to suppress his anger.",
    #            "sentence_audio":"/audio/sentences/s_抑える_20231231_彼は怒りを抑えることができなかった.mp3",
    #            "sentence_picture":"","key":"抑える_","__v":0},
    #            {"_id":"65eca95f43a799eec8343dc9",
    #             "sentence_original":"ボリュームを抑えて静かに音楽を聞く。",
    #             "sentence_simplified":"",
    #             "sentence_romaji":"Boryuumu o osaete shizuka ni ongaku o kiku",
    #             "sentence_english":"Listen to music quietly with the volume turned down.",
    #             "sentence_audio":"/audio/sentences/s_抑える_20231231_ボリュームを抑えて静かに音楽を聞く.mp3",
    #             "sentence_picture":"",
    #             "key":"抑える_",
    #             "__v":0},
    #       ]
    #      },

    logging.info("received POST at /f-api/v1/clone-static-collection-words")

    try:
        data = request.json
        user_id = data["userId"]
        collection_name = data[
            "collection"
        ]  # The name of the flashcard collection, e.g., -d '{"collection": "words"}'
        p_tag = data.get("p_tag", None)  # Assuming primary tag is part of the request
        s_tag = data.get("s_tag", None)  # Assuming secondary tag is part of the request

        flashcard_collection = mongo_flaskFlashcardDB.db[
            collection_name
        ]  # collections should have the same name for simplicity

        # Construct the URL for the GET request
        url = f"http://{host}:{port}/e-api/v1/words?p_tag={p_tag}"

        if s_tag:
            url += f"&s_tag={s_tag}"

        # Make the GET request to the static data source API
        response = requests.get(url)
        if response.status_code == 200:
            # documents = response.json()  # This should be a list of dictionaries
            # response comes under "words" key
            documents = response.json().get(
                "words", []
            )  # Adjust based on the actual JSON structure
        else:
            return (
                jsonify({"error": "Failed to fetch data from static data source"}),
                response.status_code,
            )

        new_documents = []  # To hold documents that need to be cloned
        for doc in documents:

            # Check if the document already exists in the flashcard collection
            exists = (
                flashcard_collection.count_documents(
                    {
                        "userId": user_id,
                        "vocabulary_original": doc["vocabulary_original"],
                        "p_tag": doc.get("p_tag", ""),
                        "s_tag": doc.get("s_tag", ""),
                    }
                )
                > 0
            )

            if not exists:
                # Prepare the document for insertion with only the specified fields
                new_doc = {
                    "userId": user_id,
                    "difficulty": "unknown",  # Default difficulty
                    "vocabulary_original": doc["vocabulary_original"],
                    "p_tag": doc.get("p_tag", ""),
                    "s_tag": doc.get("s_tag", ""),
                }
                new_documents.append(new_doc)

        if not new_documents:
            return jsonify({"message": "No new documents to clone"}), 200

        # Insert the new documents into the flashcard collection
        result = flashcard_collection.insert_many(new_documents)

        return (
            jsonify(
                {
                    "message": f"Successfully cloned {len(result.inserted_ids)} new documents."
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# curl -X POST http://localhost:5100/f-api/v1/combine-flashcard-data-kanji -H "Content-Type: application/json" -d '{"userId": "testUser", "collectionName": "kanji", "p_tag": "JLPT_N3", "s_tag": "part_1"}'
# to get full card data, we need to combine dynamic and static DB data
# (because we do not want to store full flashcard data separately for each user
# it would take lots of space and would be difficult to fix typos)
# TODO: later, flask will call express api that provides static data
# curl -X POST http://localhost:5100/f-api/v1/combine-flashcard-data -H "Content-Type: application/json" -d '{"userId": "testUser", "collectionName": "kanji", "p_tag": "JLPT_N3", "s_tag": "part_1"}'
# curl -X GET -H "Content-Type: application/json" "http://localhost:5100/f-api/v1/combine-flashcard-data?userId=testUser&collectionName=kanji&p_tag=JLPT_N3&s_tag=part_1"
@app.route("/f-api/v1/combine-flashcard-data-kanji", methods=["GET", "POST"])
def combine_flashcard_data_kanji():
    try:
        # Determine the request method and extract parameters accordingly
        if request.method == "POST":
            # Extract data from the request body for POST requests
            data = request.json
        elif request.method == "GET":
            # Extract data from the query string for GET requests
            data = request.args.to_dict()  # Convert ImmutableMultiDict to dict

        # Validate required parameters
        user_id = data.get("userId")
        collection_name = data.get("collectionName")
        p_tag = data.get("p_tag")
        s_tag = data.get("s_tag")

        if not all([user_id, collection_name, p_tag, s_tag]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Fetch user-specific flashcard data
        flashcard_collection = mongo_flaskFlashcardDB.db[collection_name]
        user_flashcards = list(
            flashcard_collection.find(
                {"userId": user_id, "p_tag": p_tag, "s_tag": s_tag}
            )
        )

        # Construct the URL for the GET request
        # curl "http://localhost:8000/e-api/v1/kanji?p_tag=JLPT_N3&s_tag=part_1"
        url = f"http://{host}:{port}/e-api/v1/kanji?p_tag={p_tag}"
        if s_tag:
            url += f"&s_tag={s_tag}"

        # Make the GET request to the static data source API
        logging.info(f"calling static api at {url}")
        response = requests.get(url)
        if response.status_code == 200:
            documents = response.json()  # This should be a list of dictionaries
        else:
            return (
                jsonify({"error": "Failed to fetch data from static data source"}),
                response.status_code,
            )

        # Fetch corresponding static source data
        source_data = documents

        combined_data = []
        for flashcard in user_flashcards:
            for source in source_data:
                if (
                    flashcard["kanji"] == source["kanji"]
                    and flashcard["p_tag"] == source["p_tag"]
                    and flashcard["s_tag"] == source["s_tag"]
                ):
                    # Ensure _id is converted to string
                    source["_id"] = str(source["_id"])
                    if "_id" in flashcard:
                        flashcard["_id"] = str(flashcard["_id"])
                    combined = {**source, **flashcard}  # Merge dictionaries
                    combined_data.append(combined)

        logging.info(combined_data)
        # print(combined_data)

        new_combined_data = f_adjust_frequency_and_shuffle(combined_data)

        # return jsonify(combined_data), 200
        return jsonify(new_combined_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# curl -X POST http://localhost:5100/f-api/v1/combine-flashcard-data-words -H "Content-Type: application/json" -d '{"userId": "testUser", "collectionName": "words", "p_tag": "essential_600_verbs", "s_tag": "verbs-1"}'
# to get full card data, we need to combine dynamic and static DB data
# (because we do not want to store full flashcard data separately for each user
# it would take lots of space and would be difficult to fix typos)
# TODO: later, flask will call express api that provides static data
# curl -X POST http://localhost:5100/f-api/v1/combine-flashcard-data-words -H "Content-Type: application/json" -d '{"userId": "testUser", "collectionName": "words", "p_tag": "essential_600_verbs", "s_tag": "verbs-1"}'
# curl -X GET -H "Content-Type: application/json" "http://localhost:5100/f-api/v1/combine-flashcard-data-words?userId=testUser&collectionName=words&p_tag=essential_600_verbs&s_tag=verbs-1"
@app.route("/f-api/v1/combine-flashcard-data-words", methods=["GET", "POST"])
def combine_flashcard_data_words():
    try:
        # Determine the request method and extract parameters accordingly
        if request.method == "POST":
            # Extract data from the request body for POST requests
            data = request.json
        elif request.method == "GET":
            # Extract data from the query string for GET requests
            data = request.args.to_dict()  # Convert ImmutableMultiDict to dict

        # Validate required parameters
        user_id = data.get("userId")
        collection_name = data.get("collectionName")
        p_tag = data.get("p_tag")
        s_tag = data.get("s_tag")

        if not all([user_id, collection_name, p_tag, s_tag]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Fetch user-specific flashcard data
        flashcard_collection = mongo_flaskFlashcardDB.db[collection_name]
        user_flashcards = list(
            flashcard_collection.find(
                {"userId": user_id, "p_tag": p_tag, "s_tag": s_tag}
            )
        )

        # Construct the URL for the GET request
        # curl "http://localhost:8000/e-api/v1/words?p_tag=essential_600_verbs&s_tag=verbs-1"
        url = f"http://{host}:{port}/e-api/v1/words?p_tag={p_tag}"
        if s_tag:
            url += f"&s_tag={s_tag}"

        # Make the GET request to the static data source API
        logging.info(f"calling static api at {url}")
        response = requests.get(url)
        if response.status_code == 200:
            # documents = response.json()  # This should be a list of dictionaries
            # we have it under "words" key
            documents = response.json().get(
                "words", []
            )  # Adjust based on the actual JSON structure

        else:
            return (
                jsonify({"error": "Failed to fetch data from static data source"}),
                response.status_code,
            )

        # Fetch corresponding static source data
        source_data = documents

        combined_data = []
        for flashcard in user_flashcards:
            for source in source_data:
                if (
                    flashcard["vocabulary_original"] == source["vocabulary_original"]
                    and flashcard["p_tag"] == source["p_tag"]
                    and flashcard["s_tag"] == source["s_tag"]
                ):
                    # Ensure _id is converted to string
                    source["_id"] = str(source["_id"])
                    if "_id" in flashcard:
                        flashcard["_id"] = str(flashcard["_id"])
                    combined = {**source, **flashcard}  # Merge dictionaries
                    combined_data.append(combined)

        logging.info(combined_data)
        # print(combined_data)

        new_combined_data = f_adjust_frequency_and_shuffle(combined_data)

        # return jsonify(combined_data), 200
        # return jsonify(new_combined_data), 200

        # we need to nest response under "words" key
        # the key complicates lots of things, it will be difficult to unify API logic
        # streamline in future sprnts
        return jsonify({"words": new_combined_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------- JUST FOR DEV TESTING ----------------------------------------------



# -------------------------------------------------------------------------------
# flashcard progress analysis for given user


# GET endpoint to retrieve flashcard states for a specific user
# for given collection and tags
@app.route("/f-api/v1/flashcard/<userId>", methods=["GET"])
def get_flashcard_states(userId):
    try:

        data = request.args.to_dict()  # Convert ImmutableMultiDict to dict

        # Validate required parameters
        # user_id = data.get("userId")
        collection_name = data.get("collectionName")
        p_tag = data.get("p_tag")
        s_tag = data.get("s_tag")

        flashcard_states = mongo_flaskFlashcardDB.db[collection_name].find(
            {"userId": userId, "p_tag": p_tag, "s_tag": s_tag}
        )

        # Convert cursor to list
        flashcard_states_list = list(flashcard_states)

        if len(flashcard_states_list) == 0:
            return jsonify({"error": "Flashcard states not found"}), 404

        # Convert the list of BSON objects to JSON
        flashcard_states_json = []
        for state in flashcard_states_list:
            state["_id"] = str(state["_id"])  # Convert ObjectId to string
            flashcard_states_json.append(state)

        return jsonify(flashcard_states_json), 200
    except Exception as e:
        return (
            jsonify(
                {"error": "Failed to retrieve flashcard states", "details": str(e)}
            ),
            500,
        )


# --------------------------------------------------------------------------------------------------


# posts flashcard state to user dynamic database
# for given collection and given element
# (kanji collection and specific kanji, kanji can be duplicate,
# hence we need tags and of course user to localise specific kanji to update)
@app.route("/f-api/v1/flashcard", methods=["POST"])
def store_flashcard_state():
    data = request.json
    print("received flashcard update POST payload:")
    print(data)

    user_id = data.get("userId")
    collection_name = data.get("collectionName")

    p_tag = data.get("p_tag")
    s_tag = data.get("s_tag")

    try:
        if collection_name == "kanji":

            kanji = data.get("kanji")

            # Attempt to find an existing flashcard state
            flashcard_state = mongo_flaskFlashcardDB.db[collection_name].find_one(
                {"userId": user_id, "kanji": kanji, "p_tag": p_tag, "s_tag": s_tag}
            )

            if not flashcard_state:
                # Create a new document if it doesn't exist
                result = mongo_flaskFlashcardDB.db[collection_name].insert_one(data)
                inserted_id = result.inserted_id
                return (
                    jsonify(
                        {
                            "message": "Flashcard state stored successfully",
                            "id": str(inserted_id),
                        }
                    ),
                    201,
                )
            else:
                # Update the existing document
                updated_data = {
                    "$set": {
                        "difficulty": data.get("difficulty"),
                    }
                }
                mongo_flaskFlashcardDB.db[collection_name].update_one(
                    {"_id": flashcard_state["_id"]}, updated_data
                )
                return jsonify({"message": "Flashcard state updated successfully"}), 200

        elif collection_name == "words":

            vocabulary_original = data.get("vocabulary_original")

            # Attempt to find an existing flashcard state
            flashcard_state = mongo_flaskFlashcardDB.db[collection_name].find_one(
                {
                    "userId": user_id,
                    "vocabulary_original": vocabulary_original,
                    "p_tag": p_tag,
                    "s_tag": s_tag,
                }
            )

            if not flashcard_state:
                # Create a new document if it doesn't exist
                result = mongo_flaskFlashcardDB.db[collection_name].insert_one(data)
                inserted_id = result.inserted_id
                return (
                    jsonify(
                        {
                            "message": "Flashcard state stored successfully",
                            "id": str(inserted_id),
                        }
                    ),
                    201,
                )
            else:
                # Update the existing document
                updated_data = {
                    "$set": {
                        "difficulty": data.get("difficulty"),
                    }
                }
                mongo_flaskFlashcardDB.db[collection_name].update_one(
                    {"_id": flashcard_state["_id"]}, updated_data
                )
                return jsonify({"message": "Flashcard state updated successfully"}), 200

        else:
            return jsonify({"error": "collection not found in DB"}), 404

    except Exception as e:
        return (
            jsonify({"error": "Failed to store flashcard state", "details": str(e)}),
            500,
        )


# -------------------------------------------------------------------------------------------- #
# ------------------------------- TEXT PARSER / YOUTUBE / MECAB ------------------------------ #
# -------------------------------------------------------------------------------------------- #


# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['mecabWords']  # Replace 'yourDatabaseName' with your actual database name



# Setup for the new database
def configure_language_db():
    return client['sentenceMining']     # this one is for sentence mining 

language_db = configure_language_db()

logging.basicConfig(level=logging.INFO)  # Set logging level to INFO



# -----


# API endpoint to receive POST calls w vocab knowledge status
# curl -X POST \
#   /f-api/v1/user-vocabulary \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "username": "example_user",
#     "original": "行き",
#     "dictionary": "行く",
#     "furigana": "いき",
#     "status": "seen"
# }'
@app.route('/f-api/v1/user-vocabulary', methods=['POST'])
def add_user_vocabulary():
    data = request.json
    app.logger.info(f'Incoming payload: {data}') 

    if 'userId' not in data:
        app.logger.error('userId is missing in the payload')  # Example error logging
        return jsonify({'error': 'Username is missing'}), 400
    
    username = data['userId']
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
#   /f-api/v1/enhance-vocabulary \
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
@app.route('/f-api/v1/enhance-vocabulary', methods=['POST'])
def enhance_vocabulary():
    data = request.json
    app.logger.info(f'Incoming payload: {data}') 

    username = data.get('userId')
    if not username:
        return jsonify({'error': 'userId is missing in the payload'}), 400
    
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

@app.route('/f-api/v1/store-vocabulary-data', methods=['POST'])
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
        "word_type": data['word_type'],
        "notes": data['notes']
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



# ------------------------------------- serving custom vocab cards -------------------------------------- #



# here we are getting sentence mined words from user dynamic DB, I think we have separate db just for that 
# so best to have also separate API endpoint, the difficulty frequency function is common for various endpoints though
# curl -X GET -H "Content-Type: application/json" "http://localhost:5100/f-api/v1/text-parser-words?userId=testUser&collectionName=vocabulary&p_tag=sentence_mining&s_tag=verbs-1"
# curl -X POST -H "Content-Type: application/json" -d '{
#   "userId": "testUser",
#   "difficulty": "easy",
#   "collectionName": "vocabulary",
#   "vocabulary_original": "紹介",
#   "p_tag": "sentence_mining",
#   "s_tag": "verbs-1"
# }' "http://localhost:5100/f-api/v1/text-parser-words"

# MongoDB client setup
#client = MongoClient('mongodb://localhost:27017/')  # Adjust connection string as needed
sentence_mining_db = client['sentenceMining']
vocabulary_collection = sentence_mining_db['vocabulary']


# Endpoint to get, update, and delete vocabulary data
@app.route("/f-api/v1/text-parser-words", methods=["GET", "POST", "DELETE"])
def text_parser_words():
    logging.info("Received request to /f-api/v1/text-parser-words")
    try:
        if request.method == "POST":
            logging.info("Processing POST request")
            data = request.json
            logging.info(f"Request data: {data}")

            user_id = data.get("userId")
            difficulty = data.get("difficulty")
            collection_name = data.get("collectionName")
            vocabulary_original = data.get("vocabulary_original")
            p_tag = data.get("p_tag")
            s_tag = data.get("s_tag")

            if not all([user_id, collection_name, p_tag, s_tag, vocabulary_original, difficulty]):
                logging.error("Missing required parameters in POST request")
                return jsonify({"error": "Missing required parameters"}), 400

            logging.info("Updating difficulty in the vocabulary collection")
            result = vocabulary_collection.update_one(
                {
                    "userId": user_id,
                    "vocabulary_original": vocabulary_original,
                    "p_tag": p_tag,
                    "s_tag": s_tag
                },
                {
                    "$set": {"difficulty": difficulty}
                }
            )

            if result.matched_count == 0:
                logging.error("No matching document found for update")
                return jsonify({"error": "No matching document found"}), 404

            logging.info("Difficulty updated successfully")
            return jsonify({"message": "Difficulty updated successfully"}), 200

        elif request.method == "GET":
            logging.info("Processing GET request")
            data = request.args.to_dict()  # Convert ImmutableMultiDict to dict
            logging.info(f"Query string data: {data}")

            user_id = data.get("userId")
            collection_name = data.get("collectionName")
            p_tag = data.get("p_tag")
            s_tag = data.get("s_tag")

            if not all([user_id, collection_name, p_tag, s_tag]):
                logging.error("Missing required parameters in GET request")
                return jsonify({"error": "Missing required parameters"}), 400

            logging.info("Fetching user-specific vocabulary data")
            user_vocabulary = list(
                vocabulary_collection.find(
                    {"userId": user_id, "p_tag": p_tag, "s_tag": s_tag}
                )
            )

            logging.info("Transforming data into the expected format")
            data = []
            for vocab in user_vocabulary:
                question = {
                    "vocabulary_original": vocab.get("vocabulary_original", ""),
                    "vocabulary_simplified": vocab.get("vocabulary_simplified", ""),
                    "vocabulary_english": vocab.get("vocabulary_english", ""),
                    "vocabulary_audio": vocab.get("vocabulary_audio", ""),
                    "word_type": vocab.get("word_type", ""),
                    "notes": vocab.get("notes", ""),
                    "sentences": [
                        {
                            "sentence_original": sentence.get("sentence_original", ""),
                            "sentence_simplified": sentence.get("sentence_simplified", ""),
                            "sentence_romaji": sentence.get("sentence_romaji", ""),
                            "sentence_english": sentence.get("sentence_english", ""),
                            "sentence_audio": sentence.get("sentence_audio", ""),
                            "sentence_picture": sentence.get("sentence_picture", "")
                        }
                        for sentence in vocab.get("sentences", [])
                    ]
                }
                data.append(question)

            # for cards, limited data
            #new_combined_data = f_adjust_frequency_and_shuffle(data)
            
            # for my_words page, all data without restrictions
            new_combined_data = data

            logging.info("Returning transformed data")
            return jsonify({"words": new_combined_data}), 200

        elif request.method == "DELETE":
            logging.info("Processing DELETE request")
            data = request.json
            logging.info(f"Request data: {data}")

            user_id = data.get("userId")
            collection_name = data.get("collectionName")
            p_tag = data.get("p_tag")
            s_tag = data.get("s_tag")
            vocabulary_original = data.get("vocabulary_original")

            if not all([user_id, collection_name, p_tag, s_tag, vocabulary_original]):
                logging.error("Missing required parameters in DELETE request")
                return jsonify({"error": "Missing required parameters"}), 400

            logging.info("Deleting vocabulary from the collection")
            result = vocabulary_collection.delete_one(
                {
                    "userId": user_id,
                    "vocabulary_original": vocabulary_original,
                    "p_tag": p_tag,
                    "s_tag": s_tag
                }
            )

            if result.deleted_count == 0:
                logging.error("No matching document found for deletion")
                return jsonify({"error": "No matching document found"}), 404

            logging.info("Vocabulary deleted successfully")
            return jsonify({"message": "Vocabulary deleted successfully"}), 200

    except Exception as e:
        logging.exception("An error occurred while processing the request")
        return jsonify({"error": str(e)}), 500





# --------------------------- end of custom sentence mining ----------------------------- #


# ------------------------------------- email waitlist from hero section -------------------------------------- #

#from flask import Flask, request, jsonify
#from pymongo import MongoClient
from bson.objectid import ObjectId

#app = Flask(__name__)



client_e = MongoClient('mongodb://localhost:27017/')
db_e = client_e['email_db']
emails_collection = db_e['emails']

@app.route('/f-api/v1/submit_email', methods=['POST'])
def submit_email():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    # Save the email to MongoDB
    email_data = {
        'email': email
    }
    result = emails_collection.insert_one(email_data)
    
    return jsonify({'message': 'Email submitted successfully', 'id': str(result.inserted_id)}), 200







# --- #

if __name__ == "__main__":
    # has to listen everywhere 0.0.0.0, otherwise it will not work in docker
    app.run(debug=True, host="0.0.0.0", port=flask_port)
