// db is created if it does not exist
// Script seeds database with words and sentences
// seeding is done simply with insertMany calls
// once database is seeded we are adding database relationships
// between words and sentences

// middleware scripts that provide data from actual json files
// const words_data = require('./words');
// const sentences_data = require('./sentences');
const grammar_data = require('./grammar_ja');

const mongoose = require("mongoose");
const { Schema } = mongoose;



// ----------------- DB schema definitions ------------------------

const grammarExampleSchema = new Schema({
  jp: { type: String, required: true },
  romaji: { type: String, required: true },
  en: { type: String, required: true },
  grammar_audio: String,
});

const grammarSchema = new Schema({
  //title: { type: String, unique: true, required: true },   // keeps breaking seeding
  title: { type: String, unique: false, required: true },
  short_explanation: { type: String, required: true },
  long_explanation: { type: String, required: true },
  formation: { type: String, required: true },
  examples: [grammarExampleSchema],
  p_tag: String, // parent tag 'JLPT_N3'
  s_tag: String, // sub tag '100'
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
// const Word = mongoose.model("Word", wordSchema);
// const Sentence = mongoose.model("Sentence", sentenceSchema);
const Grammar = mongoose.model("Grammar", grammarSchema);


console.log('--------- Seeding grammar to DB -------------');

// block that connects to db
// inserts words, inserts sentences, creates word-sentence relationships
// has to be async block, since we need to await pretty much all actions
(async () => {
  try {
    await connectToDb();


    // Check if the Grammar collection exists
    const collectionExists = await Grammar.exists();
    
    if (collectionExists) {
      // Drop the Grammar collection
      await Grammar.collection.drop();
      console.log('Dropped Grammar collection.');
    } else {
      console.log('Grammar collection does not exist.');
    }

    // Insert data
    await Grammar.insertMany(grammar_data)
      .then(() => console.log("Data insertion successful"))
      .catch((err) => {
        console.error("Error during insertion: ", err);
        mongoose.connection.close();
        console.log("error caught, closed db connection");
      });
    
    console.log('example of seeded data:');
    console.log(grammar_data[0]);


    // need to await so db connection can be dropped after this completes
    // this can be done in finally block, 
    // but that one waits on the async completion of our functions

    //mongoose.connection.close();
    //console.log("closed db connection");
  } catch (err) {
    console.log(err);
    await mongoose.connection.close();             // rather continue, some of the seeding might fail
    console.log("error caught, closed db connection");
  }
  finally {
    // finally block should wait on all async processes in try block
    //const uniqueVocab = await Word.distinct("vocabulary_japanese");
    //const uniqueVocabSet = new Set(uniqueVocab);
    //console.log("uniqueVocabSet");
    //console.log(uniqueVocabSet);

    await mongoose.connection.close();
    console.log("finally block - closing db conn");
    console.log("finally block - executed");
  }
})();




// found this error on the container

// root@eb005f85a5ea:/app# node seed_grammar_to_db.js 
// --------- Seeding grammar to DB -------------
// Mongo Connection Open.
// Error during insertion:  MongoBulkWriteError: E11000 duplicate key error collection: zenRelationshipsAutomated.grammars index: title_1 dup key: { title: "A うが B うが (A uga B uga)" }
//     at OrderedBulkOperation.handleWriteError (/app/node_modules/mongodb/lib/bulk/common.js:922:22)
//     at resultHandler (/app/node_modules/mongodb/lib/bulk/common.js:401:27)
//     at /app/node_modules/mongodb/lib/utils.js:348:28
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
//   code: 11000,
//   writeErrors: [ WriteError { err: [Object] } ],
//   result: BulkWriteResult {
//     result: {
//       ok: 1,
//       writeErrors: [Array],
//       writeConcernErrors: [],
//       insertedIds: [Array],
//       nInserted: 0,
//       nUpserted: 0,
//       nMatched: 0,
//       nModified: 0,
//       nRemoved: 0,
//       upserted: []
//     }
//   },
//   insertedDocs: [],
//   [Symbol(errorLabels)]: Set(0) {}
// }
// error caught, closed db connection
// example of seeded data:
// {
//   title: 'A うが B うが (A uga B uga)',
//   short_explanation: "Expresses the idea of 'no matter how...or', 'even if...or'.",
//   long_explanation: "The ～うが ～うが grammar point is used to express repeated actions or states with no change in result. It suggests that regardless of the conditions stated in A and B, the result remains the same. It can be translated as 'no matter how...or', 'even if...or' in English.",
//   formation: 'Verb-volitional form + うが + Verb-volition form + うが',
//   examples: [
//     {
//       jp: '朝早く起きるうが、夜遅く起きるうが、いつもバスが遅れる。',
//       romaji: 'Asa hayaku okiru u ga, yoru osoku okiru u ga, itsumo basu ga okureru.',
//       en: 'No matter whether I wake up early in the morning or late at night, the bus is always late.',
//       grammar_audio: '/audio/grammar/s_AうがBうがAugaBuga_20230827_朝早く起きるうが夜遅く起きるうがいつもバスが遅れる.mp3'
//     },
//     {
//       jp: '彼に話すうが、話さないうが、結果は変わらない。',
//       romaji: 'Kare ni hanasu u ga, hanasanai u ga, kekka wa kawaranai.',
//       en: "Even if I speak to him or don't, the result won't change.",
//       grammar_audio: '/audio/grammar/s_AうがBうがAugaBuga_20230827_彼に話すうが話さないうが結果は変わらない.mp3'
//     },
//     {
//       jp: 'この仕事をするうが、しないうが、給料は同じだ。',
//       romaji: 'Kono shigoto o suru u ga, shinai u ga, kyuuryou wa onaji da.',
//       en: 'Whether I do this job or not, the salary is the same.',
//       grammar_audio: '/audio/grammar/s_AうがBうがAugaBuga_20230827_この仕事をするうがしないうが給料は同じだ.mp3'
//     },
//     {
//       jp: 'あの人に話すうが、話さないうが、理解してくれるとは思えない。',
//       romaji: 'Ano hito ni hanasu u ga, hanasanai u ga, rikai shite kureru to wa omoenai.',
//       en: "I don't think that person would understand whether I talk to them or not.",
//       grammar_audio: '/audio/grammar/s_AうがBうがAugaBuga_20230827_あの人に話すうが話さないうが理解してくれるとは思えない.mp3'
//     }
//   ],
//   p_tag: 'JLPT_N1',
//   s_tag: '25'
// }
// finally block - closing db conn
// finally block - executed
// root@eb005f85a5ea:/app# 


// WebGLUniformLocation, at this point the namespace was not existing
// finally block - closing db conn
// zen-lingo-express_db-1       | finally block - executed
// zen-lingo-express_db-1       | --------- Seeding grammar to DB -------------
// zen-lingo-express_db-1       | Mongo Connection Open.
// zen-lingo-express_db-1       | MongoServerError: ns not found
// zen-lingo-express_db-1       |     at Connection.onMessage (/app/node_modules/mongodb/lib/cmap/connection.js:207:30)
// zen-lingo-express_db-1       |     at MessageStream.<anonymous> (/app/node_modules/mongodb/lib/cmap/connection.js:60:60)
// zen-lingo-express_db-1       |     at MessageStream.emit (node:events:513:28)
// zen-lingo-express_db-1       |     at processIncomingData (/app/node_modules/mongodb/lib/cmap/message_stream.js:132:20)
// zen-lingo-express_db-1       |     at MessageStream._write (/app/node_modules/mongodb/lib/cmap/message_stream.js:33:9)
// zen-lingo-express_db-1       |     at writeOrBuffer (node:internal/streams/writable:392:12)
// zen-lingo-express_db-1       |     at _write (node:internal/streams/writable:333:10)
// zen-lingo-express_db-1       |     at Writable.write (node:internal/streams/writable:337:10)
// zen-lingo-express_db-1       |     at Socket.ondata (node:internal/streams/readable:766:22)
// zen-lingo-express_db-1       |     at Socket.emit (node:events:513:28) {
// zen-lingo-express_db-1       |   ok: 0,
// zen-lingo-express_db-1       |   code: 26,
// zen-lingo-express_db-1       |   codeName: 'NamespaceNotFound',
// zen-lingo-express_db-1       |   [Symbol(errorLabels)]: Set(0) {}
// zen-lingo-express_db-1       | }
// zen-lingo-express_db-1       | error caught, closed db connection
// zen-lingo-express_db-1       | finally block - closing db conn
// zen-lingo-express_db-1       | finally block - executed
// zen-lingo-backend_fastapi-1  | INFO:     127.0.0.1:44968 - "GET / HTTP/1.1" 404 Not Found
// zen-lingo-express_db-1       | Example app listening on port 8000
// zen-lingo-express_db-1       | Mongo Connection Open.


