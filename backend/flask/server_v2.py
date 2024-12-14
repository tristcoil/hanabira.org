import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s",
)

app = Flask(__name__)
CORS(app)

# Database configuration
app.config["MONGO_URI_FLASKFLASHCARDDATABASE"] = "mongodb://localhost:27017/flaskFlashcardDB"
mongo_flaskFlashcardDB = PyMongo(app, uri="mongodb://localhost:27017/flaskFlashcardDB")

# ---------------------------------- Global vars ----------------------------------------------

flask_port = 5100

# Determine the environment (dev or prod) to use the correct port
# Reading environment variable with a default value of "dev"
# env var is baked into Dockerfile
env = os.getenv("FLASK_ENV", "dev")    # prod/dev
port = "8000"  # port of static DB container
host = "host.docker.internal" if env == "prod" else "localhost"


# --- universal API endpoints ---- #

# curl -X GET http://localhost:5100/health
@app.route("/health", methods=["GET"])
def health_check():
    # Responds with a simple JSON message and a 200 OK status
    return jsonify({"message": "OK"}), 200




# ---------------- Class imports ----------------- #

# -- emails -- #
# Import and use the EmailWaitlist class
from modules.email_waitlist import EmailWaitlist
email_waitlist = EmailWaitlist()
email_waitlist.register_routes(app)

from modules.login_streak import LoginStreak
login_streak = LoginStreak()
login_streak.register_routes(app)

from modules.vocabulary_mining import MecabUserVocabulary
mecab_vocabulary = MecabUserVocabulary()
mecab_vocabulary.register_routes(app)

from modules.sentence_mining import SentenceMiningModule
sentence_mining_module = SentenceMiningModule()
sentence_mining_module.register_routes(app)

from modules.flashcards import FlashcardModule
flashcard_module = FlashcardModule()
flashcard_module.register_routes(app)

from modules.library import LibraryTexts
library_texts_module = LibraryTexts()
library_texts_module.register_routes(app)


# --------------- End of Class imports ---------------- #





if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=flask_port)
