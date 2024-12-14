const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const deepl = require('deepl-node');
const fs = require('fs');

const app = express();

// Load config file
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

// Set up DeepL translator
const translator = new deepl.Translator(config.deeplApiKey);

// POST endpoint for translation
// curl -X POST   http://localhost:3000/translate   -H 'Content-Type: application/json'   -d '{"japaneseText":"こんにちは、世界！"}'
// {"translatedText":"Hello world!"}
app.post('/translate', async (req, res) => {
    const { japaneseText } = req.body;

    try {
        // Translate Japanese text to English
        const result = await translator.translateText(japaneseText, 'ja', 'en-US');
        res.json({ translatedText: result.text });
    } catch (error) {
        console.error("Translation error:", error);
        res.status(500).json({ error: "Translation failed" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
