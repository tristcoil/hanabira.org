const mongoose = require("mongoose");
const { Schema } = mongoose;

const grammarSchema = new Schema({
  title: { type: String, required: true },
  short_explanation: { type: String, required: true },
  long_explanation: { type: String, required: true },
  formation: { type: String, required: true },
  examples: [
    {
      vn: { type: String, required: true }, // Vietnamese text
      en: { type: String, required: true }, // English translation
      grammar_audio: String, // Optional audio field
    },
  ],
  p_tag: String, // Parent tag
  s_tag: String, // Sub tag
});

const VnGrammar = mongoose.model("VnGrammar", grammarSchema);

module.exports = { VnGrammar };
