const mongoose = require('mongoose');
const { Schema } = mongoose;


const grammarSchema = new Schema({
    title: { type: String, required: true },
    short_explanation: { type: String, required: true },
    long_explanation: { type: String, required: true },
    formation: { type: String, required: true },
    examples: [
      {
        kr: { type: String, required: true }, // Korean text
        romaji: { type: String, required: true }, // Korean text
        en: { type: String, required: true }, // English translation
        grammar_audio: String, // Optional audio field
      },
    ],
    p_tag: String, // Parent tag
    s_tag: String, // Sub tag
});

const KrGrammar = mongoose.model('KrGrammar', grammarSchema);

module.exports = { KrGrammar } 
