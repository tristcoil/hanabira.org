const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const fs = require('fs');

// Function to check if a character is a kanji
function isKanji(char) {
    return char >= '\u4e00' && char <= '\u9faf' || char >= '\u3400' && char <= '\u4dbf';
}

const app = express();
const port = 5000;

// Load JSON files into memory
const kradfile = JSON.parse(fs.readFileSync('kradfile_decoded_euc_jp.json', 'utf8'));
const radicalsDescriptions = JSON.parse(fs.readFileSync('radicals_wikipedia.json', 'utf8'));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors()); // Use cors middleware



// we can send string/list of strings
// coil@coil-VM:backend$ curl -X POST http://localhost:5000/kanji-info -H "Content-Type: application/json" -d '{"kanjiList": ["亜", "唖", "娃", "a", "あ"]}'
// [{"kanji":"亜","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"唖","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"娃","radicals":[{"radical":"女","meaning":"woman, female (おんな, onna)"},{"radical":"土","meaning":"earth (つち, tsuchi)"}]},{"kanji":"a","error":"Invalid kanji character"},{"kanji":"あ","error":"Invalid kanji character"}]
// coil@coil-VM:backend$ curl -X POST http://localhost:5000/kanji-info -H "Content-Type: application/json" -d '{"kanjiList": "亜唖娃aあ"}'
// [{"kanji":"亜","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"唖","radicals":[{"radical":"｜","meaning":"line, stick (ぼう, bō, 棒)"},{"radical":"一","meaning":"one (いち, ichi, 一)"},{"radical":"口","meaning":"mouth, opening (くち, kuchi)"}]},{"kanji":"娃","radicals":[{"radical":"女","meaning":"woman, female (おんな, onna)"},{"radical":"土","meaning":"earth (つち, tsuchi)"}]},{"kanji":"a","error":"Invalid kanji character"},{"kanji":"あ","error":"Invalid kanji character"}] 
app.post('/kanji-info', (req, res) => {
    let kanjiList = req.body.kanjiList;

    if (typeof kanjiList === 'string') {
        kanjiList = kanjiList.split('');
    }

    if (!Array.isArray(kanjiList) || kanjiList.length === 0) {
        return res.status(400).json({ error: 'A non-empty array or string of kanji characters is required' });
    }

    const response = kanjiList.map(kanji => {
        if (!isKanji(kanji)) {
            return { kanji, error: 'Invalid kanji character' };
        }

        const radicals = kradfile[kanji];

        if (!radicals) {
            return { kanji, error: 'Kanji not found' };
        }

        const radicalDetails = radicals.map(radical => ({
            radical,
            meaning: radicalsDescriptions[radical] || 'Meaning not found'
        }));

        return {
            kanji,
            radicals: radicalDetails
        };
    });

    res.json(response);
});

// --- //

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
