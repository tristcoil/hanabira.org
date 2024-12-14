const express = require('express');
const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const cors = require('cors');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors());










const kuroshiro = new Kuroshiro();

// Initialize Kuroshiro with Kuromoji Analyzer
(async () => {
    await kuroshiro.init(new KuromojiAnalyzer());
})();


// ------------- API call examples ------------------- //
// 1. Convert to Hiragana:
// curl -X POST http://localhost:5500/convert/hiragana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 2. Convert to Katakana:
// curl -X POST http://localhost:5500/convert/katakana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 3. Convert to Romaji:
// curl -X POST http://localhost:5500/convert/romaji -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 4. Convert to Hiragana with Okurigana Mode:
// curl -X POST http://localhost:5500/convert/okurigana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 5. Convert to Hiragana with Furigana Mode:
// curl -X POST http://localhost:5500/convert/furigana -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！\"}"

// 6. Universal endpoint, returns all options in payload
// curl -X POST http://localhost:5500/convert/all -H "Content-Type: application/json" -d "{\"text\":\"感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア 最高！\"}"
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
app.post('/convert/hiragana', async (req, res) => {
    const { text } = req.body;
    console.log(text);
    const result = await kuroshiro.convert(text, { to: 'hiragana' });
    res.json({ original: text, hiragana: result });
});

// Endpoint for converting to Katakana
app.post('/convert/katakana', async (req, res) => {
    const { text } = req.body;
    console.log(text);
    const result = await kuroshiro.convert(text, { to: 'katakana' });
    res.json({ original: text, katakana: result });
});

// Endpoint for converting to Romaji
app.post('/convert/romaji', async (req, res) => {
    const { text } = req.body;
    console.log(text);
    const result = await kuroshiro.convert(text, { to: 'romaji', romajiSystem: 'hepburn' });
    res.json({ original: text, romaji: result });
});

// Endpoint for Okurigana mode
app.post('/convert/okurigana', async (req, res) => {
    const { text } = req.body;
    console.log(text);
    const result = await kuroshiro.convert(text, { to: 'hiragana', mode: 'okurigana' });
    res.json({ original: text, okurigana: result });
});

// Endpoint for Furigana mode
app.post('/convert/furigana', async (req, res) => {
    const { text } = req.body;
    console.log(text);
    const result = await kuroshiro.convert(text, { to: 'hiragana', mode: 'furigana' });
    res.json({ original: text, furigana: result });
});

// All-in-one conversion endpoint
app.post('/convert/all', async (req, res) => {
    const { text } = req.body;
    console.log("incoming payload: ", text)
    try {
        const hiragana = await kuroshiro.convert(text, { to: 'hiragana' });
        const katakana = await kuroshiro.convert(text, { to: 'katakana' });
        const romaji = await kuroshiro.convert(text, { to: 'romaji', romajiSystem: 'hepburn' });
        const okurigana = await kuroshiro.convert(text, { to: 'hiragana', mode: 'okurigana' });
        const furigana = await kuroshiro.convert(text, { to: 'hiragana', mode: 'furigana' });

        res.json({
            original: text,
            hiragana: hiragana,
            katakana: katakana,
            romaji: romaji,
            okurigana: okurigana,
            furigana: furigana
        });
    } catch (error) {
        res.status(500).json({ error: "Error processing your request", details: error.message });
    }
});


// --- ///

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
