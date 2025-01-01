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
        logging.basicConfig(level=logging.INFO)  # Set logging level to INFO

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
                "lang": data.get("lang"),
                "sentences": data.get("sentences", []),
                "userId": user_id,
                "vocabulary_audio": data.get("vocabulary_audio"),
                "vocabulary_english": data.get("vocabulary_english"),
                "vocabulary_original": data.get("vocabulary_original"),
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
        #         "vocabulary_original": data.get("vocabulary_original"),
        #         "vocabulary_simplified": data.get("vocabulary_simplified"),
        #         "word_type": data.get("word_type"),
        #         "notes": data.get("notes", ""),
        #     }

        #     # Insert or update the document in the database
        #     insert_result = self.vocabulary_collection.update_one(
        #         {
        #             "userId": user_id,
        #             "vocabulary_original": data.get("vocabulary_original"),
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
        #   "vocabulary_original": "紹介",
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
                vocabulary_original = data.get("vocabulary_original")
                p_tag = data.get("p_tag")
                s_tag = data.get("s_tag")
                lang = data.get("lang")
                difficulty = data.get("difficulty", "")
                vocabulary_simplified = data.get("vocabulary_simplified", "")
                vocabulary_english = data.get("vocabulary_english", "")
                vocabulary_audio = data.get("vocabulary_audio", "")
                word_type = data.get("word_type", "")
                notes = data.get("notes", "")
                sentences = data.get("sentences", [])

                if not all([user_id, collection_name, p_tag, s_tag, vocabulary_original]):
                    logging.error("Missing required parameters in POST request")
                    return jsonify({"error": "Missing required parameters"}), 400

                doc = {
                    "userId": user_id,
                    "collection_name": collection_name,
                    "vocabulary_original": vocabulary_original,
                    "p_tag": p_tag,
                    "s_tag": s_tag,
                    "lang": lang,
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
        # PATCH Endpoint
        # Update an existing vocabulary record by its ID
        #
        # Example curl:
        # curl -X PATCH -H "Content-Type: application/json" \
        # -d '{"difficulty": "medium"}' \
        # "http://localhost:5100/f-api/v1/text-parser-words/INSERT_RECORD_ID_HERE"
        # -------------------------------------------------------------------------------------
        @app.route("/f-api/v1/text-parser-words/<string:record_id>", methods=["PATCH"])
        def update_vocabulary_record(record_id):
            logging.info(f"Processing PATCH request for /f-api/v1/text-parser-words/{record_id}")
            try:
                data = request.json
                logging.info(f"Request data for PATCH: {data}")

                # Convert record_id to ObjectId
                from bson import ObjectId
                filter_query = {"_id": ObjectId(record_id)}

                # You can allow partial updates for any field you like,
                # but here we focus on 'difficulty' as an example.
                update_doc = {"$set": {}}
                if "difficulty" in data:
                    update_doc["$set"]["difficulty"] = data["difficulty"]

                # Add other optional fields if needed:
                # if "notes" in data: update_doc["$set"]["notes"] = data["notes"]

                result = self.vocabulary_collection.update_one(filter_query, update_doc)

                if result.matched_count == 0:
                    logging.error(f"No document found with id {record_id}")
                    return jsonify({"error": "Document not found"}), 404

                logging.info("Document updated successfully")
                return jsonify({"message": "Document updated successfully"}), 200

            except Exception as e:
                logging.exception("An error occurred while processing the PATCH request")
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
