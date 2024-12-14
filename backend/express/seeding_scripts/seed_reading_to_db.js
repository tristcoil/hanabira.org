const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs"); // Import the fs module to read files

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/zenRelationshipsAutomated", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --------------------------- schemas -----------------------------

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

// Create a model for readings
const Reading = mongoose.model("Reading", readingSchema, "reading");

// Define the kanji directory path as a variable
const readingDir = "./reading";

// --------------


// Seed the database with readings from JSON files
const seedReadings = async (filePaths) => {
  try {
    let combinedReadingData = [];
    
    for (let path of filePaths) {
      const readingData = JSON.parse(fs.readFileSync(path, "utf8"));
      combinedReadingData.push(readingData);
    }
    
    await Reading.deleteMany();
    await Reading.insertMany(combinedReadingData);

    console.log("Readings seeded successfully");
  } catch (error) {
    console.error("Failed to seed readings:", error);
  }
};



const readingFilePaths = [
  `${readingDir}/JLPT_N3_reading_01.json`,
  `${readingDir}/JLPT_N3_reading_02.json`,
  `${readingDir}/JLPT_N3_reading_03.json`,
  `${readingDir}/JLPT_N3_reading_04.json`,
  `${readingDir}/JLPT_N3_reading_05.json`,
  `${readingDir}/JLPT_N3_reading_06.json`,
  `${readingDir}/JLPT_N3_reading_07.json`,
  `${readingDir}/JLPT_N3_reading_08.json`,  
  `${readingDir}/JLPT_N3_reading_09.json`,
  `${readingDir}/JLPT_N3_reading_10.json`,
  // ... Add more paths as needed
];


// Seed the database with Japanese vocabulary and grammar
const seedDatabase = async () => {
  await seedReadings(readingFilePaths);
  mongoose.connection.close();
};

// Run the seed script
seedDatabase();