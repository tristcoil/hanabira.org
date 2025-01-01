const express = require("express");
const bodyParser = require("body-parser");

const { connectDB } = require("./config/db");
const { wordRoutes } = require("./routes/wordRoutes");

//const { getAllWords } = require('./controllers/wordsController');

// import models, so we can form relationships in db searches
const { Word } = require("./models/word");
const { TanosWord } = require("./models/wordTanos");
const { Sentence } = require("./models/sentence");
const { Kanji } = require("./models/kanji");
const { Reading } = require("./models/reading");

const { Grammar } = require("./models/grammar"); // japanese
const { VnGrammar } = require("./models/grammar_vn"); // vietnamese
const { CnGrammar } = require("./models/grammar_cn"); // mandarin
const { ThGrammar } = require("./models/grammar_th"); // vietnamese
const { KrGrammar } = require("./models/grammar_kr"); // vietnamese

const path = require("path");
const cors = require("cors");

// --- Map p_tag values to respective models ---
const modelMapping = {
  JLPT_: Grammar,
  VIET: VnGrammar,
  HSK_: CnGrammar,
  TOPIK_: KrGrammar,
  "CU-TFL_": ThGrammar,
  // Add other mappings for different language models
};

// -----------  General prep and vars  ------------------ //
const router = express.Router();
const port = 8000; // port our backend is running on
const originPort = 3000; // port the frontend app is running on
const app = express();
app.use(bodyParser.json());

let corsOptions = {
  origin: ["http://localhost:" + originPort],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

// connect to DB before we expose our API Express endpoints
connectDB();

// ---------------- Function Definitions ------------------ //
const getAllWords = async (req, res) => {
  try {
    // parameters from request
    const pTag = req.query.p_tag;
    const sTag = req.query.s_tag;
    console.log("p_tag: " + pTag);
    console.log("s_tag: " + sTag);

    let words;

    if (pTag && sTag) {
      // Find subset of words based on both p_tag and s_tag
      words = await Word.find({ p_tag: pTag, s_tag: sTag }).populate("sentences");
    } else if (pTag && !sTag) {
      // Find subset of words based on only p_tag when s_tag is not provided
      words = await Word.find({ p_tag: pTag }).populate("sentences");
    } else {
      // Find all words when no parameters provided
      words = await Word.find({}).populate("sentences");
    }

    // if (pTag && sTag) {
    //   // find subset of words based on parameters
    //   words = await Word.find({ p_tag: pTag, s_tag: sTag }).populate(
    //     "sentences"
    //   );
    // } else {
    //   // find all words when no parameters provided
    //   words = await Word.find({}).populate("sentences");
    // }

    console.log("words payload: " + words);

    res.status(200).json({
      words,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  } finally {
    // any cleanup actions
  }
};

const getAllTanosWords = async (req, res) => {
  try {
    // parameters from request
    const pTag = req.query.p_tag;
    const sTag = req.query.s_tag;
    console.log("p_tag: " + pTag);
    console.log("s_tag: " + sTag);

    let words;
    if (pTag && sTag) {
      // find subset of words based on parameters
      // words = await TanosWord.find({ p_tag: pTag, s_tag: sTag }).populate(
      //   "sentences"
      // );

      words = await TanosWord.find({ p_tag: pTag, s_tag: sTag });
    } else {
      // find all words when no parameters provided
      // words = await TanosWord.find({}).populate("sentences"); // we do not have sentences yet
      words = await TanosWord.find({});
    }

    console.log("words payload: " + words);

    res.status(200).json({
      words,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  } finally {
    // any cleanup actions
  }
};

const getAllGrammars = async (req, res) => {
  try {
    const pTag = req.query.p_tag;
    const sTag = req.query.s_tag;

    console.log("p_tag: " + pTag);
    console.log("s_tag: " + sTag);

    // Choose the model based on pTag
    let GrammarModel = null;
    for (const [key, model] of Object.entries(modelMapping)) {
      if (pTag && pTag.includes(key)) {
        GrammarModel = model;
        break;
      }
    }

    // Fallback or error if no appropriate model found
    if (!GrammarModel) {
      return res.status(400).json({
        error: "Invalid p_tag or no model available for provided p_tag",
      });
    }

    let grammars;
    if (pTag && sTag) {
      grammars = await GrammarModel.find({ p_tag: pTag, s_tag: sTag });
    } else if (pTag && !sTag) {
      grammars = await GrammarModel.find({ p_tag: pTag });
    } else {
      grammars = await GrammarModel.find({});
    }

    console.log("grammars payload: " + grammars);

    res.status(200).json({ grammars });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  } finally {
    // Any cleanup actions
  }
};

// --------------------- API ENDPOINTS --------------------- //
app.get("/e-api/v1/words", (req, res) => {
  //res.send('Hello World!')
  // call like to get subset of words, call without params to get all words
  //curl -X GET http://localhost:8000/e-api/v1/words
  //curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=JLPT_N3&s_tag=100'    //must use quotes
  //curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=essential_600_verbs&s_tag=verbs-1'         //must use quotes
  //curl -X GET 'http://localhost:8000/e-api/v1/words?p_tag=suru_essential_600_verbs&s_tag=verbs-1'    //must use quotes

  console.log("received GET request");
  getAllWords(req, res);
});

app.get("/e-api/v1/tanos_words", (req, res) => {
  //res.send('Hello World!')
  // call like to get subset of words, call without params to get all words
  //curl -X GET http://localhost:8000/e-api/v1/tanos_words
  //curl -X GET 'http://localhost:8000/e-api/v1/tanos_words?p_tag=JLPT_N3&s_tag=100'    //must use quotes

  console.log("received GET request");
  getAllTanosWords(req, res);
});

app.get("/e-api/v1/grammars", (req, res) => {
  //res.send('Hello World!')
  // call like to get subset of words, call without params to get all words
  //curl -X GET 'http://localhost:8000/e-api/v1/grammars?p_tag=JLPT_N3&s_tag=10'    //must use quotes
  //curl -X GET 'http://localhost:8000/e-api/v1/grammars?p_tag=JLPT_N3'    //must use quotes

  console.log("received GET request");
  getAllGrammars(req, res);
});

app.get("/e-api/v1/grammar-titles", async (req, res) => {
  // gives list of all grammar titles for a given JLPT level
  // curl -X GET 'http://localhost:8000/e-api/v1/grammar-titles?p_tag=JLPT_N3&type=encoded'

  // for URL encoding of grammar titles with spaces
  // curl -X GET 'http://localhost:8000/e-api/v1/grammar-titles?p_tag=JLPT_N3&type=encoded'

  try {
    const pTag = req.query.p_tag;
    const type = req.query.type;

    if (!pTag) {
      return res.status(400).json({ error: "p_tag parameter is required." });
    }

    // Choose the model based on pTag
    let GrammarModel = null;
    for (const [key, model] of Object.entries(modelMapping)) {
      if (pTag.includes(key)) {
        GrammarModel = model;
        break;
      }
    }

    // Fallback or error if no appropriate model found
    if (!GrammarModel) {
      return res.status(400).json({
        error: "Invalid p_tag or no model available for provided p_tag",
      });
    }

    // Fetch grammar titles using the selected model
    const grammars = await GrammarModel.find({ p_tag: pTag }, "title");

    // Process titles based on type
    let titles;
    if (type === "encoded") {
      titles = grammars.map((grammar) => encodeURIComponent(grammar.title));
    } else {
      titles = grammars.map((grammar) => grammar.title);
    }

    res.status(200).json({ titles });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching grammar titles." });
  }
});

// Define the new endpoint to fetch grammar details based on the title
app.post("/e-api/v1/grammar-details", async (req, res) => {
  //gives only one grammar payload for given grammar title key
  // intended to populate one grammar page with only one grammar point
  //curl -X POST -H "Content-Type: application/json" -d '{"title": "決して～ない (kesshite ~ nai)"}' http://localhost:8000/e-api/v1/grammar-details

  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title parameter is required." });
    }

    const grammar = await Grammar.findOne({ title });

    if (!grammar) {
      return res.status(404).json({ error: "Grammar not found." });
    }

    res.status(200).json({ grammar });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching grammar details." });
  }
});

app.post("/e-api/v1/vietnamese/grammar-details", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title parameter is required." });
    }

    const grammar = await VnGrammar.findOne({ title });

    if (!grammar) {
      return res.status(404).json({ error: "Grammar not found." });
    }

    res.status(200).json({ grammar });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching grammar details." });
  }
});

