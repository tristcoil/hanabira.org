from flask import request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import logging


class LoginStreak:
    def __init__(self):
        # Set up MongoDB connection for logins
        self.client_l = MongoClient("mongodb://localhost:27017/")
        self.db_l = self.client_l["login_db"]
        self.logins_collection = self.db_l["logins"]

    def register_routes(self, app):

        #  curl -X POST http://localhost:5100/f-api/v1/notify-login \
        #  -H "Content-Type: application/json" \
        #  -d '{
        #        "userId": "example_user"
        #      }'
        @app.route("/f-api/v1/notify-login", methods=["POST"])
        def notify_login():
            data = request.json
            userId = data.get("userId")
            if userId:
                login_date = datetime.now().strftime("%Y-%m-%d")
                result = self.logins_collection.find_one_and_update(
                    {"userId": userId, "date": login_date},
                    {"$inc": {"count": 1}},
                    upsert=True,
                    return_document=True,
                )
                logging.info(
                    f"Login recorded for userId: {userId} on date: {login_date}. Count updated successfully."
                )

                return (
                    jsonify(
                        {
                            "message": f"Login for {userId} on {login_date} recorded successfully.",
                            "newCount": result["count"] if result else 1,
                        }
                    ),
                    200,
                )
            else:
                logging.error("Login attempt without a userId in the request.")
                return jsonify({"error": "userId not provided"}), 400

        # curl -X GET http://localhost:5100/f-api/v1/get-logins/example_user
        @app.route("/f-api/v1/get-logins/<userId>", methods=["GET"])
        def get_logins(userId):
            if not userId:
                return jsonify({"error": "userId is required"}), 400
            try:
                # Retrieve login records for the specified userId
                logins = list(
                    self.logins_collection.find(
                        {"userId": userId}, {"_id": 0, "date": 1, "count": 1}
                    ).sort("date", 1)
                )
                return jsonify(logins), 200
            except Exception as e:
                logging.error(f"Error fetching login history for {userId}: {str(e)}")
                return (
                    jsonify(
                        {"error": "An error occurred while fetching login history"}
                    ),
                    500,
                )

        # curl -X GET http://localhost:5100/f-api/v1/streak/example_user
        @app.route("/f-api/v1/streak/<userId>", methods=["GET"])
        def longest_streak(userId):
            # Fetch all login docs for the given userId, sorted by date
            logins = list(
                self.logins_collection.find({"userId": userId}).sort("date", 1)
            )

            if not logins:
                return (
                    jsonify({"error": "No login records found for the specified user"}),
                    404,
                )

            longest_streak = 0
            current_streak = 1
            previous_date = datetime.strptime(logins[0]["date"], "%Y-%m-%d")

            for login in logins[1:]:
                login_date = datetime.strptime(login["date"], "%Y-%m-%d")
                # Check if the login date is consecutive (yesterday + 1 day = today)
                if login_date - timedelta(days=1) == previous_date:
                    current_streak += 1
                else:
                    longest_streak = max(longest_streak, current_streak)
                    current_streak = 1
                previous_date = login_date

            longest_streak = max(longest_streak, current_streak)

            return jsonify({"longest_streak": longest_streak}), 200
