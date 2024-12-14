const mongoose = require('mongoose');
const { Schema } = mongoose;

const readingSchema = new Schema({
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

const Reading = mongoose.model("Reading", readingSchema, "reading");

module.exports = { Reading };
