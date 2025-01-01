const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs"); // Import the fs module to read files

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/sourceDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


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

// -------------

// Create a schema for vocabulary
const vocabularySchema = new mongoose.Schema({
  question: String,
  answer: String,
  tag: String,
});

// Create a model for vocabulary
const Vocabulary = mongoose.model("Vocabulary", vocabularySchema, "vocabulary");



// --------------


// Create a schema for grammar
const grammarSchema = new mongoose.Schema({
  question: String,
  answer: String,
  tag: String,
});

// Create a model for grammar
const Grammar = mongoose.model("Grammar", grammarSchema, "grammar");


// --------------

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


// --------------

// Seed the database with Japanese kanji from JSON files
const seedKanji = async () => {
  try {
    // Read and parse the JSON files
    const kanjiData1 = JSON.parse(
      fs.readFileSync("./kanji/n3kanji1.json", "utf8")
    );
    const kanjiData2 = JSON.parse(
      fs.readFileSync("./kanji/n3kanji2.json", "utf8")
    );
    const kanjiData3 = JSON.parse(
      fs.readFileSync("./kanji/n3kanji3.json", "utf8")
    );
    const kanjiData4 = JSON.parse(
      fs.readFileSync("./kanji/n3kanji4.json", "utf8")
    );
    const kanjiData5 = JSON.parse(
      fs.readFileSync("./kanji/n3kanji5.json", "utf8")
    );
    const kanjiData6 = JSON.parse(
      fs.readFileSync("./kanji/n3kanji6.json", "utf8")
    );

    const kanjiData7 = JSON.parse(
      fs.readFileSync("./kanji/n4kanji1.json", "utf8")
    );
    const kanjiData8 = JSON.parse(
      fs.readFileSync("./kanji/n4kanji2.json", "utf8")
    );
    const kanjiData9 = JSON.parse(
      fs.readFileSync("./kanji/n4kanji3.json", "utf8")
    );
    
    const kanjiData10 = JSON.parse(
      fs.readFileSync("./kanji/n5kanji1.json", "utf8")
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

// Seed the database with Japanese vocabulary
const seedVocabulary = async () => {
  try {
    const vocabulary = [
      { question: "美しい", answer: "beautiful", tag: "adjective" },
      { question: "楽しい", answer: "fun", tag: "adjective" },
      // Add more vocabulary here
      { question: "食べる", answer: "to eat", tag: "verb" },
      { question: "寝る", answer: "to sleep", tag: "verb" },
      // Add more verbs here
    ];

    await Vocabulary.deleteMany();
    await Vocabulary.insertMany(vocabulary);

    console.log("Japanese vocabulary seeded successfully");
  } catch (error) {
    console.error("Failed to seed Japanese vocabulary:", error);
  }
}; mmar.deleteMany();
    await Grammar.insertMany(grammar);

    console.log("Japanese grammar seeded successfully");
  } catch (error) {
    console.error("Failed to seed Japanese grammar:", error);
  }
};

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
  "./reading/reading_0.json",
  "./reading/reading_1.json",
  "./reading/JLPT_N3_reading_01.json",
  "./reading/JLPT_N3_reading_02.json",
  "./reading/JLPT_N3_reading_03.json",
  "./reading/JLPT_N3_reading_04.json",
  "./reading/JLPT_N3_reading_05.json",
  "./reading/JLPT_N3_reading_06.json",
  "./reading/JLPT_N3_reading_07.json",
  "./reading/JLPT_N3_reading_08.json",  
  "./reading/JLPT_N3_reading_09.json",
  "./reading/JLPT_N3_reading_10.json",
  // ... Add more paths as needed
];





// Seed the database with Japanese vocabulary and grammar
const seedDatabase = async () => {
  await seedKanji();
  await seedVocabulary();
  await seedGrammar();
  await seedReadings(readingFilePaths);
  mongoose.connection.close();
};

// Run the seed script
seedDatabase();
