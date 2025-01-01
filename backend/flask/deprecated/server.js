const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ------------------------------- DB Connections --------------------------------- //

// Connect to flashcardDB
const flashcardDBConnection = mongoose.createConnection(
  "mongodb://localhost:27017/flashcardDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Connect to sourceDB
const sourceDBConnection = mongoose.createConnection(
  "mongodb://localhost:27017/sourceDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ------------------------------------- Models / Collections -------------------------------------- //

// Create a schema for flashcard state in flashcardDB
const flashcardStateSchema = new mongoose.Schema({
  userId: String,
  count: Number,
  currentQuestionIndex: Number,
  difficulty: String,
  kanji: String,
  reading: String,
  exampleWord: String,
  exampleReading: String,
  p_tag: String,
  s_tag: String,
});

// Create a model for flashcard state in flashcardDB
const FlashcardState = flashcardDBConnection.model(
  "FlashcardState",
  flashcardStateSchema
);





// ----------------------------------------------- //

// Create a schema for vocabulary
const kanjiSchema = new mongoose.Schema({
  kanji: String,
  reading: String,
  k_audio: String,
  exampleWord: String,
  exampleReading: String,
  translation: String,
  audio: String,
  p_tag: String,
  s_tag: String,
});

// Register the vocabulary schema
sourceDBConnection.model("Kanji", kanjiSchema, "kanji");

// Create a model for vocabulary
const Kanji = sourceDBConnection.model("Kanji");

// ---

// Create a schema for vocabulary
const vocabularySchema = new mongoose.Schema({
  question: String,
  answer: String,
  tag: String,
});

// Register the vocabulary schema
sourceDBConnection.model("Vocabulary", vocabularySchema, "vocabulary");

// Create a model for vocabulary
const Vocabulary = sourceDBConnection.model("Vocabulary");

// ---

// Create a schema for grammar
const grammarSchema = new mongoose.Schema({
  question: String,
  answer: String,
  tag: String,
});

// Create a model for grammar, this model might need sourcedbconnection call, not just mongoose
const Grammar = mongoose.model("Grammar", grammarSchema, "grammar");


// Create a schema for readings
const readingSchema = new mongoose.Schema({
  key: String,
  title: String,
  titleRomaji: String,
  titleJp: String,
  p_tag: String,
  s_tag: String,
  textAudio: String,
  textAudio_1: String,
  textAudioEn: String,
  textAudioEn_1: String,
  japaneseText: [String],
  romanizedText: [String],
  englishTranslation: [String],
  readingVocabulary: [String],
  readingVocabularyEn: [String],
  readingGrammar: [String],
  readingGrammarEn: [String],
  sentencePayload: [{
    japanese: String,
    romanization: String,
    translation: String,
    audioPath: String,
    audioPathEn: String
  }]
});


sourceDBConnection.model("Reading", readingSchema, "reading");
// Create a model for reading
const Reading = sourceDBConnection.model("Reading");




// ---------------------------------- API endpoints ----------------------------------------- //

// POST endpoint to store flashcard state
app.post("/api/flashcard", async (req, res) => {
  console.log(req.body);

  try {
    const {
      userId,
      count,
      currentQuestionIndex,
      difficulty,
      kanji,
      reading,
      exampleWord,
      exampleReading,
    } = req.body;

    let flashcardState = await FlashcardState.findOne({ userId, kanji });

    if (!flashcardState) {
      // Create a new document if it doesn't exist
      flashcardState = new FlashcardState({
        userId,
        count,
        currentQuestionIndex,
        difficulty,
        kanji,
        reading,
        exampleWord,
        exampleReading,
      });
    } else {
      // Update the existing document
      flashcardState.count = count;
      flashcardState.currentQuestionIndex = currentQuestionIndex;
      flashcardState.difficulty = difficulty;
    }

    await flashcardState.save();

    res.status(201).json({ message: "Flashcard state stored successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to store flashcard state" });
  }
});

// GET endpoint to retrieve flashcard states for a specific user
app.get("/api/flashcard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const flashcardStates = await FlashcardState.find({ userId });

    if (flashcardStates.length === 0) {
      return res.status(404).json({ error: "Flashcard states not found" });
    }

    res.status(200).json(flashcardStates);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve flashcard states" });
  }
});

// ----------------------------------------------------------------------------------- //

// GET endpoint to retrieve collections from FlashcardState
app.get("/api/flashcard-collections", async (req, res) => {
  try {
    const flashcardCollections = await flashcardDBConnection.db
      .listCollections()
      .toArray();
    const collectionNames = flashcardCollections.map(
      (collection) => collection.name
    );
    res.status(200).json(collectionNames);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve flashcard collections" });
  }
});

// GET endpoint to retrieve collections from sourceDB
app.get("/api/source-collections", async (req, res) => {
  try {
    const collections = await sourceDBConnection.db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    res.status(200).json(collectionNames);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve source collections" });
  }
});


// GET endpoint to retrieve Kanji based on p_tag and s_tag
// curl "http://localhost:8000/api/kanji?p_tag=JLPT_N3&s_tag=part_1"
app.get("/api/kanji", async (req, res) => {
  try {
      const { p_tag, s_tag } = req.query; // extracting p_tag and s_tag from the query parameters

      if (!p_tag || !s_tag) {
          return res.status(400).json({ error: "Both p_tag and s_tag are required" });
      }

      const kanjiData = await Kanji.find({ p_tag, s_tag });

      if (kanjiData.length === 0) {
          return res.status(404).json({ error: "Kanji data not found for the given parameters" });
      }

      res.status(200).json(kanjiData);
  } catch (error) {
      res.status(500).json({ error: "Failed to retrieve Kanji data" });
  }
});


// GET endpoint to retrieve a reading by its 'id' using a query parameter
// curl -i -X GET 'http://localhost:8000/api/reading?key=reading_1'
app.get("/e-api/v1/reading", async (req, res) => {
  try {
    const { key } = req.query; // Extract the key from the query parameters
    console.log(key);

    const reading = await Reading.findOne({ key: key }); // Use findOne to search by the key

    console.log(reading);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    res.status(200).json(reading);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reading" });
  }
});




// --------------------------------------------------------------------------------------------- //

// POST endpoint to retrieve and clone a collection from sourceDB to flashcardDB
app.post("/api/clone-collection", async (req, res) => {
  try {
    const { collection } = req.body;
    console.log(`Collection '${collection}' requested for cloning`);

    // Fetch the selected collection from the sourceDB
    const selectedCollection = await sourceDBConnection.db
      .collection(collection)
      .find()
      .toArray();

    if (selectedCollection.length === 0) {
      console.log(`Collection '${collection}' not found in sourceDB`);
      return res
        .status(404)
        .json({ error: "Collection not found in sourceDB" });
    }

    // Clone the collection by inserting the documents into the flashcardDB
    const clonedDocuments = await flashcardDBConnection.db
      .collection(collection)
      .insertMany(selectedCollection);

    console.log(
      `Cloned ${clonedDocuments.insertedCount} documents from collection '${collection}'`
    );

    res.status(200).json({ message: "Collection cloned successfully" });
  } catch (error) {
    console.error("Failed to clone collection:", error);
    res.status(500).json({ error: "Failed to clone collection" });
  }
});

// --------------------------------------------------------------------------------------------- //

// Start the server
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
