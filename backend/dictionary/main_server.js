// JS server backend logic for text parser - manages:

// mecab tokenization
// jitendex dictionary translation - jitendex temporarily replaced with jmdict endpoints, logic in server_jitendex.js
// jmdict
// kanjidic kanji lookups
// DEEPL API calls

// needs config.json file with API key

// future feature proposals:
// GPT API integration for grammar explanation


// --- imports: --- //

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
const path = require("path");
const crypto = require("crypto"); // For creating cache keys

const mongoose = require("mongoose");

const MeCab = require("mecab-async");
const mecab = new MeCab();
const deepl = require("deepl-node");

//these versions are a MutationObserver, otherwise kuroshiro will break
//"kuroshiro": "^1.1.2",
//"kuroshiro-analyzer-kuromoji": "^1.1.0",
const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const kuroshiro = new Kuroshiro();

const app = express();
app.use(cors()); // Use cors middleware to enable CORS
app.use(express.json()); // for parsing application/json
app.use(bodyParser.json()); // not sure if this will create conflict w express.json

// Set the port and start the server
const PORT = process.env.PORT || 5200;

// --- prep steps --- //

// Load config file
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));


// Set up DeepL translator
const translator = new deepl.Translator(config.DEEPL_API_KEY);





// ---

// Initialize Kuroshiro with Kuromoji Analyzer
(async () => {
  await kuroshiro.init(new KuromojiAnalyzer());
})();

// --- //

// Load the kanji data, json has around 50 MB
let kanjiData = [];
fs.readFile("kanjidic/kanjidic2.json", "utf8", (err, data) => {
  if (err) {
    console.error("Failed to read kanji data file:", err);
    return;
  }
  kanjiData = JSON.parse(data).kanjidic2.character;
});

// --- //

// Connect to MongoDB
//mongoose.connect("mongodb://localhost:27017/jmdictDatabase", {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//});

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/jmdictDatabase");

// Define the schema and model
const entrySchema = new mongoose.Schema(
  {
    expression: String,
    reading: String,
    type: String,
    meanings: [String],
  },
  { collection: "entries" }
);

const Entry = mongoose.model("Entry", entrySchema);

// ------------------------------------------------------------------------------------- //
// ------------------------------------ MECAB logic ------------------------------------ //
// ------------------------------------------------------------------------------------- //

// -----------------------   Functions   ------------------------- //

// Function to parse text into sentences and parse each sentence individually
// returns data like
//     [
//         [
//             {"original":"彼女","dictionary":"彼女","furigana":"かのじょ"},
//             {"original":"は","dictionary":"は","furigana":""},
//             {"original":"まったく","dictionary":"まったく","furigana":""},
//             {"original":"遅れて","dictionary":"遅れる","furigana":"おくれて"},
//             {"original":"い","dictionary":"いる","furigana":""},
//             {"original":"ない","dictionary":"ない","furigana":""},
//             {"original":"。","dictionary":"。","furigana":""}
//         ],
//         [
//             {"original":"今日","dictionary":"今日","furigana":"きょう"},
//             {"original":"は","dictionary":"は","furigana":""},
//             {"original":"学校","dictionary":"学校","furigana":"がっこう"},
//             {"original":"に","dictionary":"に","furigana":""},
//             {"original":"行き","dictionary":"行く","furigana":"いき"},
//             {"original":"ます","dictionary":"ます","furigana":""},
//             {"original":"。","dictionary":"。","furigana":""}
//         ]
//     ]
// EOS explanation https://taku910.github.io/mecab/format.html
//{
//    "original": "EOS"
//  },
// we simply remove end of sentences from resulting mecab payload

// LYRICS MODE - line by line as in input
const parseTextLyrics = (text, mode) => {
  const MAX_LENGTH = 5000;

  if (text.length > MAX_LENGTH) {
    throw new Error("Input text exceeds maximum length");
  }

  // Split text into lines and trim trailing spaces from each line
  const trimmedText = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  const sentences = trimmedText.split(/([。．！？\n])/).filter(Boolean); // Split by periods, exclamation marks, and question marks
  const results = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i] + (sentences[i + 1] || ""); // Combine the sentence with its punctuation
    const parsedSentence = mecab.parseSync(sentence);
    const parsedResult = parsedSentence
      .map((entry) => ({
        original: entry[0],
        dictionary: entry[5],
        furigana: entry[0] === entry[6] ? "" : entry[6], // If furigana is the same as original, set it to an empty string
      }))
      .filter((entry) => entry.original !== "EOS"); // Filter out objects with "original" equal to "EOS", these are end of lines
    results.push(parsedResult);
  }

  return results;
};

// BOOK/PODCAST MODE - Long sentences on one line.
const parseTextBook = (text, mode) => {
  const MAX_LENGTH = 5000;

  if (text.length > MAX_LENGTH) {
    throw new Error("Input text exceeds maximum length");
  }

  // Step 1: Remove trailing spaces from each line
  const trimmedLines = text.split("\n").map((line) => line.trim());

  // Step 2: Combine lines back into a single string
  const combinedText = trimmedLines.join(" ");

  // Step 3: Split the combined string into sentences
  const sentences = combinedText.split(/([。．！？])/).filter(Boolean);

  const results = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i] + (sentences[i + 1] || ""); // Combine the sentence with its punctuation
    const parsedSentence = mecab.parseSync(sentence);
    const parsedResult = parsedSentence
      .map((entry) => ({
        original: entry[0],
        dictionary: entry[5],
        furigana: entry[0] === entry[6] ? "" : entry[6], // If furigana is the same as original, set it to an empty string
      }))
      .filter((entry) => entry.original !== "EOS"); // Filter out objects with "original" equal to "EOS", these are end of lines
    results.push(parsedResult);
  }

  return results;
};

// ----------------------- API Endpoints ------------------------- //

