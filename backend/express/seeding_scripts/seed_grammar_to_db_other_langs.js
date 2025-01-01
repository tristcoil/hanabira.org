const mongoose = require("mongoose");
const { Schema } = mongoose;

// Import Vietnamese grammar data
const grammar_vn_data = require("./grammar_vn");
const grammar_cn_data = require("./grammar_cn");
const grammar_th_data = require("./grammar_th");
const grammar_kr_data = require("./grammar_kr");

// ----------------- Language Specific Schema Definitions ------------------

// Define a dictionary for language-specific schemas
const languageSchemas = {
  vn: {
    grammarSchema: new Schema({
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
    }),
  },
  kr: { // Assuming 'kr' is the language code for Korean
    grammarSchema: new Schema({
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
    }),
  },
  th: { // Assuming 'kr' is the language code for Korean
    grammarSchema: new Schema({
      title: { type: String, required: true },
      short_explanation: { type: String, required: true },
      long_explanation: { type: String, required: true },
      formation: { type: String, required: true },
      examples: [
        {
          th: { type: String, required: true }, // Korean text
          romaji: { type: String, required: true }, // Korean text
          en: { type: String, required: true }, // English translation
          grammar_audio: String, // Optional audio field
        },
      ],
      p_tag: String, // Parent tag
      s_tag: String, // Sub tag
    }),
  },
  cn: { // Assuming 'kr' is the language code for Korean
    grammarSchema: new Schema({
      title: { type: String, required: true },
      short_explanation: { type: String, required: true },
      long_explanation: { type: String, required: true },
      formation: { type: String, required: true },
      examples: [
        {
          cn: { type: String, required: true }, // Korean text
          pinyin: { type: String, required: true }, // Korean text
          en: { type: String, required: true }, // English translation
          grammar_audio: String, // Optional audio field
        },
      ],
      p_tag: String, // Parent tag
      s_tag: String, // Sub tag
    }),
  },
  // Add other languages' schemas here
};

// ----------------- Database Connection ------------------

const connectToDb = async () => {
  const dbHost = "localhost";
  const dbPort = 27017;
  //const dbName = "universalGrammarDb";
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

// ----------------- Seeding Function ------------------

// Assuming languageSchemas and connectToDb function are defined above...
const seedDatabase = async (languageCode, grammarData) => {
  const Grammar = mongoose.model(
    `${languageCode}Grammar`,
    languageSchemas[languageCode].grammarSchema
  );

  try {
    await connectToDb();

    // Check if collection exists and clear it
    const collectionName = `${languageCode.toLowerCase()}grammars`;
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collection = collections.find((c) => c.name === collectionName);

    if (collection) {
      await mongoose.connection.db.dropCollection(collectionName);
      console.log(`Dropped existing collection: ${collectionName}`);
    }

    // Check each grammar data item for the required 'formation' field before inserting
    grammarData.forEach((item, index) => {
      if (!item.formation) {
        console.error(
          `Error: Missing 'formation' field in document at index ${index}`
        );
        // You can log the entire item or part of it to identify it
        console.log(
          `Document with issue: `,
          item.title || "No title available"
        );
      }
    });

    // Insert the data, assuming all documents are valid
    await Grammar.insertMany(grammarData);
    console.log(
      `Seeded ${languageCode.toUpperCase()} grammar data successfully!`
    );
  } catch (err) {
    console.error(`Error in seeding ${languageCode.toUpperCase()} data: `, err);
  } finally {
    // Closing the Database Connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// ----------------- Seeding Logic ------------------

// Example usage for Vietnamese and other languages
// Replace these with actual calls to your data sources
const languagesToSeed = [
  //{ code: "vn", data: grammar_vn_data },
  //{ code: "cn", data: grammar_cn_data },
  //{ code: "th", data: grammar_th_data },
  { code: "kr", data: grammar_kr_data },
  // Add other languages here when available
];


// asynchronous - causing racing conditions
//languagesToSeed.forEach((lang) => seedDatabase(lang.code, lang.data));


// should await seeding of previous language
const seedAllLanguages = async () => {
  for (const lang of languagesToSeed) {
    await seedDatabase(lang.code, lang.data);
  }
};

seedAllLanguages();