app.post("/e-api/v1/korean/grammar-details", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title parameter is required." });
    }


    // issues with slashes ruining my day here, google cannot index 350 addresses with /
    // if in database we have slash, we need to have incoming POST payload with slash as well
    const grammar = await KrGrammar.findOne({ title });

    if (!grammar) {
      return res.status(404).json({ error: "Grammar not found." });
    }

    res.status(200).json({ grammar });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching grammar details." });
  }
});

app.post("/e-api/v1/thai/grammar-details", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title parameter is required." });
    }

    const grammar = await ThGrammar.findOne({ title });

    if (!grammar) {
      return res.status(404).json({ error: "Grammar not found." });
    }

    res.status(200).json({ grammar });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching grammar details." });
  }
});

app.post("/e-api/v1/mandarin/grammar-details", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title parameter is required." });
    }

    const grammar = await CnGrammar.findOne({ title });

    if (!grammar) {
      return res.status(404).json({ error: "Grammar not found." });
    }

    res.status(200).json({ grammar });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching grammar details." });
  }
});

// ------------ kanji ---------------

// GET endpoint to retrieve Kanji based on p_tag and optionally s_tag
// curl "http://localhost:8000/e-api/v1/kanji?p_tag=JLPT_N3&s_tag=part_1"
// curl "http://localhost:8000/e-api/v1/kanji?p_tag=JLPT_N3" - for only p_tag
app.get("/e-api/v1/kanji", async (req, res) => {
  try {
    const { p_tag, s_tag } = req.query; // extracting p_tag and s_tag from the query parameters

    // Check if p_tag is provided
    if (!p_tag) {
      return res.status(400).json({ error: "p_tag is required" });
    }

    // Build the query object based on provided parameters
    let query = { p_tag };
    if (s_tag) query.s_tag = s_tag;

    // Find kanji data based on the query
    const kanjiData = await Kanji.find(query);

    if (kanjiData.length === 0) {
      return res
        .status(404)
        .json({ error: "Kanji data not found for the given parameters" });
    }

    res.status(200).json(kanjiData);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve Kanji data" });
  }
});

// ------------ reading ---------------

// GET endpoint to retrieve a reading by its 'id' using a query parameter
// curl -i -X GET 'http://localhost:8000/api/reading?key=reading_1'
app.get("/e-api/v1/reading", async (req, res) => {
  try {
    const { key } = req.query; // Extract the key from the query parameters
    console.log(key);

    const reading = await Reading.findOne({ key: key }); // Use findOne to search by the key

    console.log(reading);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    res.status(200).json(reading);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reading" });
  }
});

// ------------ Tanos N5-N1 vocabulary ---------------

// -------------------------------------------------------- //
// start the Express server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// --------------------- OLD CODE ---------------------------
