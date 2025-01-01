const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 5300;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load the kanji data, json has around 50 MB
let kanjiData = [];
fs.readFile('kanjidic/kanjidic2.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Failed to read kanji data file:", err);
        return;
    }
    kanjiData = JSON.parse(data).kanjidic2.character;
});



//curl http://localhost:5300/kanji/$(echo -n '風' | nkf -WwMQ | tr = %)
//curl http://localhost:5300/kanji/$(echo -n '亜' | nkf -WwMQ | tr = %)

// Endpoint to get kanji information
app.get('/kanji/:character', (req, res) => {
    let { character } = req.params;
    let result = kanjiData.find(k => k.literal === character);

    if (!result) {
        // Use Node's native decodeURIComponent
        try {
            character = decodeURIComponent(character);
            result = kanjiData.find(k => k.literal === character);
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
        ? kanji.radical.rad_value.map(rad => ({ type: rad["@rad_type"], value: rad["#text"] }))
        : [kanji.radical?.rad_value].map(rad => ({ type: rad["@rad_type"], value: rad["#text"] }));

    return {
        literal: kanji.literal,
        readings: kanji.reading_meaning?.rmgroup?.reading
            .filter(r => r["@r_type"] === "ja_on" || r["@r_type"] === "ja_kun")
            .map(r => ({ type: r["@r_type"], value: r["#text"] })),
        meanings: kanji.reading_meaning?.rmgroup?.meaning
            .filter(m => typeof m === 'string')  // Assuming all string entries are in English
            .map(m => m),
        radicals: radicals,
        stroke_count: kanji.misc?.stroke_count,
        grade: kanji.misc?.grade,
        jlpt_level: kanji.misc?.jlpt,
        frequency: kanji.misc?.freq,
        unicode: kanji.codepoint?.cp_value.find(v => v["@cp_type"] === "ucs")["#text"]
    };
}


// ---------------- kanji splitter --------------------- //

// curl "http://localhost:5300/api/extract-kanji?word=$(echo -n '寿司屋' | nkf -WwMQ | tr = %)"
// {"kanji":["寿","司","屋"]}

// curl "http://localhost:5300/api/extract-kanji?word=$(echo -n '新幹線' | nkf -WwMQ | tr = %)"
// {"kanji":["新","幹","線"]}

// curl "http://localhost:5300/api/extract-kanji?word=$(echo -n '新幹線は速い' | nkf -WwMQ | tr = %)"
// {"kanji":["新","幹","線","速"]} 

// curl "http://localhost:5300/api/extract-kanji?word=$(echo -n '亜' | nkf -WwMQ | tr = %)"
// {"kanji":["亜"]}


app.get('/api/extract-kanji', (req, res) => {
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


// great, now we can make nice frontend for these





// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