// curl -X POST http://localhost:5300/d-api/v1/parse -H "Content-Type: application/json" -d '{"text": "今日は学校に行きます"}'
app.post("/d-api/v1/parse", (req, res) => {
  const text = req.body.text;
  mecab.parse(text, (err, result) => {
    if (err) {
      console.error("MeCab Error:", err);
      res.status(500).send("Error parsing Japanese text: " + err.message);
      return;
    }
    const words = result.map((entry) => entry[7]); // Assuming basic form is what you need
    res.json(words);
  });
});

// curl -X POST http://localhost:5300/d-api/v1/parse-json -H "Content-Type: application/json" -d '{"text": "今日は学校に行きます"}'
// Endpoint for asynchronous parse result as JSON payload
app.post("/d-api/v1/parse-json", (req, res) => {
  const text = req.body.text;
  mecab.parse(text, (err, result) => {
    if (err) {
      console.error("MeCab Error:", err);
      res.status(500).send("Error parsing Japanese text: " + err.message);
      return;
    }
    res.json(result);
  });
});

// Endpoint for simplified parse result
app.post("/d-api/v1/parse-simple", (req, res) => {
  const text = req.body.text;
  mecab.parse(text, (err, result) => {
    if (err) {
      console.error("MeCab Error:", err);
      res.status(500).send("Error parsing Japanese text: " + err.message);
      return;
    }
    const simplifiedResult = result.map((entry) => ({
      original: entry[0],
      dictionary: entry[5],
      furigana: entry[6],
    }));
    res.json(simplifiedResult);
  });
});

// Endpoint for simplified parse result with sentence separation
//  curl -X POST http://localhost:5300/d-api/v1/parse-split -H "Content-Type: application/json" -d '{"text": "彼女はまったく遅れていない。今日は学校に行きます。", "mode": "book"}'
//     [
//         [
//             {"original":"彼女","dictionary":"彼女","furigana":"かのじょ"},
//             {"original":"は","dictionary":"は","furigana":""},
//             {"original":"まったく","dictionary":"まったく","furigana":""},
//             {"original":"遅れて","dictionary":"遅れる","furigana":"おくれて"},
//             {"original":"い","dictionary":"いる","furigana":""},
//             {"original":"ない","dictionary":"ない","furigana":""},
//             {"original":"。","dictionary":"。","furigana":""}
//         ],
//         [
//             {"original":"今日","dictionary":"今日","furigana":"きょう"},
//             {"original":"は","dictionary":"は","furigana":""},
//             {"original":"学校","dictionary":"学校","furigana":"がっこう"},
//             {"original":"に","dictionary":"に","furigana":""},
//             {"original":"行き","dictionary":"行く","furigana":"いき"},
//             {"original":"ます","dictionary":"ます","furigana":""},
//             {"original":"。","dictionary":"。","furigana":""}
//         ]
//     ]
// app.post("/d-api/v1/parse-split", (req, res) => {
//   const text = req.body.text;
//   const mode = req.body.mode;
//   console.log(`Incoming text: ${text}`);
//   console.log(`Incoming mode: ${mode}`);
//   const results = parseTextLyrics(text, mode);
//   const results = parseTextBook(text, mode);
//   res.json(results);
// });

app.post("/d-api/v1/parse-split", (req, res) => {
  const text = req.body.text;
  const mode = req.body.mode;
  console.log(`Incoming text: ${text}`);
  console.log(`Incoming mode: ${mode}`);

  let results;
  if (mode === "lyrics") {
    results = parseTextLyrics(text);
  } else if (mode === "book") {
    results = parseTextBook(text);
  } else {
    return res
      .status(400)
      .json({ error: "Invalid mode. Choose either 'lyrics' or 'book'." });
  }

  res.json(results);
});

// ------------------------------------------------------------------------------------- //
// ---------------------------- DEEPL TRANSLATION API ---------------------------------- //
// ------------------------------------------------------------------------------------- //

