import logging
from flask import request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId


class LibraryTexts:
    def __init__(self):
        # Connect to MongoDB and the "library" database
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["library"]

        # texts, videos collections
        self.texts_collection      = self.db["texts"]
        self.videos_collection     = self.db["videos"]
        logging.basicConfig(level=logging.DEBUG)


    def register_routes(self, app):


        # --------------------- Custom texts ------------------------- #

        # curl -X GET http://localhost:5100/f-api/v1/japanese-texts
        @app.route("/f-api/v1/japanese-texts", methods=["GET"])
        def get_texts():
            try:
                # Retrieve all documents from the "texts" collection
                texts_cursor = self.texts_collection.find({}, {
                    "topic": 1,
                    "sourceLink": 1,
                    "actualText": 1,
                    "p_tag": 1,
                    "s_tag": 1,
                    "userId": 1,
                    "lang": 1
                })

                # Convert ObjectIds to strings
                texts = []
                for doc in texts_cursor:
                    doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
                    texts.append(doc)

                return jsonify(texts), 200
            except Exception as err:
                logging.error(f"Error fetching texts: {err}")
                return jsonify({"message": "Error fetching texts"}), 500



        # curl -X POST http://localhost:5100/f-api/v1/japanese-texts \
        # -H "Content-Type: application/json" \
        # -d '{
        #  "topic": "Japanese Grammar",
        #  "sourceLink": "http://example.com/grammar",
        #  "actualText": "This is a sample text about Japanese grammar.",
        #  "p_tag": "JLPT_N5",
        #  "s_tag": "part_1",
        #  "userId": "testUser",
        #  "lang": "Japanese"
        # }'
        @app.route("/f-api/v1/japanese-texts", methods=["POST"])
        def create_text():
            data = request.json
            required_fields = [
                "topic",
                "sourceLink",
                "actualText",
                "p_tag",
                "s_tag",
                "userId",
                "lang",
            ]

            # Check for missing required fields
            if not all(field in data for field in required_fields):
                return jsonify({"message": "All fields are required"}), 400

            new_text = {
                "topic": data["topic"],
                "sourceLink": data["sourceLink"],
                "actualText": data["actualText"],
                "p_tag": data["p_tag"],
                "s_tag": data["s_tag"],
                "userId": data["userId"],
                "lang": data["lang"],
            }

            try:
                insert_result = self.texts_collection.insert_one(new_text)
                inserted_doc = self.texts_collection.find_one({"_id": insert_result.inserted_id})
                
                # Convert ObjectId to string
                inserted_doc["_id"] = str(inserted_doc["_id"])
                
                return jsonify(inserted_doc), 201
            except Exception as err:
                logging.error(f"Error saving text: {err}")
                return jsonify({"message": "Error saving text"}), 500


        # curl -X DELETE http://localhost:5100/f-api/v1/japanese-texts/<id>
        @app.route("/f-api/v1/japanese-texts/<id>", methods=["DELETE"])
        def delete_text(id):
            try:
                result = self.texts_collection.delete_one({"_id": ObjectId(id)})
                if result.deleted_count == 0:
                    return jsonify({"message": "Text not found"}), 404
                return jsonify({"message": "Text deleted successfully"}), 200
            except Exception as err:
                logging.error(f"Error deleting text: {err}")
                return jsonify({"message": "Error deleting text"}), 500





        # ------------------------------ Custom Videos ----------------------------- #

        # GET /f-api/v1/custom-videos
        # Can filter by userId, p_tag, s_tag, lang
        @app.route("/f-api/v1/custom-videos", methods=["GET"])
        def get_videos():
            logging.info("Received GET request for /f-api/v1/custom-videos")
            try:
                userId = request.args.get('userId')
                p_tag = request.args.get('p_tag')
                s_tag = request.args.get('s_tag')
                lang = request.args.get('lang')

                filter_query = {}
                if userId:
                    filter_query['userId'] = userId
                if p_tag:
                    filter_query['p_tag'] = p_tag
                if s_tag:
                    filter_query['s_tag'] = s_tag
                if lang:
                    filter_query['lang'] = lang

                cursor = self.videos_collection.find(filter_query)
                videos = []
                for doc in cursor:
                    doc['_id'] = str(doc['_id'])
                    videos.append(doc)

                logging.info(f"Sending {len(videos)} videos")
                return jsonify(videos), 200
            except Exception as err:
                logging.error(f"Error fetching videos: {err}")
                return jsonify({"message": str(err)}), 500


        # POST /f-api/v1/custom-videos
        # Requires url, customTitle, customDescription, userId, p_tag, s_tag, lang
        @app.route("/f-api/v1/custom-videos", methods=["POST"])
        def create_video():
            logging.info("Received POST request for /f-api/v1/custom-videos")
            data = request.json
            required_fields = ["url", "customTitle", "customDescription", "userId", "p_tag", "s_tag", "lang"]

            if not all(field in data for field in required_fields):
                logging.error("Missing required fields in POST request")
                return jsonify({"message": "All fields are required"}), 400

            new_video = {
                "url": data["url"],
                "customTitle": data["customTitle"],
                "customDescription": data["customDescription"],
                "userId": data["userId"],
                "p_tag": data["p_tag"],
                "s_tag": data["s_tag"],
                "lang": data["lang"],
            }

            try:
                insert_result = self.videos_collection.insert_one(new_video)
                saved_video = self.videos_collection.find_one({"_id": insert_result.inserted_id})
                saved_video["_id"] = str(saved_video["_id"])
                logging.info(f"Saved new video: {saved_video['_id']}")
                return jsonify(saved_video), 201
            except Exception as err:
                logging.error(f"Error saving video: {err}")
                return jsonify({"message": str(err)}), 500


        # DELETE /f-api/v1/custom-videos/:id
        @app.route("/f-api/v1/custom-videos/<id>", methods=["DELETE"])
        def delete_video(id):
            logging.info(f"Received DELETE request for /f-api/v1/custom-videos/{id}")
            try:
                result = self.videos_collection.delete_one({"_id": ObjectId(id)})
                if result.deleted_count == 0:
                    logging.info("Video not found")
                    return jsonify({"message": "Video not found"}), 404
                logging.info(f"Deleted video with id: {id}")
                return jsonify({"message": "Video deleted successfully"}), 200
            except Exception as err:
                logging.error(f"Error deleting video: {err}")
                return jsonify({"message": str(err)}), 500



