const mongoose = require('mongoose');
const { Schema } = mongoose;

// child object v1
//const sentenceSchema = new Schema({
//    jap: { type: String, unique: true, required: true },
//    sim: String,
//    eng: { type: String, required: true },
//    path: String,
//    key: { type: String, required: true },
//});

// child object v2
const sentenceSchema = new Schema({
    sentence_original: { type: String, unique: true, required: true },
    sentence_simplified: String,
    sentence_romaji: String,
    sentence_english: { type: String, required: true },
    sentence_audio: String,
    sentence_picture: String,
    key: { type: String, required: true },
});


const Sentence = mongoose.model('Sentence', sentenceSchema);

module.exports = { Sentence };
