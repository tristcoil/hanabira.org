const mongoose = require('mongoose');
const { Schema } = mongoose;

const kanjiSchema = new Schema({
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

const Kanji = mongoose.model("Kanji", kanjiSchema, "kanji");

module.exports = { Kanji };
