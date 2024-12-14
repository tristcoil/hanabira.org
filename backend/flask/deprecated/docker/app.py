from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.json_util import dumps
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS if needed, especially for frontend applications
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/users', methods=['POST'])
def add_user():
    # Expecting JSON data containing 'name' and 'age'
    user_data = request.json
    if not user_data or 'name' not in user_data or 'age' not in user_data:
        return jsonify({'error': 'Bad Request', 'message': 'Missing name or age'}), 400
    
    mongo.db.users.insert_one(user_data)
    return jsonify({'message': 'User added successfully'}), 201

@app.route('/users', methods=['GET'])
def get_users():
    users = mongo.db.users.find()
    return dumps(users), 200

if __name__ == '__main__':
    app.run(debug=True)
