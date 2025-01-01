// modules/mecab-logic.js

const express = require("express");
const router = express.Router();
const MeCab = require("mecab-async");
const mecab = new MeCab();

// Example endpoint: Simple parsing of text
// curl -X POST http://localhost:5200/d-api/v1/parse -H "Content-Type: application/json" -d '{"text":"今日は学校に行きます"}'
router.post("/parse", (req, res) => {
  const text = req.body.text;
  mecab.parse(text, (err, result) => {
    if (err) {
      console.error("MeCab Error:", err);
      return res.status(500).json({ error: "Error parsing Japanese text" });
    }
    const words = result.map((entry) => entry[7]); // basic form as an example
    res.json(words);
  });
});

// Example endpoint: JSON structured parse
// curl -X POST http://localhost:5200/d-api/v1/parse-json -H "Content-Type: application/json" -d '{"text":"今日は学校に行きます"}'
router.post("/parse-json", (req, res) => {
  const text = req.body.text;
  mecab.parse(text, (err, result) => {
    if (err) {
      console.error("MeCab Error:", err);
      return res.status(500).json({ error: "Error parsing Japanese text" });
    }
    res.json(result);
  });
});

// Example endpoint: simplified parse
// curl -X POST http://localhost:5200/d-api/v1/parse-simple -H "Content-Type: application/json" -d '{"text":"今日は学校に行きます"}'
router.post("/parse-simple", (req, res) => {
  const text = req.body.text;
  mecab.parse(text, (err, result) => {
    if (err) {
      console.error("MeCab Error:", err);
      return res.status(500).json({ error: "Error parsing Japanese text" });
    }
    const simplifiedResult = result.map((entry) => ({
      original: entry[0],
      dictionary: entry[5],
      furigana: entry[6],
    }));
    res.json(simplifiedResult);
  });
});

// Example endpoint: sentence-split parse (just a placeholder, real logic needed)
router.post("/parse-split", (req, res) => {
  const text = req.body.text;
  // This is a placeholder for whatever splitting logic you want to implement.
  // You’d implement your splitting logic and mecab parse here.
  // For simplicity, let's just parse as one sentence:
  mecab.parse(text, (err, result) => {
    if (err) {
      console.error("MeCab Error:", err);
      return res.status(500).json({ error: "Error parsing Japanese text" });
    }
    // Format result as needed, here just returning as an array of one sentence
    const formatted = result
      .filter((r) => r[0] !== "EOS")
      .map((r) => ({
        original: r[0],
        dictionary: r[5],
        furigana: r[6] === r[0] ? "" : r[6],
      }));
    res.json([formatted]);
  });
});

module.exports = router;
