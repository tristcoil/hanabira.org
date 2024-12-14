const mongoose = require('mongoose');
const { Schema } = mongoose;

const wordSchema = new Schema({
    vocabulary_japanese: { type: String, unique: true, required: true },
    vocabulary_simplified: String,
    vocabulary_english: { type: String, required: true },
    vocabulary_audio: String,
    word_type: String,
    p_tag: String,      // parent tag 'JLPT N3'
    s_tag: String,      // sub tag '100'
    sentences: [{ type: Schema.Types.ObjectId, ref: 'Sentence' }]
})

const Word = mongoose.model('Word', wordSchema);

module.exports = { Word };
