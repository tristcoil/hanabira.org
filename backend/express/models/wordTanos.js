const mongoose = require('mongoose');
const { Schema } = mongoose;

// const wordSchema = new Schema({
//     vocabulary_original: { type: String, unique: true, required: true },
//     vocabulary_simplified: String,
//     vocabulary_english: { type: String, required: true },
//     vocabulary_audio: String,
//     word_type: String,
//     p_tag: String,      // parent tag 'JLPT N3'
//     s_tag: String,      // sub tag '100'
//     sentences: [{ type: Schema.Types.ObjectId, ref: 'Sentence' }]
// })

// parent object
const tanosWordSchema = new Schema({
    vocabulary_original: { type: String, unique: false, required: true }, // we have repeating words, they differ by p_tag in api searches
    vocabulary_simplified: String,
    vocabulary_english: { type: String, unique: false, required: false },  // TODO: huh, some are missing, you need to review source data
    vocabulary_audio: String,
    word_type:{ type: String, unique: false, required: false },
    p_tag: String, // parent tag 'JLPT_N3'
    s_tag: String, // sub tag '100'
    //sentences: [{ type: Schema.Types.ObjectId, ref: "Sentence" }],
  });

const TanosWord = mongoose.model('tanosWord', tanosWordSchema);

module.exports = { TanosWord };