// POST endpoint for translation
// curl -X POST   http://localhost:5300/d-api/v1/deepl-translate   -H 'Content-Type: application/json'   -d '{"japaneseText":"こんにちは、世界！"}'
// {"translatedText":"Hello world!"}
// app.post('/deepl-translate', async (req, res) => {
//     const { japaneseText } = req.body;
//     console.log()
//
//     try {
//         res.json({ translatedText: "Donde esta la biblioteka? xxx" });
//
//     } catch (error) {
//         console.error("Translation error:", error);
//         res.status(500).json({ error: "Translation failed" });
//     }
// });
app.post("/d-api/v1/deepl-translate", async (req, res) => {
  const { japaneseText } = req.body;
  console.log("incoming payload:", japaneseText);
  const MAX_LENGTH = 10000;

  if (!japaneseText) {
    return res.status(400).json({ error: "No text provided" });
  }

  if (japaneseText.length > MAX_LENGTH) {
    return res.status(400).json({
      error: "Text exceeds the maximum allowed length of 10,000 characters",
    });
  }

  try {
    // Translate Japanese text to English
    const result = await translator.translateText(japaneseText, "ja", "en-US");
    res.json({ translatedText: result.text });

    // Simulated translation response
    //res.json({ translatedText: "Donde esta la biblioteca?" });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

// ------------------------------------------------------------------------------------- //
// ---------------------------------- KUROSHIRO LOGIC ---------------------------------- //
// ------------------------------------------------------------------------------------- //

// ------------- API call examples ------------------- //
// 1. Convert to Hiragana:
// curl -X POST http://localhost:5500/d-api/v1/convert/hiragana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 2. Convert to Katakana:
// curl -X POST http://localhost:5500/d-api/v1/convert/katakana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 3. Convert to Romaji:
// curl -X POST http://localhost:5500/d-api/v1/convert/romaji -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 4. Convert to Hiragana with Okurigana Mode:
// curl -X POST http://localhost:5500/d-api/v1/convert/okurigana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 5. Convert to Hiragana with Furigana Mode:
// curl -X POST http://localhost:5500/d-api/v1/convert/furigana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 6. Universal endpoint, returns all options in payload
// curl -X POST http://localhost:5500/d-api/v1/convert/all -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア 最高！\"}"
// {
//     "original":"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！",
//     "hiragana":"かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！",
//     "katakana":"カンジトレタラテヲツナゴウ、カサナルノハジンセイノライン and レミリアサイコウ！",
//    "romaji":"kanjitoretarateotsunagō,kasanarunowajinseinorain and remiriasaikō!",
//    "okurigana":"感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！",
//    "furigana":"<ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！"
// }

// ------------------------------- API Endpoints ---------------------------- //

// Endpoint for converting to Hiragana
app.post("/d-api/v1/convert/hiragana", async (req, res) => {
  const { text } = req.body;
  console.log(text);
  const result = await kuroshiro.convert(text, { to: "hiragana" });
  res.json({ original: text, hiragana: result });
});

// Endpoint for converting to Katakana
app.post("/d-api/v1/convert/katakana", async (req, res) => {
  const { text } = req.body;
  console.log(text);
  const result = await kuroshiro.convert(text, { to: "katakana" });
  res.json({ original: text, katakana: result });
});

// Endpoint for converting to Romaji
app.post("/d-api/v1/convert/romaji", async (req, res) => {
  const { text } = req.body;
  console.log(text);
  const result = await kuroshiro.convert(text, {
    to: "romaji",
    romajiSystem: "hepburn",
  });
  res.json({ original: text, romaji: result });
});

// Endpoint for Okurigana mode
app.post("/d-api/v1/convert/okurigana", async (req, res) => {
  const { text } = req.body;
  console.log(text);
  const result = await kuroshiro.convert(text, {
    to: "hiragana",
    mode: "okurigana",
  });
  res.json({ original: text, okurigana: result });
});

// Endpoint for Furigana mode
app.post("/d-api/v1/convert/furigana", async (req, res) => {
  const { text } = req.body;
  console.log(`furigana: ${text}`);
  const result = await kuroshiro.convert(text, {
    to: "hiragana",
    mode: "furigana",
  });
  res.json({ original: text, furigana: result });
});

// All-in-one conversion endpoint
app.post("/d-api/v1/convert/all", async (req, res) => {
  const { text } = req.body;
  console.log("incoming payload: ", text);
  try {
    const hiragana = await kuroshiro.convert(text, { to: "hiragana" });
    const katakana = await kuroshiro.convert(text, { to: "katakana" });
    const romaji = await kuroshiro.convert(text, {
      to: "romaji",
      romajiSystem: "hepburn",
    });
    const okurigana = await kuroshiro.convert(text, {
      to: "hiragana",
      mode: "okurigana",
    });
    const furigana = await kuroshiro.convert(text, {
      to: "hiragana",
      mode: "furigana",
    });

    res.json({
      original: text,
      hiragana: hiragana,
      katakana: katakana,
      romaji: romaji,
      okurigana: okurigana,
      furigana: furigana,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error processing your request", details: error.message });
  }
});

// ------------------------------------------------------------------------------------- //
// -------------------------------- KANJIDIC LOGIC ------------------------------------- //
// ------------------------------------------------------------------------------------- //

//curl http://localhost:5300/d-api/v1/kanji/$(echo -n '風' | nkf -WwMQ | tr = %)
//curl http://localhost:5300/d-api/v1/kanji/$(echo -n '亜' | nkf -WwMQ | tr = %)

// Endpoint to get kanji information
app.get("/d-api/v1/kanji/:character", (req, res) => {
  let { character } = req.params;
  let result = kanjiData.find((k) => k.literal === character);

  if (!result) {
    // Use Node's native decodeURIComponent
    try {
      character = decodeURIComponent(character);
      result = kanjiData.find((k) => k.literal === character);
    } catch (e) {
      console.error("Error decoding URI component:", e);
    }
  }

  if (result) {
    res.json(formatKanjiData(result));
  } else {
    res.status(404).send({ message: "Kanji not found" });
  }
});

// Function to format kanji data into a more usable format,
// focusing on Japanese readings, English meanings,
// radical information, and frequency
function formatKanjiData(kanji) {
  // example output from our api
  // {
  //     "literal": "亜",
  //     "readings": [
  //       { "type": "ja_on", "value": "ア" },
  //       { "type": "ja_kun", "value": "つ.ぐ" }
  //     ],
  //     "meanings": ["Asia", "rank next", "come after", "-ous"],
  //     "radicals": [
  //       { "type": "classical", "value": "7" },
  //       { "type": "nelson_c", "value": "1" }
  //     ],
  //     "stroke_count": "7",
  //     "grade": "8",
  //     "jlpt_level": "1",
  //     "frequency": "1509",
  //     "unicode": "4e9c"
  //   }

  // Ensuring radicals are processed correctly whether as an array or a single object
  const radicals = Array.isArray(kanji.radical?.rad_value)
    ? kanji.radical.rad_value.map((rad) => ({
        type: rad["@rad_type"],
        value: rad["#text"],
      }))
    : [kanji.radical?.rad_value].map((rad) => ({
        type: rad["@rad_type"],
        value: rad["#text"],
      }));

  return {
    literal: kanji.literal,
    readings: kanji.reading_meaning?.rmgroup?.reading
      .filter((r) => r["@r_type"] === "ja_on" || r["@r_type"] === "ja_kun")
      .map((r) => ({ type: r["@r_type"], value: r["#text"] })),
    meanings: kanji.reading_meaning?.rmgroup?.meaning
      .filter((m) => typeof m === "string") // Assuming all string entries are in English
      .map((m) => m),
    radicals: radicals,
    stroke_count: kanji.misc?.stroke_count,
    grade: kanji.misc?.grade,
    jlpt_level: kanji.misc?.jlpt,
    frequency: kanji.misc?.freq,
    unicode: kanji.codepoint?.cp_value.find((v) => v["@cp_type"] === "ucs")[
      "#text"
    ],
  };
}

// ---------------- kanji splitter --------------------- //

// curl "http://localhost:5300/d-api/v1/extract-kanji?word=$(echo -n '寿司屋' | nkf -WwMQ | tr = %)"
// {"kanji":["寿","司","屋"]}

// curl "http://localhost:5300/d-api/v1/extract-kanji?word=$(echo -n '新幹線' | nkf -WwMQ | tr = %)"
// {"kanji":["新","幹","線"]}

// curl "http://localhost:5300/d-api/v1/extract-kanji?word=$(echo -n '新幹線は速い' | nkf -WwMQ | tr = %)"
// {"kanji":["新","幹","線","速"]}

// curl "http://localhost:5300/d-api/v1/extract-kanji?word=$(echo -n '亜' | nkf -WwMQ | tr = %)"
// {"kanji":["亜"]}

app.get("/d-api/v1/extract-kanji", (req, res) => {
  const { word } = req.query;
  if (!word) {
    return res.status(400).json({ error: "No word provided" });
  }
  const kanjiList = extractKanji(word);
  res.json({ kanji: kanjiList });
});

function extractKanji(text) {
  // Regular expression to match kanji characters
  const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/g;
  return text.match(kanjiRegex) || [];
}

// ------------------------------------------------------------------------------------- //
// -------------------------------- JMDICT LOGIC --------------------------------------- //
// ------------------------------------------------------------------------------------- //

// curl http://localhost:5200/d-api/v1/simple-vocabulary/$(echo -n '寿司屋' | nkf -WwMQ | tr = %)
// {"original":"寿司屋","hiragana":"すしや","englishTranslations":["sushi shop","sushi restaurant","sushi bar"]}
// with corrective action when mecab parser gives too long lemma 同じだ -> trimmed to 同じ
app.get("/d-api/v1/simple-vocabulary/:expression", async (req, res) => {
  let expression = decodeURIComponent(req.params.expression);
  console.log(expression);

  try {
    let result = await Entry.findOne({ expression: expression });

    // If no result is found, remove the last character and try again
    while (!result && expression.length > 0) {
      expression = expression.slice(0, -1);
      console.log(`Trying with expression: ${expression}`);
      result = await Entry.findOne({ expression: expression });
    }

    if (!result) {
      return res.status(404).json({ message: "Word not found" });
    }

    // Structure the output to match expected format
    const response = {
      original: result.expression,
      hiragana: result.reading,
      englishTranslations: result.meanings,
    };

    res.json(response);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ------------------------------------------------------------------------------------- //
// ------------------------- Kanji Radicals (KRADFILE) --------------------------------- //
// ------------------------------------------------------------------------------------- //

//const express = require('express');
//const bodyParser = require('body-parser');
//const cors = require('cors'); // Import cors
//const fs = require('fs');

// Function to check if a character is a kanji
function isKanji(char) {
  return (
    (char >= "\u4e00" && char <= "\u9faf") ||
    (char >= "\u3400" && char <= "\u4dbf")
  );
}

//const app = express();
//const port = 5000;

// Load JSON files into memory
const kradfile = JSON.parse(
  fs.readFileSync("radicals/kradfile_decoded_euc_jp.json", "utf8")
);
const radicalsDescriptions = JSON.parse(
  fs.readFileSync("radicals/radicals_wikipedia.json", "utf8")
);

// Middleware to parse JSON bodies
//app.use(bodyParser.json());
//app.use(cors()); // Use cors middleware

// we can send string/list of strings
// coil@coil-VM:backend$ curl -X POST http://localhost:5000/d-api/v1/radical-info -H "Content-Type: application/json" -d '{"kanjiList": ["亜", "唖", "娃", "a", "あ"]}'
// [{"kanji":"亜","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"唖","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"娃","radicals":[{"radical":"女","meaning":"woman, female (おんな, onna)"},{"radical":"土","meaning":"earth (つち, tsuchi)"}]},{"kanji":"a","error":"Invalid kanji character"},{"kanji":"あ","error":"Invalid kanji character"}]
// coil@coil-VM:backend$ curl -X POST http://localhost:5000/d-api/v1/radical-info -H "Content-Type: application/json" -d '{"kanjiList": "亜唖娃aあ"}'
// [{"kanji":"亜","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"唖","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"娃","radicals":[{"radical":"女","meaning":"woman, female (おんな, onna)"},{"radical":"土","meaning":"earth (つち, tsuchi)"}]},{"kanji":"a","error":"Invalid kanji character"},{"kanji":"あ","error":"Invalid kanji character"}]
app.post("/d-api/v1/radical-info", (req, res) => {
  let kanjiList = req.body.kanjiList;

  if (typeof kanjiList === "string") {
    kanjiList = kanjiList.split("");
  }

  if (!Array.isArray(kanjiList) || kanjiList.length === 0) {
    return res.status(400).json({
      error: "A non-empty array or string of kanji characters is required",
    });
  }

  const response = kanjiList.map((kanji) => {
    if (!isKanji(kanji)) {
      return { kanji, error: "Invalid kanji character" };
    }

    const radicals = kradfile[kanji];

    if (!radicals) {
      return { kanji, error: "Kanji not found" };
    }

    const radicalDetails = radicals.map((radical) => ({
      radical,
      meaning: radicalsDescriptions[radical] || "Meaning not found",
    }));

    return {
      kanji,
      radicals: radicalDetails,
    };
  });

  res.json(response);
});

// ------------------------------------------------------------------------------------- //
// ----------------------------------- Chat GPT API ------------------------------------ //
// ------------------------------------------------------------------------------------- //

// TODO: caching logic is broken, fixes had issues with Markdown responses
// -------------------------------------------------------------------------------------- //
// const express = require('express');
// const { OpenAI } = require('openai');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto'); // For creating cache keys

//const app = express();
//const port = 5900;

//app.use(bodyParser.json());
//app.use(cors());

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
  organization: config.OPENAI_ORG_ID,
});

const systemPrompt =
  "You are a teacher of Japanese and Korean language. Explain grammar of provided Japanese or Korean sentence in detail. Return answer in Markdown format with Markdown formatting so the output is readable.";
const translationPrompt =
  "You are a translator. Translate the provided Japanese or Korean text to English. Return answer in Markdown format with Markdown formatting so the output is readable.";
const translationSbSPrompt =
  "You are a translator. Translate the provided Japanese or Korean text to English. Translate side by side. Translate side by side in Markdown. Create side by side Markdown table. Ensure proper Markdown spacing, so it can be rendered correctly. Make it nicely formatted. Return answer in Markdown format with Markdown formatting so the output is readable.";
const summaryPrompt =
  "You are a summarizer. Summarize the provided text in a concise manner. But be also rather detailed in your text summary. Return the summary in Markdown format with Markdown formatting so the output is readable.";
const sentimentPrompt =
  "You are a sentiment analyzer. Analyze the sentiment of the provided text in very detailed way. Use example sentences from original text. Return the result in Markdown format with Markdown formatting so the output is readable.";

const parseTreePrompt =
  "You are a parse tree linguistic analyzer, analyze phrases and parts of speech. Analyze provided sentence and return its parse tree in JSON format. If the input sentece is in English, add descriptions in Japanese. Keys will be: type, value, translation, children. Return parse tree in JSON format, return only JSON structure, nothing else.";

//const verbConjugationPrompt = 'return short JSON'
// const verbConjugationPrompt = `You are specialist in verb conjugation of Japanese and Korean verbs.
// For given verb (can be Japanese or Korean) provide verb conjugation logical hierarchical breakdown in format following to this.
// Return ONLY JSON DATA, nothing else. Return only in JSON format.

// const verbConjugationPrompt = ''
// const wordSimilarityPrompt  = ''
// const synonymsPrompt        = ''
// const antonymsPrompt        = ''
// const hypernymsPrompt       = ''
// const hyponymsPrompt        = ''
// const collocationsPrompt    = ''
// const partOfSpeechPrompt    = ''
// const idiomsPrompt          = ''
// const pronSimPrompt         = ''

const payload_structure = `

Incoming word will be Japanese or Korean.
Logical hierarchical breakdown is required.
Provide 3 levels of hierarchy where possible.
Provide the results as a hierarchical JSON array of objects.
Returned data is in the following JSON format only. 
Ensure no additional text or explanations, just the JSON.
Data under "usage" key will be in English.
Data under "example" key will be in target language (and in English in brackets),
So for example Japanese sentence and English translation or Korean sentence and English translation.
Objects should have child objects where possible to show hierarchy, very important.
You must have 3 hierarchy levels where possible.
Output is supposed to teach students.
Provide long JSON so we have complex nested structure.
Provide as complex JSON as possible. 

Example output format:

{
  word: "",
  meaning: "",
  readings: [""],
  usage: "",
  children: [
    {
      word: "",
      meaning: "",
      example: "",
      readings: [""],
      usage: "",
      children: []
    },
    {
      word: "",
      meaning: "",
      example: "",
      readings: [""],
      usage: "",
      children: [
        {
          word: "",
          meaning: "",
          example: "",
          readings: [""],
          usage: ""
        }
      ]
    },
    {
      word: "",
      meaning: "",
      example: "",
      readings: [""],
      usage: "",
      children: [
        {
          word: "",
          meaning: "",
          example: "",
          readings: [""],
          usage: ""
        }
      ]
    },
    {
      word: "",
      meaning: "",
      example: "",
      readings: [""],
      usage: "",
      children: []
    },
    {
      word: "",
      meaning: "",
      example: "",
      readings: [""],
      usage: "",
      children: []
    },
    {
      word: "",
      meaning: "",
      example: "",
      readings: [""],
      usage: "",
      children: []
    },
    {
      word: "",
      meaning: "",
      example: "",
      readings: [""],
      usage: "",
      children: []
    }
  ]
}`;

const verbConjugationPrompt = `You are an expert in Japanese and Korean verb conjugation. 
For the given word, return a hierarchical breakdown of its conjugation. 
${payload_structure}`;

const wordSimilarityPrompt = `You are an expert linguist in Japanese and Korean. 
For the given word, identify words with related meanings or that share contextual usage. 
Each object includes the similar word and a brief description of the relationship. 
${payload_structure}`;

const synonymsPrompt = `You are a synonym expert in Japanese, and Korean. 
For the given word, provide a JSON of synonyms, hierarchy rank by relevance. 
${payload_structure}`;

const antonymsPrompt = `You are a linguistic expert in Japanese and Korean. 
For the given word, provide a JSON  of antonyms, hierarchy rank by relevance. 
${payload_structure}`;

const hypernymsPrompt = `You are an expert in lexical hierarchies in Japanese and Korean. 
For the given word, identify its hypernyms (more general terms that encompass the word). 
Provide the results as a JSON of hypernyms. 
${payload_structure}`;

const hyponymsPrompt = `You are an expert in lexical hierarchies in Japanese and Korean. 
For the given word, identify its hyponyms (more specific terms under the word's category). 
Provide the results as a hierarchycal JSON of hyponyms. 
${payload_structure}`;

const collocationsPrompt = `You are an expert in collocations and phraseology in Japanese and Korean. 
For the given word, provide a JSON of common collocations where this word appears. 
${payload_structure}`;

const partOfSpeechPrompt = `You are an expert linguist in Japanese and Korean. 
For the given word, provide its possible parts of speech and corresponding examples in a JSON format. 
${payload_structure}`;

const idiomsPrompt = `You are an expert in idiomatic expressions and phrasal verbs in Japanese and Korean. 
For the given word, provide a JSON of idioms or phrasal verbs where this word appears. 
Each object should include the expression and its meaning. 
${payload_structure}`;

const pronSimPrompt = `You are an expert in phonetics and linguistics in Japanese and Korean. 
For the given word, provide a JSON of words that are phonetically similar or share similar syllable structures. 
So provide words that sound similar and can confuse students. So show words that typically cause confusion.
Provide words that have similar Kanji, that can be confusing (when given Japanese word).
${payload_structure}`;

const GPT_MODEL_BASIC = "gpt-4o-mini"; //several times cheaper than 3.5
const GPT_MODEL_ADVANCED = "gpt-4o"; //rather expensive, use only for graphs
const MAX_PROMPT_LENGTH = 200;
const MAX_TRANSLATION_PROMPT_LENGTH = 4000;
const MAX_SENTENCE_PROMPT_LENGTH = 100;
const MAX_CALLS = 2000;
const FILE_PATH = path.join(__dirname, "callCount.json");

const CACHE = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ------------------------- GPT related helper functions -------------------------- //

const readCallCount = () => {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(data).count;
    }
  } catch (error) {
    console.error("Error reading call count:", error);
  }
  return 0;
};

const writeCallCount = (count) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ count }));
  } catch (error) {
    console.error("Error writing call count:", error);
  }
};

