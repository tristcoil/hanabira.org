from flask import request, jsonify
from pymongo import MongoClient
import logging
from datetime import datetime


class MecabUserVocabulary:
    def __init__(self):
        # Initialize MongoDB connection
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["mecabWords"]
        self.collection = self.db["mecab_words"]  # Make sure this line exists


    def register_routes(self, app):

        # --- #

        # API endpoint to receive POST calls w vocab knowledge status
        # curl -X POST \
        #   http://localhost:5100/f-api/v1/user-vocabulary \
        #   -H 'Content-Type: application/json' \
        #   -d '{
        #     "userId": "example_user",
        #     "original": "行き",
        #     "dictionary": "行く",
        #     "furigana": "いき",
        #     "status": "seen"
        # }'
        @app.route("/f-api/v1/user-vocabulary", methods=["POST"])
        def add_user_vocabulary():
            data = request.json
            logging.info(f"Incoming payload: {data}")

            if "userId" not in data:
                logging.error("userId is missing in the payload")
                return jsonify({"error": "userId is missing"}), 400

            userId = data["userId"]
            # Prepare word data
            word_data = {
                "userId": userId,
                "original": data.get("original"),
                "dictionary": data.get("dictionary"),
                "furigana": data.get("furigana"),
                "status": data.get("status", "unknown"),
            }

            # Update or insert data into the single "mecab_words" collection
            self.collection.update_one(
                {"userId": userId, "original": word_data["original"]},
                {"$set": word_data},
                upsert=True,
            )

            return (
                jsonify({"message": "User vocabulary data added/updated successfully"}),
                201,
            )

        # API endpoint to receive POST calls with the payload
        # curl -X POST \
        #   /f-api/v1/enhance-vocabulary \
        #   -H 'Content-Type: application/json' \
        #   -d '{
        #         "userId": "example_user",
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
        @app.route("/f-api/v1/enhance-vocabulary", methods=["POST"])
        def enhance_vocabulary():
            data = request.json
            logging.info(f"Incoming payload: {data}")

            userId = data.get("userId")
            if not userId:
                return jsonify({"error": "userId is missing in the payload"}), 400

            enhanced_data = []

            # Iterate through the input data
            for sentence in data.get("data", []):
                enhanced_sentence = []
                for word in sentence:
                    # Lookup word in the "mecab_words" collection for this specific user
                    db_word = self.collection.find_one(
                        {"userId": userId, "original": word.get("original")}
                    )
                    if db_word:
                        word["status"] = db_word.get("status", "unknown")
                    else:
                        word["status"] = "unknown"
                    enhanced_sentence.append(word)
                enhanced_data.append(enhanced_sentence)

            return jsonify(enhanced_data), 200


# --- #

# # API endpoint to receive POST calls w vocab knowledge status
# # curl -X POST \
# #   /f-api/v1/user-vocabulary \
# #   -H 'Content-Type: application/json' \
# #   -d '{
# #     "userId": "example_user",
# #     "original": "行き",
# #     "dictionary": "行く",
# #     "furigana": "いき",
# #     "status": "seen"
# # }'
# @app.route("/f-api/v1/user-vocabulary", methods=["POST"])
# def add_user_vocabulary():
#     data = request.json
#     logging.info(f"Incoming payload: {data}")

#     if "userId" not in data:
#         logging.error("userId is missing in the payload")
#         return jsonify({"error": "userId is missing"}), 400

#     userId = data["userId"]
#     # Prepare word data
#     word_data = {
#         "original": data.get("original"),
#         "dictionary": data.get("dictionary"),
#         "furigana": data.get("furigana"),
#         "status": data.get("status", "unknown"),
#     }

#     # Update or insert data into MongoDB for the specific user
#     collection = self.db[userId]
#     collection.update_one(
#         {"original": word_data["original"]}, {"$set": word_data}, upsert=True
#     )

#     return (
#         jsonify({"message": "User vocabulary data added/updated successfully"}),
#         201,
#     )

# # API endpoint to receive POST calls with the payload
# # curl -X POST \
# #   /f-api/v1/enhance-vocabulary \
# #   -H 'Content-Type: application/json' \
# #   -d '{
# #         "userId": "example_user",
# #         "data": [
# #             [
# #                 {"original":"彼女","dictionary":"彼女","furigana":"かのじょ"},
# #                 {"original":"は","dictionary":"は","furigana":""},
# #                 {"original":"まったく","dictionary":"まったく","furigana":""},
# #                 {"original":"遅れて","dictionary":"遅れる","furigana":"おくれて"},
# #                 {"original":"い","dictionary":"いる","furigana":""},
# #                 {"original":"ない","dictionary":"ない","furigana":""},
# #                 {"original":"。","dictionary":"。","furigana":""}
# #             ],
# #             [
# #                 {"original":"今日","dictionary":"今日","furigana":"きょう"},
# #                 {"original":"は","dictionary":"は","furigana":""},
# #                 {"original":"学校","dictionary":"学校","furigana":"がっこう"},
# #                 {"original":"に","dictionary":"に","furigana":""},
# #                 {"original":"行き","dictionary":"行く","furigana":"いき"},
# #                 {"original":"ます","dictionary":"ます","furigana":""},
# #                 {"original":"。","dictionary":"。","furigana":""}
# #             ]
# #         ]
# #     }'
# @app.route("/f-api/v1/enhance-vocabulary", methods=["POST"])
# def enhance_vocabulary():
#     data = request.json
#     logging.info(f"Incoming payload: {data}")

#     userId = data.get("userId")
#     if not userId:
#         return jsonify({"error": "userId is missing in the payload"}), 400

#     enhanced_data = []

#     # Iterate through the input data
#     for sentence in data.get("data", []):
#         enhanced_sentence = []
#         for word in sentence:
#             # Lookup word in the user's collection
#             db_word = self.db[userId].find_one(
#                 {"original": word.get("original")}
#             )
#             if db_word:
#                 word["status"] = db_word.get("status", "unknown")
#             else:
#                 word["status"] = "unknown"
#             enhanced_sentence.append(word)
#         enhanced_data.append(enhanced_sentence)

#     return jsonify(enhanced_data), 200
