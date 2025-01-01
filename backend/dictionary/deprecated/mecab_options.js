// Import the mecab-async module
const MeCab = require('mecab-async');
const mecab = new MeCab();


// expected payload, we just need wakachi, original and reading
// maybe kanji can be useful
// mecab.parser = data => {
//    kanji         : data[0],
//    lexical       : data[1],
//    compound      : data[2],
//    compound2     : data[3],
//    compound3     : data[4],
//    conjugation   : data[5],
//    inflection    : data[6],
//    original      : data[7],
//    reading       : data[8],
//    pronunciation : data[9] || ''
// };


// wakachi is super useful, it just splits the sentence by words
// Wakachi tokenization result: [
//    '日本',   'の',
//    '四季',   'は',
//    '非常に', '美しい',
//    'です',   '。'
//  ]


// we could just make some modification and easily create payload with furigana
// then we could send it to backend for payload extension (known/unknown)






// Hardcoded Japanese sentence
//const sentence = '日本の四季は非常に美しいです。';

// sentence with word NOT in dictionary form
//const sentence = '彼は新しい仕事に挑戦しています。';

// sentence with word NOT in dictionary form
const sentence = '彼女はまったく遅れていない。';


// Wakachi (tokenization)
mecab.wakachi(sentence, function(err, result) {
    if (err) throw err;
    console.log('Wakachi tokenization result:', result);
});

// Asynchronous parse
mecab.parse(sentence, function(err, result) {
    if (err) throw err;
    console.log('Asynchronous parse result:', result);
});

// Synchronous functions
try {
    const syncParseResult = mecab.parseSync(sentence);
    console.log('Synchronous parse result:', syncParseResult);
} catch (err) {
    console.error('Error during synchronous parsing:', err);
}

try {
    const syncWakachiResult = mecab.wakachiSync(sentence);
    console.log('Synchronous wakachi result:', syncWakachiResult);
} catch (err) {
    console.error('Error during synchronous wakachi:', err);
}