const incrementCallCount = () => {
  let count = readCallCount();
  count += 1;
  writeCallCount(count);
  return count;
};

const isWithinCallLimit = () => {
  const count = readCallCount();
  return count < MAX_CALLS;
};

const getCacheKey = (userPrompt, promptType) => {
  const hash = crypto
    .createHash("sha256")
    .update(userPrompt + promptType)
    .digest("hex");
  return `${promptType}-${hash}`;
};

const getCachedResponse = (cacheKey) => {
  const cachedData = CACHE[cacheKey];
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.response;
  }
  return null;
};

const setCachedResponse = (cacheKey, response) => {
  CACHE[cacheKey] = {
    response,
    timestamp: Date.now(),
  };
};

const handleOpenAIRequest = async (userPrompt, promptType, model) => {
  let prompt;
  let maxLength;

  switch (promptType) {
    case "grammar":
      prompt = systemPrompt;
      maxLength = MAX_PROMPT_LENGTH;
      break;
    case "translation":
      prompt = translationPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH;
      break;
    case "translation-sbs":
      prompt = translationSbSPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH;
      break;
    case "summary":
      prompt = summaryPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH; // assuming summary can be long text
      break;
    case "sentiment":
      prompt = sentimentPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH; // assuming sentiment analysis can be long text
      break;
    case "parse-tree":
      prompt = parseTreePrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    // word relationships react flow graphs
    case "verb-conjugation":
      prompt = verbConjugationPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;
    case "word-similarity":
      prompt = wordSimilarityPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;
    case "synonyms":
      prompt = synonymsPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;
    case "antonyms":
      prompt = antonymsPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    case "hypernyms":
      prompt = hypernymsPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    case "hyponyms":
      prompt = hyponymsPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    case "collocations":
      prompt = collocationsPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    case "part-of-speech":
      prompt = partOfSpeechPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    case "idioms":
      prompt = idiomsPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    case "pronounciation-similarity":
      prompt = pronSimPrompt;
      maxLength = MAX_SENTENCE_PROMPT_LENGTH; // sentences are much shorter
      break;

    default:
      throw new Error("Invalid prompt type.");
  }

  if (!userPrompt) {
    throw new Error("userPrompt is required.");
  }

  if (userPrompt.length > maxLength) {
    throw new Error(
      `userPrompt exceeds maximum length of ${maxLength} characters.`
    );
  }

  if (!isWithinCallLimit()) {
    throw new Error("API call limit exceeded. Please try again later.");
  }

  const cacheKey = getCacheKey(userPrompt, promptType);
  const cachedResponse = getCachedResponse(cacheKey);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await openai.chat.completions.create({
      //model: GPT_MODEL,
      model: model,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userPrompt },
      ],
    });

    incrementCallCount();
    setCachedResponse(cacheKey, response);
    return response;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("An error occurred while calling the OpenAI API.");
  }
};














