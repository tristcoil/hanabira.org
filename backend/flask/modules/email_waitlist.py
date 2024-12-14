from flask import request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

class EmailWaitlist:
    def __init__(self):
        # Set up the MongoDB connection when the class is instantiated
        self.client_e = MongoClient('mongodb://localhost:27017/')
        self.db_e = self.client_e['email_db']
        self.emails_collection = self.db_e['emails']

    def register_routes(self, app):
        # Define the route within this method so it has access to 'self'




        #  curl -X POST \
        #  -H "Content-Type: application/json" \
        #  -d '{"email":"test@example.com"}' \
        #  http://localhost:5100/f-api/v1/submit_email
        @app.route('/f-api/v1/submit_email', methods=['POST'])
        def submit_email():
            data = request.get_json()
            email = data.get('email')

            if not email:
                return jsonify({'error': 'Email is required'}), 400

            # Save the email to the database
            email_data = {'email': email}
            result = self.emails_collection.insert_one(email_data)

            return jsonify({'message': 'Email submitted successfully', 'id': str(result.inserted_id)}), 200
