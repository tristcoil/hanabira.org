import logging
from datetime import datetime
from flask import request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId  # Add this line


class SentenceMiningModule:
    def __init__(self):
        # Setup MongoDB connection for sentence mining
        self.client = MongoClient("mongodb://localhost:27017/")
        self.sentence_mining_db = self.client["sentenceMining"]
        self.vocabulary_collection = self.sentence_mining_db["vocabulary"]

        # Initialize logging if needed
        logging.basicConfig(level=logging.DEBUG)  # Set logging level to DEBUG

    def register_routes(self, app):



        #TODO: VOCAB CARD DIFFICULTY UPDTATE CAUSES CREATION OF NEW DB ENTRY, WE SHOULD USE PATCH OR SOMETHING IN THE LOGIC
        @app.route("/f-api/v1/store-vocabulary-data", methods=["POST"])
        def store_vocabulary_data():
            data = request.json
            logging.info(f"Incoming vocabulary data: {data}")

            if "userId" not in data:
                logging.error("userId is missing in the payload")
                return jsonify({"error": "userId is missing"}), 400

            user_id = data["userId"]

            # Create a document for the vocabulary data
            vocabulary_document = {
                "difficulty": data.get("difficulty"),
                "p_tag": data.get("p_tag"),
                "s_tag": data.get("s_tag"),
                "sentences": data.get("sentences", []),
                "userId": user_id,
                "vocabulary_audio": data.get("vocabulary_audio"),
                "vocabulary_english": data.get("vocabulary_english"),
                "vocabulary_japanese": data.get("vocabulary_japanese"),
                "vocabulary_simplified": data.get("vocabulary_simplified"),
                "word_type": data.get("word_type"),
                "notes": data.get("notes", ""),
            }

            try:
                # Simply insert a new document each time
                insert_result = self.vocabulary_collection.insert_one(vocabulary_document)
                if insert_result.inserted_id:
                    logging.info("Vocabulary data stored successfully")
                    return jsonify({"message": "Vocabulary data stored successfully"}), 201
                else:
                    logging.error("Failed to store vocabulary data")
                    return jsonify({"error": "Failed to store data"}), 500
            except Exception as e:
                logging.exception("Error while inserting vocabulary data")
                return jsonify({"error": str(e)}), 500


        # OVERWRITES GIVEN ENTRY, WORD CAN BE ONLY ONCE IN DB
        # @app.route("/f-api/v1/store-vocabulary-data", methods=["POST"])
        # def store_vocabulary_data():
        #     data = request.json
        #     logging.info(f"Incoming vocabulary data: {data}")

        #     if "userId" not in data:
        #         logging.error("userId is missing in the payload")
        #         return jsonify({"error": "userId is missing"}), 400

        #     user_id = data["userId"]

        #     # Create a document for the vocabulary data
        #     vocabulary_document = {
        #         "difficulty": data.get("difficulty"),
        #         "p_tag": data.get("p_tag"),
        #         "s_tag": data.get("s_tag"),
        #         "sentences": data.get("sentences", []),
        #         "userId": user_id,
        #         "vocabulary_audio": data.get("vocabulary_audio"),
        #         "vocabulary_english": data.get("vocabulary_english"),
        #         "vocabulary_japanese": data.get("vocabulary_japanese"),
        #         "vocabulary_simplified": data.get("vocabulary_simplified"),
        #         "word_type": data.get("word_type"),
        #         "notes": data.get("notes", ""),
        #     }

        #     # Insert or update the document in the database
        #     insert_result = self.vocabulary_collection.update_one(
        #         {
        #             "userId": user_id,
        #             "vocabulary_japanese": data.get("vocabulary_japanese"),
        #         },
        #         {"$set": vocabulary_document},
        #         upsert=True,
        #     )

        #     if insert_result.upserted_id or insert_result.matched_count:
        #         return jsonify({"message": "Vocabulary data stored successfully"}), (
        #             201 if insert_result.upserted_id else 200
        #         )
        #     else:
        #         logging.error("Failed to store vocabulary data")
        #         return jsonify({"error": "Failed to store data"}), 500




        # ------------------------Custom mined vocabulary (+ sentences) ---------------------------------------- #
        # is used also for vocab cards

        # -------------------------------------------------------------------------------------
        # GET Endpoint
        # Fetch user-specific vocabulary data and return `id`
        #
        # Example curl:
        # curl -X GET -H "Content-Type: application/json" \
        # "http://localhost:5100/f-api/v1/text-parser-words?userId=testUser&collectionName=vocabulary&p_tag=sentence_mining&s_tag=verbs-1"
        # -------------------------------------------------------------------------------------
        @app.route("/f-api/v1/text-parser-words", methods=["GET"])
        def get_vocabulary():
            logging.info("Processing GET request for /f-api/v1/text-parser-words")
            try:
                data = request.args.to_dict()
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
                    self.vocabulary_collection.find(
                        {"userId": user_id, "p_tag": p_tag, "s_tag": s_tag}
                    )
                )

                logging.info("Transforming data into the expected format")
                transformed_data = []
                for vocab in user_vocabulary:
                    question = {
                        "id": str(vocab["_id"]),
                        "vocabulary_japanese": vocab.get("vocabulary_japanese", ""),
                        "vocabulary_simplified": vocab.get("vocabulary_simplified", ""),
                        "vocabulary_english": vocab.get("vocabulary_english", ""),
                        "vocabulary_audio": vocab.get("vocabulary_audio", ""),
                        "word_type": vocab.get("word_type", ""),
                        "notes": vocab.get("notes", ""),
                        "sentences": [
                            {
                                "sentence_japanese": sentence.get("sentence_japanese", ""),
                                "sentence_simplified": sentence.get("sentence_simplified", ""),
                                "sentence_romaji": sentence.get("sentence_romaji", ""),
                                "sentence_english": sentence.get("sentence_english", ""),
                                "sentence_audio": sentence.get("sentence_audio", ""),
                                "sentence_picture": sentence.get("sentence_picture", "")
                            }
                            for sentence in vocab.get("sentences", [])
                        ]
                    }
                    transformed_data.append(question)

                logging.info("Returning transformed data")
                return jsonify({"words": transformed_data}), 200

            except Exception as e:
                logging.exception("An error occurred while processing the GET request")
                return jsonify({"error": str(e)}), 500


        # -------------------------------------------------------------------------------------
        # POST Endpoint
        # Create new vocabulary records (unchanged)
        #
        # Example curl:
        # curl -X POST -H "Content-Type: application/json" \
        # -d '{
        #   "userId": "testUser",
        #   "difficulty": "easy",
        #   "collectionName": "vocabulary",
        #   "vocabulary_japanese": "紹介",
        #   "p_tag": "sentence_mining",
        #   "s_tag": "verbs-1"
        # }' "http://localhost:5100/f-api/v1/text-parser-words"
        # -------------------------------------------------------------------------------------
        @app.route("/f-api/v1/text-parser-words", methods=["POST"])
        def create_vocabulary_record():
            logging.info("Processing POST request for /f-api/v1/text-parser-words")
            try:
                data = request.json
                logging.info(f"Request data: {data}")

                user_id = data.get("userId")
                collection_name = data.get("collectionName")
                vocabulary_japanese = data.get("vocabulary_japanese")
                p_tag = data.get("p_tag")
                s_tag = data.get("s_tag")
                difficulty = data.get("difficulty", "")
                vocabulary_simplified = data.get("vocabulary_simplified", "")
                vocabulary_english = data.get("vocabulary_english", "")
                vocabulary_audio = data.get("vocabulary_audio", "")
                word_type = data.get("word_type", "")
                notes = data.get("notes", "")
                sentences = data.get("sentences", [])

                if not all([user_id, collection_name, p_tag, s_tag, vocabulary_japanese]):
                    logging.error("Missing required parameters in POST request")
                    return jsonify({"error": "Missing required parameters"}), 400

                doc = {
                    "userId": user_id,
                    "collection_name": collection_name,
                    "vocabulary_japanese": vocabulary_japanese,
                    "p_tag": p_tag,
                    "s_tag": s_tag,
                    "difficulty": difficulty,
                    "vocabulary_simplified": vocabulary_simplified,
                    "vocabulary_english": vocabulary_english,
                    "vocabulary_audio": vocabulary_audio,
                    "word_type": word_type,
                    "notes": notes,
                    "sentences": sentences
                }

                result = self.vocabulary_collection.insert_one(doc)
                logging.info("Document inserted successfully")
                return jsonify({"message": "Document inserted successfully", "id": str(result.inserted_id)}), 201

            except Exception as e:
                logging.exception("An error occurred while processing the POST request")
                return jsonify({"error": str(e)}), 500


        # -------------------------------------------------------------------------------------
        # DELETE Endpoint
        # Delete a vocabulary record by its id
        #
        # Example curl:
        # curl -X DELETE -H "Content-Type: application/json" -d '{
        #   "userId": "testUser",
        #   "id": "64bdfsomeObjectIdValue",
        #   "collectionName": "vocabulary",
        #   "p_tag": "sentence_mining",
        #   "s_tag": "verbs-1"
        # }' "http://localhost:5100/f-api/v1/text-parser-words"
        # -------------------------------------------------------------------------------------
        @app.route("/f-api/v1/text-parser-words", methods=["DELETE"])
        def delete_vocabulary():
            logging.info("Processing DELETE request for /f-api/v1/text-parser-words")
            try:
                data = request.json
                logging.info(f"Request data: {data}")

                user_id = data.get("userId")
                collection_name = data.get("collectionName")
                p_tag = data.get("p_tag")
                s_tag = data.get("s_tag")
                vocab_id = data.get("id")

                if not all([user_id, collection_name, p_tag, s_tag, vocab_id]):
                    logging.error("Missing required parameters in DELETE request")
                    return jsonify({"error": "Missing required parameters"}), 400

                logging.info("Deleting vocabulary from the collection")
                result = self.vocabulary_collection.delete_one(
                    {
                        "_id": ObjectId(vocab_id),
                        "userId": user_id,
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
                logging.exception("An error occurred while processing the DELETE request")
                return jsonify({"error": str(e)}), 500






        # ------------------------------------- serving custom vocab cards -------------------------------------- #

        # we can have multiple mined sentences for each word, so this way we return all the mined sentences as well
        # which can be useful for learning

        # here we are getting sentence mined words from user dynamic DB, I think we have separate db just for that
        # so best to have also separate API endpoint, the difficulty frequency function is common for various endpoints though
        # curl -X GET -H "Content-Type: application/json" "http://localhost:5100/f-api/v1/text-parser-words?userId=testUser&collectionName=vocabulary&p_tag=sentence_mining&s_tag=verbs-1"
        # curl -X POST -H "Content-Type: application/json" -d '{
        #   "userId": "testUser",
        #   "difficulty": "easy",
        #   "collectionName": "vocabulary",
        #   "vocabulary_japanese": "紹介",
        #   "p_tag": "sentence_mining",
        #   "s_tag": "verbs-1"
        # }' "http://localhost:5100/f-api/v1/text-parser-words"
        # @app.route("/f-api/v1/text-parser-words", methods=["GET", "POST", "DELETE"])
        # def text_parser_words():
        #     logging.info("Received request to /f-api/v1/text-parser-words")

        #     try:
        #         if request.method == "POST":
        #             logging.info("Processing POST request")
        #             data = request.json
        #             logging.info(f"Request data: {data}")

        #             user_id = data.get("userId")
        #             difficulty = data.get("difficulty")
        #             collection_name = data.get("collectionName")
        #             vocabulary_japanese = data.get("vocabulary_japanese")
        #             p_tag = data.get("p_tag")
        #             s_tag = data.get("s_tag")

        #             if not all(
        #                 [
        #                     user_id,
        #                     collection_name,
        #                     p_tag,
        #                     s_tag,
        #                     vocabulary_japanese,
        #                     difficulty,
        #                 ]
        #             ):
        #                 logging.error("Missing required parameters in POST request")
        #                 return jsonify({"error": "Missing required parameters"}), 400

        #             logging.info("Updating difficulty in the vocabulary collection")
        #             result = self.vocabulary_collection.update_one(
        #                 {
        #                     "userId": user_id,
        #                     "vocabulary_japanese": vocabulary_japanese,
        #                     "p_tag": p_tag,
        #                     "s_tag": s_tag,
        #                 },
        #                 {"$set": {"difficulty": difficulty}},
        #             )

        #             if result.matched_count == 0:
        #                 logging.error("No matching document found for update")
        #                 return jsonify({"error": "No matching document found"}), 404

        #             logging.info("Difficulty updated successfully")
        #             return jsonify({"message": "Difficulty updated successfully"}), 200

        #         elif request.method == "GET":
        #             logging.info("Processing GET request")
        #             data = request.args.to_dict()
        #             logging.info(f"Query string data: {data}")

        #             user_id = data.get("userId")
        #             collection_name = data.get("collectionName")
        #             p_tag = data.get("p_tag")
        #             s_tag = data.get("s_tag")

        #             if not all([user_id, collection_name, p_tag, s_tag]):
        #                 logging.error("Missing required parameters in GET request")
        #                 return jsonify({"error": "Missing required parameters"}), 400

        #             logging.info("Fetching user-specific vocabulary data")
        #             user_vocabulary = list(
        #                 self.vocabulary_collection.find(
        #                     {"userId": user_id, "p_tag": p_tag, "s_tag": s_tag}
        #                 )
        #             )

        #             logging.info("Transforming data into the expected format")
        #             transformed_data = []
        #             for vocab in user_vocabulary:
        #                 question = {
        #                     "vocabulary_japanese": vocab.get("vocabulary_japanese", ""),
        #                     "vocabulary_simplified": vocab.get(
        #                         "vocabulary_simplified", ""
        #                     ),
        #                     "vocabulary_english": vocab.get("vocabulary_english", ""),
        #                     "vocabulary_audio": vocab.get("vocabulary_audio", ""),
        #                     "word_type": vocab.get("word_type", ""),
        #                     "notes": vocab.get("notes", ""),
        #                     "sentences": [
        #                         {
        #                             "sentence_japanese": sentence.get(
        #                                 "sentence_japanese", ""
        #                             ),
        #                             "sentence_simplified": sentence.get(
        #                                 "sentence_simplified", ""
        #                             ),
        #                             "sentence_romaji": sentence.get(
        #                                 "sentence_romaji", ""
        #                             ),
        #                             "sentence_english": sentence.get(
        #                                 "sentence_english", ""
        #                             ),
        #                             "sentence_audio": sentence.get(
        #                                 "sentence_audio", ""
        #                             ),
        #                             "sentence_picture": sentence.get(
        #                                 "sentence_picture", ""
        #                             ),
        #                         }
        #                         for sentence in vocab.get("sentences", [])
        #                     ],
        #                 }
        #                 transformed_data.append(question)

        #             logging.info("Returning transformed data")
        #             return jsonify({"words": transformed_data}), 200

        #         elif request.method == "DELETE":
        #             logging.info("Processing DELETE request")
        #             data = request.json
        #             logging.info(f"Request data: {data}")

        #             user_id = data.get("userId")
        #             collection_name = data.get("collectionName")
        #             p_tag = data.get("p_tag")
        #             s_tag = data.get("s_tag")
        #             vocabulary_japanese = data.get("vocabulary_japanese")

        #             if not all(
        #                 [user_id, collection_name, p_tag, s_tag, vocabulary_japanese]
        #             ):
        #                 logging.error("Missing required parameters in DELETE request")
        #                 return jsonify({"error": "Missing required parameters"}), 400

        #             logging.info("Deleting vocabulary from the collection")
        #             result = self.vocabulary_collection.delete_one(
        #                 {
        #                     "userId": user_id,
        #                     "vocabulary_japanese": vocabulary_japanese,
        #                     "p_tag": p_tag,
        #                     "s_tag": s_tag,
        #                 }
        #             )

        #             if result.deleted_count == 0:
        #                 logging.error("No matching document found for deletion")
        #                 return jsonify({"error": "No matching document found"}), 404

        #             logging.info("Vocabulary deleted successfully")
        #             return jsonify({"message": "Vocabulary deleted successfully"}), 200

        #     except Exception as e:
        #         logging.exception("An error occurred while processing the request")
        #         return jsonify({"error": str(e)}), 500