// ----------------------------- API Endpoints -------------------------- //

// PROMPT
// curl -X POST http://localhost:5900/d-api/v1/grammar \
//     -H "Content-Type: application/json" \
//     -d '{
//         "userPrompt": "君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で"
//     }'
//
// ANSWER
// curl -X POST http://localhost:5900/d-api/v1/grammar \
//      -H "Content-Type: application/json" \
//      -d '{
//          "userPrompt": "君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で"
//      }'
// {"id":"chatcmpl-9T72VeDOn8B7BgdnfHhQi9t4Fy4bC",
// "object":"chat.completion",
// "created":1716725599,
// "model":"gpt-3.5-turbo-0125",
// "choices":[{"index":0,
// "message":{"role":"assistant",
// "content":"In this Japanese sentence:\n\n君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で\n\n- 君: \"you\"\n- は: topic marking particle\n- それ を: \"that\" (direct object marker)\n- 掴もう: volitional form of the verb \"to grab\"\n- と: particle indicating intention or purpose\n- して: te-form of the verb \"to do\"\n- 馬鹿 みたいに: \"like a fool\"\n- 空 を: \"the sky\" (object marker)\n- 切った: past tense of the verb \"to cut/slash\"\n- 手 で: \"with your hand\"\n\nTherefore, the overall translation of the sentence would be: \"You tried to grab that with a foolish, slashing motion of your hand through the air.\""},
// "logprobs":null,
// "finish_reason":"stop"}],
// "usage":
// {"prompt_tokens":70,
// "completion_tokens":201,
// "total_tokens":271},
// "system_fingerprint":null}
app.post("/d-api/v1/grammar", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "grammar", GPT_MODEL_BASIC);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// curl -X POST http://localhost:5200/d-api/v1/translate \
//      -H "Content-Type: application/json" \
//      -d '{
//         "userPrompt": "君はそれを掴もうとして、馬鹿みたいに空を切った手で"
//      }'
app.post("/d-api/v1/translate", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "translation", GPT_MODEL_BASIC);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/translate-side-by-side", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "translation-sbs", GPT_MODEL_BASIC);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// curl -X POST http://localhost:5900/d-api/v1/summary \
//      -H "Content-Type: application/json" \
//      -d '{
//          "userPrompt": "This is a long text that needs to be summarized. The text can contain multiple sentences and the goal is to generate a concise summary of the content provided."
//      }'
// {"id":"chatcmpl-9Vi7mYwK0m9nGs2ELVuXvOT0xZn5D",
// "object":"chat.completion",
// "created":1717344810,
// "model":"gpt-3.5-turbo-0125",
// "choices":[{"index":0,
// "message":{"role":"assistant",
// "content":"### Summary:\nThis summarizer task is to provide a concise summary of the text input by the user."},
// "logprobs":null,"finish_reason":"stop"}],
// "usage":{"prompt_tokens":74,"completion_tokens":21,"total_tokens":95},
// "system_fingerprint":null}
app.post("/d-api/v1/summary", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "summary", GPT_MODEL_BASIC);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// curl -X POST http://localhost:5900/d-api/v1/sentiment \
//      -H "Content-Type: application/json" \
//      -d '{
//          "userPrompt": "I am feeling very happy today because I received great news!"
//      }'
// {"id":"chatcmpl-9ViE05KGpKn2Pck3QseiX80MVCoTu",
// "object":"chat.completion",
// "created":1717345196,
// "model":"gpt-3.5-turbo-0125",
// "choices":[{"index":0,"message":{"role":"assistant","content":"### Sentiment Analysis:\n\nThe text conveys a **positive** sentiment. The user is **happy** due to receiving great news."},
// "logprobs":null,"finish_reason":"stop"}],
// "usage":{"prompt_tokens":53,"completion_tokens":27,"total_tokens":80},
// "system_fingerprint":null}
app.post("/d-api/v1/sentiment", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "sentiment", GPT_MODEL_BASIC);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// ---                    --- //
// --- word relationships --- //
// ---                    --- //

