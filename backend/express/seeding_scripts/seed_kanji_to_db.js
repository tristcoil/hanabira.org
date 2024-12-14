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

// Define the kanji directory path as a variable
const kanjiDir = "./kanji";

// --------------------------- schemas -----------------------------

// Create a schema for kanji
const kanjiSchema = new mongoose.Schema({
  kanji: String,
  onYomi: String,
  kunYomi: String,    
  reading: String,
  k_audio: String,
  exampleWord: String,
  exampleReading: String,
  translation: String,
  audio: String,
  p_tag: String,
  s_tag: String,
});

// Create a model for kanji
const Kanji = mongoose.model("Kanji", kanjiSchema, "kanji");

// --------------

// Seed the database with Japanese kanji from JSON files
const seedKanji = async () => {
  try {
    // Read and parse the JSON files
    const kanjiData1 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n3kanji1.json`, "utf8")
    );
    const kanjiData2 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n3kanji2.json`, "utf8")
    );
    const kanjiData3 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n3kanji3.json`, "utf8")
    );
    const kanjiData4 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n3kanji4.json`, "utf8")
    );
    const kanjiData5 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n3kanji5.json`, "utf8")
    );
    const kanjiData6 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n3kanji6.json`, "utf8")
    );

    const kanjiData7 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n4kanji1.json`, "utf8")
    );
    const kanjiData8 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n4kanji2.json`, "utf8")
    );
    const kanjiData9 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n4kanji3.json`, "utf8")
    );
    
    const kanjiData10 = JSON.parse(
      fs.readFileSync(`${kanjiDir}/n5kanji1.json`, "utf8")
    );


    // Combine the data from both JSON files
    const combinedKanjiData = [
      ...kanjiData1,
      ...kanjiData2,
      ...kanjiData3,
      ...kanjiData4,
      ...kanjiData5,
      ...kanjiData6,
      ...kanjiData7,
      ...kanjiData8,
      ...kanjiData9,
      ...kanjiData10,
    ];

    await Kanji.deleteMany();
    await Kanji.insertMany(combinedKanjiData);

    console.log("Kanji seeded successfully");
  } catch (error) {
    console.error("Failed to seed kanji:", error);
  }
};



// Seed the database with Japanese vocabulary and grammar
const seedDatabase = async () => {
  await seedKanji();
  mongoose.connection.close();
};

// Run the seed script
seedDatabase();
