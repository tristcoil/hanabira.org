const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

// Initialize kuroshiro with Kuromoji analyzer
const kuroshiro = new Kuroshiro();
(async () => {
    await kuroshiro.init(new KuromojiAnalyzer());

    // Example Japanese text
    const text = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！";

    console.log("Original text: ", text)

    // Convert text to hiragana
    console.log("Hiragana:", await kuroshiro.convert(text, { to: "hiragana" }));

    // Convert text to katakana
    console.log("Katakana:", await kuroshiro.convert(text, { to: "katakana" }));

    // Convert text to romaji using Hepburn system
    console.log("Romaji (Hepburn):", await kuroshiro.convert(text, { to: "romaji", romajiSystem: "hepburn" }));

    // Convert text to hiragana with okurigana mode
    console.log("Okurigana:", await kuroshiro.convert(text, { to: "hiragana", mode: "okurigana" }));

    // Convert text to hiragana with furigana mode
    console.log("Furigana:", await kuroshiro.convert(text, { to: "hiragana", mode: "furigana" }));

    // Utility functions
    const sampleChar = "あ";
    console.log(`Is "${sampleChar}" a Hiragana?`, Kuroshiro.Util.isHiragana(sampleChar));

    const sampleKanji = "感";
    console.log(`Is "${sampleKanji}" a Kanji?`, Kuroshiro.Util.isKanji(sampleKanji));

    const sampleString = "東京";
    console.log(`Does "${sampleString}" have Kanji?`, Kuroshiro.Util.hasKanji(sampleString));
})();