// curl -X POST http://localhost:5200/d-api/v1/verb-conjugation \
//      -H "Content-Type: application/json" \
//      -d '{
//          "userPrompt": "雨"
//      }'
app.post("/d-api/v1/verb-conjugation", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "verb-conjugation", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/word-similarity", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "word-similarity", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/synonyms", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "synonyms", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/antonyms", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "antonyms", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/hypernyms", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "hypernyms", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/hyponyms", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "hyponyms", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/collocations", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "collocations", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/part-of-speech", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "part-of-speech", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/idioms", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, "idioms", GPT_MODEL_ADVANCED);
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/d-api/v1/pronounciation-similarity", async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(
      userPrompt,
      "pronounciation-similarity",
      GPT_MODEL_ADVANCED
    );
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// curl -X GET http://localhost:5900/d-api/v1/metrics
//{"callCount":22,"estimatedCost":"$0.04"}
app.get("/d-api/v1/metrics", (req, res) => {
  const count = readCallCount();
  const estimatedCost = (count * 0.002).toFixed(2); // Assume $0.002 per call for simplicity
  res.send({ callCount: count, estimatedCost: `$${estimatedCost}` });
});

// ----------------- parse tree ------------------ //

// New endpoint to generate a parse tree from a provided sentence

// curl -X POST http://localhost:5200/d-api/v1/parse-tree \
//      -H "Content-Type: application/json" \
//      -d '{
//          "sentence": "君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で",
//          "language": "Japanese",
//          "userId": "user123"
//      }'

