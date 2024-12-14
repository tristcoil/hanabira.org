// db is created if it does not exist
// Script seeds database with words and sentences
// seeding is done simply with insertMany calls
// once database is seeded we are adding database relationships
// between words and sentences

// middleware scripts that provide data from actual json files
const words_data = require('./words');
const sentences_data = require('./sentences');

const mongoose = require("mongoose");
const { Schema } = mongoose;



// ----------------- DB schema definitions ------------------------

// parent object
const wordSchema = new Schema({
  vocabulary_japanese: { type: String, unique: false, required: true },  // we have repeating words, they differ by p_tag in api searches
  vocabulary_simplified: String,
  vocabulary_english: { type: String, unique: false, required: true },
  vocabulary_audio: String,
  word_type: String,
  p_tag: String, // parent tag 'JLPT_N3'
  s_tag: String, // sub tag '100'
  sentences: [{ type: Schema.Types.ObjectId, ref: "Sentence" }],
});

// child object
const sentenceSchema = new Schema({
  // sentence_japanese: { type: String, unique: true, required: true },   // same key can be for N3, N2, N5, they repeat sometimes
  sentence_japanese: { type: String, unique: false, required: true },
  sentence_simplified: String,
  sentence_romaji: String,
  sentence_english: { type: String, required: true },
  sentence_audio: String,
  sentence_picture: String,
  key: { type: String, required: true },
});

// ----------------- end of DB schema definitions -----------------



// ----------------- Function definitions ------------------

const connectToDb = async () => {
  const dbHost = "localhost";
  const dbPort = 27017;
  const dbName = "zenRelationshipsAutomated";

  try {
    await mongoose.connect(
      "mongodb://" + dbHost + ":" + dbPort + "/" + dbName,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Mongo Connection Open.");
  } catch (err) {
    console.log("Mongo Connection ERROR!!!!");
    console.log(err);
  }
};





// code that waits until words and sentences are found
// then executes the rest of the code
const addSentenceRelationship = async (vocab) => {
  console.log("func processing vocab word: " + vocab);
  try {
    const word = await Word.findOne({ vocabulary_japanese: vocab });
    const tkt_sentences = await Sentence.find({ key: vocab });
    if (tkt_sentences.length === 0) {
      console.log("No sentences found for the given vocab: " + vocab);
    } else {
      word.sentences = [];
      tkt_sentences.forEach((item) => {
        word.sentences.push(item);
      });
      const savedWord = await word.save();
      //console.log("saved word: ");
      //console.log(savedWord);
      console.log("populating words: ");

      const populatedWord = await Word.findOne({
        vocabulary_japanese: vocab,
      }).populate("sentences");
      console.log("populated word: ");
      console.log(populatedWord);
    }
  } catch (error) {
    console.log(error);
  }
};


const addSentencesRelationships = async (vocabulary) => {
  // use map instead of for loop 
  // so we can await completion of the promised array
  //const promiseArr = vocabulary.map((vocab) =>
  //  addSentenceRelationship(vocab)
  //);

  const promiseArr = vocabulary.map(async (vocab) =>
    await addSentenceRelationship(vocab)
  );


  // we await for all relationships to be created
  // then we can close the database once 
  // addSentencesRelationships has completed running
  await Promise.all(promiseArr);
};

// ----------------- end of function definitions ------------------





// ----------------- model compilation ------------------------
const Word = mongoose.model("Word", wordSchema);
const Sentence = mongoose.model("Sentence", sentenceSchema);



// block that connects to db
// inserts words, inserts sentences, creates word-sentence relationships
// has to be async block, since we need to await pretty much all actions
(async () => {
  try {
    await connectToDb();

    // Clear existing data
    await Word.deleteMany({});
    await Sentence.deleteMany({});
    console.log("Cleared existing data in Word and Sentence collections.");

    //simplified seeding
    //await Word.insertMany(words_data);
    //await Sentence.insertMany(sentences_data);

    // improved seeding with error handling
    await Word.insertMany(words_data)
      .then(() => console.log("Data insertion successful"))
      .catch((err) => {
        console.error("Error during insertion: ", err);
        mongoose.connection.close();
        console.log("error caught, closed db connection");
      });

    await Sentence.insertMany(sentences_data)
      .then(() => console.log("Data insertion successful"))
      .catch((err) => {
        console.error("Error during insertion: ", err);
        mongoose.connection.close();
        console.log("error caught, closed db connection");
      });



    // need to await so db connection can be dropped after this completes
    // this can be done in finally block, 
    // but that one waits on the async completion of our functions

    // we need to provide it list of all words we need to create relationships for
    // this can be eventually in different script 
    const uniqueVocab = await Word.distinct("vocabulary_japanese");
    const uniqueVocabSet = new Set(uniqueVocab);
    console.log("uniqueVocabSet");
    console.log(uniqueVocabSet);

    const uniqueVocabList = [...uniqueVocabSet];
    console.log("uniqueVocabList");
    console.log(uniqueVocabList);

    await addSentencesRelationships(uniqueVocabList);
    //await addSentencesRelationships(["入場券","切る","楽しい"]);  // using list of unique words explicitely

    //mongoose.connection.close();
    //console.log("closed db connection");
  } catch (err) {
    console.log(err);
    // mongoose.connection.close();      // do not close connection to db on error, we have mess in some relationships, we will skip them for now
    console.log("error caught, closed db connection");
  }
  finally {
    // finally block should wait on all async processes in try block
    //const uniqueVocab = await Word.distinct("vocabulary_japanese");
    //const uniqueVocabSet = new Set(uniqueVocab);
    //console.log("uniqueVocabSet");
    //console.log(uniqueVocabSet);

    mongoose.connection.close();
    console.log("finally block - closing db conn");
    console.log("finally block - executed");
  }
})();
