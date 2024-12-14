const mongoose = require('mongoose');
const { Schema } = mongoose;

const exampleSchema = new Schema({
  jp: { type: String, required: true },
  romaji: { type: String, required: true },
  en: { type: String, required: true },
  grammar_audio: String,
});

const grammarSchema = new Schema({
  title: { type: String, unique: true, required: true },
  short_explanation: { type: String, required: true },
  long_explanation: { type: String, required: true },
  formation: { type: String, required: true },
  examples: [exampleSchema],
  p_tag: String, // parent tag 'JLPT_N3'
  s_tag: String, // sub tag '100'
});

const Grammar = mongoose.model('Grammar', grammarSchema);

module.exports = { Grammar } 
