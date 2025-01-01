const express = require('express');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sourceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


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

// Create a model for vocabulary
const Kanji = mongoose.model('Kanji', kanjiSchema, 'kanji');


// Create a schema for vocabulary
const vocabularySchema = new mongoose.Schema({
  question: String,
  answer: String,
  tag: String,
});

// Create a model for vocabulary
const Vocabulary = mongoose.model('Vocabulary', vocabularySchema, 'vocabulary');

// Create a schema for grammar
const grammarSchema = new mongoose.Schema({
  question: String,
  answer: String,
  tag: String,
});

// Create a model for grammar
const Grammar = mongoose.model('Grammar', grammarSchema, 'grammar');





// Seed the database with Japanese vocabulary
const seedKanji = async () => {
  try {
    const kanji = [
      {
        "kanji": "駐",
        "reading": "チュウ",
        "k_audio": "/audio/japanese/kanji/k_駐.mp3",
        "exampleWord": "駐車",
        "exampleReading": "ちゅうしゃ",
        "translation": "parking",
        "audio": "/audio/japanese/kanji/v_駐車.mp3",
        "p_tag": "JLPT_N3",
        "s_tag": "part_1"
      },
      {
        "kanji": "満",
        "reading": "マン",
        "k_audio": "/audio/japanese/kanji/k_満.mp3",
        "exampleWord": "満車",
        "exampleReading": "まんしゃ",
        "translation": "full of cars",
        "audio": "/audio/japanese/kanji/v_満車.mp3",
        "p_tag": "JLPT_N3",
        "s_tag": "part_1"
      },
      {
        "kanji": "禁",
        "reading": "キン",
        "k_audio": "/audio/japanese/kanji/k_禁.mp3",
        "exampleWord": "禁止",
        "exampleReading": "きんし",
        "translation": "prohibition",
        "audio": "/audio/japanese/kanji/v_禁止.mp3",
        "p_tag": "JLPT_N3",
        "s_tag": "part_2"
      },
      {
        "kanji": "関",
        "reading": "カン",
        "k_audio": "/audio/japanese/kanji/k_関.mp3",
        "exampleWord": "関心",
        "exampleReading": "カンシン",
        "translation": "interest",
        "audio": "/audio/japanese/kanji/v_関心.mp3",
        "p_tag": "JLPT_N3",
        "s_tag": "part_2"
      },
    ];

    await Kanji.deleteMany();
    await Kanji.insertMany(kanji);

    console.log('Kanji seeded successfully');
  } catch (error) {
    console.error('Failed to seed kanji:', error);
  }
};



// Seed the database with Japanese vocabulary
const seedVocabulary = async () => {
  try {
    const vocabulary = [
      { question: '美しい', answer: 'beautiful', tag: 'adjective' },
      { question: '楽しい', answer: 'fun', tag: 'adjective' },
      // Add more vocabulary here
      { question: '食べる', answer: 'to eat', tag: 'verb' },
      { question: '寝る', answer: 'to sleep', tag: 'verb' },
      // Add more verbs here
    ];

    await Vocabulary.deleteMany();
    await Vocabulary.insertMany(vocabulary);

    console.log('Japanese vocabulary seeded successfully');
  } catch (error) {
    console.error('Failed to seed Japanese vocabulary:', error);
  }
};

// Seed the database with Japanese grammar
const seedGrammar = async () => {
  try {
    const grammar = [
        { question: 'JLPT_N3 Grammar Question 1', answer: 'JLPT_N3 Grammar Answer 1', tag: 'JLPT_N3' },
        { question: 'JLPT_N3 Grammar Question 2', answer: 'JLPT_N3 Grammar Answer 2', tag: 'JLPT_N3' },
        { question: 'JLPT_N4 Grammar Question 1', answer: 'JLPT_N4 Grammar Answer 1', tag: 'JLPT_N4' },
        { question: 'JLPT_N4 Grammar Question 2', answer: 'JLPT_N4 Grammar Answer 2', tag: 'JLPT_N4' },
        // Add more grammar here
      ];

    await Grammar.deleteMany();
    await Grammar.insertMany(grammar);

    console.log('Japanese grammar seeded successfully');
  } catch (error) {
    console.error('Failed to seed Japanese grammar:', error);
  }
};

// Seed the database with Japanese vocabulary and grammar
const seedDatabase = async () => {
  await seedKanji();
  await seedVocabulary();
  await seedGrammar();
  mongoose.connection.close();
};

// Run the seed script
seedDatabase();