// coil@coil-VM:~$ curl -X POST http://localhost:5200/d-api/v1/parse-tree       -H "Content-Type: application/json"       -d '{
//           "sentence": "君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で",
//           "language": "Japanese",
//           "userId": "user123"
//       }'
// {"parseTree":"{\n  \"type\": \"sentence\",\n  \"value\": \"君はそれを掴もうとして、馬鹿みたいに空を切った手で\",\n  \"translation\": \"You tried to grab it, with hands that cut through the air like an idiot.\",\n  \"children\": [\n    {\n      \"type\": \"subject\",\n      \"value\": \"君\",\n      \"translation\": \"You\",\n      \"children\": []\n    },\n    {\n      \"type\": \"particle\",\n      \"value\": \"は\",\n      \"translation\": \"topic marker\",\n      \"children\": []\n    },\n    {\n      \"type\": \"object\",\n      \"value\": \"それ\",\n      \"translation\": \"it\",\n      \"children\": []\n    },\n    {\n      \"type\": \"particle\",\n      \"value\": \"を\",\n      \"translation\": \"object marker\",\n      \"children\": []\n    },\n    {\n      \"type\": \"verb phrase\",\n      \"value\": \"掴もうとする\",\n      \"translation\": \"to try to grab\",\n      \"children\": [\n        {\n          \"type\": \"verb\",\n          \"value\": \"掴もう\",\n          \"translation\": \"to try to grab\",\n          \"children\": []\n        },\n        {\n          \"type\": \"particle\",\n          \"value\": \"と\",\n          \"translation\": \"quotative marker\",\n          \"children\": []\n        },\n        {\n          \"type\": \"verb\",\n          \"value\": \"する\",\n          \"translation\": \"to do\",\n          \"children\": []\n        }\n      ]\n    },\n    {\n      \"type\": \"particle\",\n      \"value\": \"して\",\n      \"translation\": \"and\",\n      \"children\": []\n    },\n    {\n      \"type\": \"adjective phrase\",\n      \"value\": \"馬鹿みたいに\",\n      \"translation\": \"like an idiot\",\n      \"children\": [\n        {\n          \"type\": \"noun\",\n          \"value\": \"馬鹿\",\n          \"translation\": \"idiot\",\n          \"children\": []\n        },\n        {\n          \"type\": \"particle\",\n          \"value\": \"みたい\",\n          \"translation\": \"like\",\n          \"children\": []\n        },\n        {\n          \"type\": \"particle\",\n          \"value\": \"に\",\n          \"translation\": \"to\",\n          \"children\": []\n        }\n      ]\n    },\n    {\n      \"type\": \"adverbial phrase\",\n      \"value\": \"空を切った手で\",\n      \"translation\": \"with hands that cut through the air\",\n      \"children\": [\n        {\n          \"type\": \"noun phrase\",\n          \"value\": \"手\",\n          \"translation\": \"hands\",\n          \"children\": [\n            {\n              \"type\": \"particle\",\n              \"value\": \"で\",\n              \"translation\": \"with\",\n              \"children\": []\n            }\n          ]\n        },\n        {\n          \"type\": \"verb phrase\",\n          \"value\": \"空を切った\",\n          \"translation\": \"that cut through the air\",\n          \"children\": [\n            {\n              \"type\": \"noun\",\n              \"value\": \"空\",\n              \"translation\": \"air\",\n              \"children\": []\n            },\n            {\n              \"type\": \"particle\",\n              \"value\": \"を\",\n              \"translation\": \"object marker\",\n              \"children\": []\n            },\n            {\n              \"type\": \"verb\",\n              \"value\": \"切った\",\n              \"translation\": \"cut\",\n              \"children\": []\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}","model":"gpt-4o-mini","tokensUsed":813,"callTimestamp":"2024-08-22T18:37:39.940Z"}coil@coil-VM:~$

