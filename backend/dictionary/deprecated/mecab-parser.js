const MeCab = require('mecab-async');
const mecab = new MeCab();
const express = require('express');

const cors = require('cors'); // Import the cors middleware
const app = express();
app.use(express.json());  // for parsing application/json
app.use(cors()); // Use cors middleware to enable CORS







const port = 5300;



// curl -X POST http://localhost:5300/parse -H "Content-Type: application/json" -d '{"text": "今日は学校に行きます"}'
app.post('/parse', (req, res) => {
    const text = req.body.text;
    mecab.parse(text, (err, result) => {
        if (err) {
            console.error("MeCab Error:", err);
            res.status(500).send("Error parsing Japanese text: " + err.message);
            return;
        }
        const words = result.map(entry => entry[7]); // Assuming basic form is what you need
        res.json(words);
    });
});



// curl -X POST http://localhost:5300/parse-json -H "Content-Type: application/json" -d '{"text": "今日は学校に行きます"}'
// Endpoint for asynchronous parse result as JSON payload
app.post('/parse-json', (req, res) => {
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
app.post('/parse-simple', (req, res) => {
    const text = req.body.text;
    mecab.parse(text, (err, result) => {
        if (err) {
            console.error("MeCab Error:", err);
            res.status(500).send("Error parsing Japanese text: " + err.message);
            return;
        }
        const simplifiedResult = result.map(entry => ({
            original: entry[0],
            dictionary: entry[5],
            furigana: entry[6]
        }));
        res.json(simplifiedResult);
    });
});






// Endpoint for simplified parse result with sentence separation
//  curl -X POST http://localhost:5300/parse-split -H "Content-Type: application/json" -d '{"text": "彼女はまったく遅れていない。今日は学校に行きます。"}'
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
app.post('/parse-split', (req, res) => {
    const text = req.body.text;
    console.log(`Incoming payload: ${text}`)
    const results = parseText(text);
    res.json(results);
});



//////////// FUNCTIONS /////////////////////

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
// const parseText = (text) => {

//     MAX_LENGTH = 5000

//     if (text.length > MAX_LENGTH) {
//         throw new Error('Input text exceeds maximum length');
//     }

//     const sentences = text.split(/([。．！？\n])/).filter(Boolean); // Split by periods, exclamation marks, and question marks
//     const results = [];
//     for (let i = 0; i < sentences.length; i += 2) {
//         const sentence = sentences[i] + (sentences[i + 1] || ''); // Combine the sentence with its punctuation
//         const parsedSentence = mecab.parseSync(sentence);
//         const parsedResult = parsedSentence.map(entry => ({
//             original: entry[0],
//             dictionary: entry[5],
//             furigana: entry[0] === entry[6] ? '' : entry[6] // If furigana is the same as original, set it to an empty string
//         }));
//         results.push(parsedResult);
//     }
//     return results;
// };

const parseText = (text) => {
    const MAX_LENGTH = 5000;

    if (text.length > MAX_LENGTH) {
        throw new Error('Input text exceeds maximum length');
    }

    const sentences = text.split(/([。．！？\n])/).filter(Boolean); // Split by periods, exclamation marks, and question marks
    const results = [];
    for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i] + (sentences[i + 1] || ''); // Combine the sentence with its punctuation
        const parsedSentence = mecab.parseSync(sentence);
        const parsedResult = parsedSentence
            .map(entry => ({
                original: entry[0],
                dictionary: entry[5],
                furigana: entry[0] === entry[6] ? '' : entry[6] // If furigana is the same as original, set it to an empty string
            }))
            .filter(entry => entry.original !== 'EOS'); // Filter out objects with "original" equal to "EOS", these are end of lines
        results.push(parsedResult);
    }
    return results;
};





///////////////////////////////

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));







// ------------------------------------------ comments ------------------------------------- //


// app.post('/translate', (req, res) => {
//     const text = req.body.text;
//     mecab.parse(text, (err, result) => {
//         if (err) {
//             res.status(500).send("Error parsing Japanese text.");
//             return;
//         }
//         // result is an array of arrays, each subarray contains:
//         // [Kanji, Lexical, Compound, Compound2, Compound3, Conjugation, Inflection, Original, Reading, Pronunciation]
//         const basicForms = result.map(entry => {
//             // The 7th index is the original form, often the dictionary form for nouns, but for verbs/adjectives, we need the base form
//             // Check if the conjugation (5th index) indicates that it's a verb or adjective and not in its base form
//             return entry[5] === '*' ? entry[0] : entry[7];  // Return kanji if not conjugated, otherwise return original form
//         });
//         res.json(basicForms);  // Send back the array of basic forms of the words
//     });
// });





// received output

// coil@coil-VM:~/Desktop/zen-lingo-website/next-flash-cards/backend$ curl -X POST http://localhost:5300/translate -H "Content-Type: application/json" -d '{"text": "今日は学校に行きます"}'

// ["代表表記:今日/きょう カテゴリ:時間",
// "*",
// "代表表記:学校/がっこう カテゴリ:場所-施設 ドメイン:教育・学習",
// "*",
// "代表表記:行く/いく 付属動詞候補（タ系） ドメイン:交通 反義:動詞:帰る/かえる",
// "代表表記:ます/ます"]


// mecab.parser = data => {
//     return {
//       kanji: data[0],
//       lexical: data[1],
//       compound: data[2],
//       compound2: data[3],
//       compound3: data[4],
//       conjugation: data[5],
//       inflection: data[6],
//       original: data[7],
//       reading: data[8],
//       pronunciation: data[9] || ''
//     };
//   };
  






// Tools for Japanese Text Tokenization:
// MeCab: A popular, open-source, morphological analyzer for Japanese text. It segments text into words and provides additional linguistic information like part of speech, which can be crucial for accurate translation.
// Kuromoji: A Java library that can also be used for tokenizing Japanese text. There's a JavaScript version available, which might integrate more seamlessly with a Next.js project.
// Sudachi: A Japanese tokenizer developed by Works Applications, known for handling various forms of Japanese text well.




