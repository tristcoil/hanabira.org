// tanos vocabulary db seding
// for now seeds just vocabulary, sentences might be added in future iterations

// db is created if it does not exist
// Script seeds database with words
// seeding is done simply with insertMany calls

// middleware scripts that provide data from actual json files
const words_data = require("./wordsTanos");

const mongoose = require("mongoose");
const { Schema } = mongoose;

// ----------------- DB schema definitions ------------------------

// parent object
const wordSchema = new Schema({
  vocabulary_japanese: { type: String, unique: false, required: true }, // we have repeating words, they differ by p_tag in api searches
  vocabulary_simplified: String,
  vocabulary_english: { type: String, unique: false, required: false },  // TODO: huh, some are missing, you need to review source data
  vocabulary_audio: String,
  word_type:{ type: String, unique: false, required: false },
  p_tag: String, // parent tag 'JLPT_N3'
  s_tag: String, // sub tag '100'
  //sentences: [{ type: Schema.Types.ObjectId, ref: "Sentence" }],
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

// ----------------- end of function definitions ------------------

// ----------------- model compilation ------------------------
const Word = mongoose.model("tanosWord", wordSchema);

// block that connects to db
// inserts words, inserts sentences, creates word-sentence relationships
// has to be async block, since we need to await pretty much all actions
(async () => {
  try {
    await connectToDb();

    // improved seeding with error handling
    await Word.insertMany(words_data)
      .then(() => console.log("Data insertion successful"))
      .catch((err) => {
        console.error("Error during insertion: ", err);
        mongoose.connection.close();
        console.log("error caught, closed db connection");
      });
  } catch (err) {
    console.log(err);
    // mongoose.connection.close();      // do not close connection to db on error, we have mess in some relationships, we will skip them for now
    console.log("error caught, closed db connection");
  } finally {
    mongoose.connection.close();
    console.log("finally block - closing db conn");
  }
})();