app.post("/d-api/v1/parse-tree", async (req, res) => {
  try {
    const { sentence, language, userId } = req.body;

    console.log(req.body);

    // Ensure the sentence is provided
    if (!sentence) {
      return res.status(400).send({ error: "Sentence is required." });
    }

    // Optionally handle or log language and userId if needed
    // Example: Log the request details for monitoring purposes
    console.log(
      `Processing request for user: ${userId}, language: ${language}`
    );

    // Call the handleOpenAIRequest function to get the parse tree
    const response = await handleOpenAIRequest(sentence, "parse-tree", GPT_MODEL_ADVANCED);
    console.log(response)
    console.log('MESSAGE:')
    console.log(response.choices[0].message.content)



    // Construct the JSON response with additional metadata
    const jsonResponse = {
      parseTree: response.choices[0].message.content.replace(/```json/g, "").replace(/```/g, ""), // The content containing the parse tree structure
      model: response.model, // Metadata about the model used
      tokensUsed: response.usage.total_tokens, // Number of tokens used in the request
      callTimestamp: new Date().toISOString(), // Timestamp of the API call
    };

    // Send the response back to the frontend
    res.send(jsonResponse);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// ---------------------------------------------------------------------------------------- //
// ---------------------------------- YouTube Subtitles ----------------------------------- //
// ---------------------------------------------------------------------------------------- //

//const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
//const cors = require("cors");
const he = require("he");

// curl -X GET "http://localhost:8000/d-api/v1/get-transcript?url=https://www.youtube.com/watch?v=mjzZ5i9i2rY&lang=jp"
// bite size japanese does not have english subtitles, so it gives japanese by default even when we ask for english
// he - html entities fixes issues like: It&amp;#39;s -> It's
// well we have issues parsing the incoming text, but the he library itself looks fine
// > console.log(he.decode("I&#39;m Akane from Akane Japanese Language Class."));
// I'm Akane from Akane Japanese Language Class.
// undefined
// >
// we can tshoot this later, 
// we are now decoding this in real time on frontend with he library, issue solved for now
app.get("/d-api/v1/get-transcript", async (req, res) => {
  const videoUrl = req.query.url;
  const lang = req.query.lang || "ja"; // Default to Japanese if no language is specified

  if (!videoUrl) {
    return res.status(400).send("Missing video URL parameter");
  }

  try {
    console.log(
      `fetching transcript for youtube video: ${videoUrl} in language: ${lang}`
    );

    const transRes = await YoutubeTranscript.fetchTranscript(videoUrl, {
      lang: lang, // Use the language code specified in the query parameter
    });

    console.log("*** TRANS RES ***");
    console.log(transRes);

    // Decode HTML entities in the transcript
    const decodedTranscript = await transRes.map((entry) => ({
      ...entry,
      text: he.decode(entry.text),
      //text: "LOLOLOL"   // this worked fine, keep in mind you have subtitles stored in Local Storage
    }));

    console.log("*** HE DECODED TRANSCRIPT ***");
    console.log(decodedTranscript);

    console.log("fetched transcript successfully");

    res.status(200).json({ status: "success", transcript: decodedTranscript });
  } catch (error) {
    console.error("Error fetching transcript:", error);

    res.status(500).send("Error fetching transcript");
  }
});

//console.log("Test decoding:", he.decode("I&#39;m Akane from Akane Japanese Language Class."));

// ---------------------------------------------------------------------------------------- //
// ----------------- Jitendex mp3 streaming (IO overload prevention) ---------------------- //
// ---------------------------------------------------------------------------------------- //
// --- TODO: this /apifeature will crash nodemon --- //

// Serve MP3 files via an API route from the jitendex_audio directory
app.get("/d-api/v1/audio/:filename", (req, res) => {
  console.log(req.params.filename);

  // use partial content, so it does not crash nodemon
  //const filePath = path.join(__dirname, 'jitendex_audio_partial', req.params.filename);
  const filePath = path.join(__dirname, "jitendex_audio", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "audio/mpeg");
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});



// --- //

// --- //

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
