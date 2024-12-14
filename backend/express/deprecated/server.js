const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ------------------------------- DB Connections --------------------------------- //

// Connect to sourceDB
const sourceDBConnection = mongoose.createConnection(
  "mongodb://localhost:27017/sourceDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ------------------------------------- Models / Collections -------------------------------------- //







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



// ---------------------------------- API endpoints ----------------------------------------- //


// ----------------------------------------------------------------------------------- //


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



// --------------------------------------------------------------------------------------------- //


// --------------------------------------------------------------------------------------------- //

// Start the server
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
