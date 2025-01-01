const fs = require('fs'); // import the 'fs' module
const path = require('path'); // import the 'path' module

const directory = './json_data'; // parent directory name
const prefix = 'sentences_'; // prefix for the files
const suffix = '.json'; // suffix for the files

let data = []; // create an empty array to store the data from all the JSON files

try {
    // use the 'fs.readdirSync' method to read all files in the directory
    const files = fs.readdirSync(`./${directory}/`);

    // use forEach loop to iterate through the files
    files.forEach((file) => {
        // only process files that match the naming convention 'words_*.json'
        if (path.basename(file).startsWith(prefix) && path.extname(file) === suffix) {
            // use the 'fs.readFileSync' method to read the contents of the file
            // and assign the result to a variable 'jsonString'
            const jsonString = fs.readFileSync(`./${directory}/${file}`);

            // use the 'JSON.parse' method to parse the contents of the jsonString variable as JSON
            // and push the result to the 'data' array
            data.push(...JSON.parse(jsonString));
        }
    });
} catch (err) {
    // if an error occurs, log the error message to the console
    console.error(err);
}

// export the 'data' variable so it can be used in other parts of your code
module.exports = data;







// load only file called sentences.json
// const fs = require('fs'); // import the 'fs' module

// let data; // create an empty variable to store the data from the JSON file

// try {
//   // use the 'fs.readFileSync' method to read the contents of the 'words.json' file
//   // and assign the result to a variable 'jsonString'
//   const jsonString = fs.readFileSync('./json_data/sentences.json');

//   // use the 'JSON.parse' method to parse the contents of the jsonString variable as JSON
//   // and assign the result to the 'data' variable
//   data = JSON.parse(jsonString);
// } catch (err) {
//   // if an error occurs, log the error message to the console
//   console.error(err);
// }

// // export the 'data' variable so it can be used in other parts of your code
// module.exports = data;






//old approach
// module.exports = [
//     {
//         sentence_original: "入場券は3000円です。",
//         sentence_simplified: "にゅうじょう けん は 3000 えん です。",
//         sentence_english: "The admission ticket is 3,000 yen.",
//         sentence_audio: "/audio/sentences/s_入場券_20230121_入場券は3000円です.mp3",
//         sentence_picture: "/assets/3.jpg",
//         key: "入場券",
//       },
//       {
//         sentence_original: "入場券をお持ちですか。",
//         sentence_simplified: "にゅうじょう けん を おもち です か。",
//         sentence_english: "Do you have an admission ticket?",
//         sentence_audio:
//           "/audio/sentences/s_入場券_20230121_入場券をお持ちですか.mp3",
//         sentence_picture: "/assets/3.jpg",
//         key: "入場券",
//       },
//       {
//         sentence_original: "この紙を半分に切ってください。",
//         sentence_simplified: "この かみ を はんぶん に きって ください",
//         sentence_english: "Please cut this paper in half.",
//         sentence_audio:
//           "/audio/sentences/s_切る_20230121_この紙を半分に切ってください.mp3",
//         sentence_picture: "/assets/1.jpg",
//         key: "切る",
//       },
//       {
//         sentence_original: "昨日、髪を切りました。",
//         sentence_simplified: "きのう、かみ を きりました",
//         sentence_english: "I had my hair cut yesterday.",
//         sentence_audio: "/audio/sentences/s_切る_20230121_昨日髪を切りました.mp3",
//         sentence_picture: "/assets/3.jpg",
//         key: "切る",
//       },
//       {
//         sentence_original: "彼はとても楽しい人です。",
//         sentence_simplified: "かれ は とても たのしい ひと です。",
//         sentence_english: "He's a very fun person.",
//         sentence_audio:
//           "/audio/sentences/s_楽しい_20230121_彼はとても楽しい人です.mp3",
//         sentence_picture: "/assets/2.jpg",
//         key: "楽しい",
//       },
//       {
//         sentence_original: "日本での生活は楽しいです。",
//         sentence_simplified: "にほん で の せいかつ は たのしい です",
//         sentence_english: "Life in Japan is fun.",
//         sentence_audio:
//           "/audio/sentences/s_楽しい_20230121_日本での生活は楽しいです.mp3",
//         sentence_picture: "/assets/4.jpg",
//         key: "楽しい",
//       },
//       {
//         sentence_original: "私たちの旅は始めはよかったんだ。",
//         sentence_simplified: "わたし たち の たび は はじめ は よかった ん だ。",
//         sentence_english: "The initial part of our trip was good.",
//         sentence_audio:
//           "/audio/sentences/s_楽しい_20230121_私たちの旅は始めはよかったんだ.mp3",
//         sentence_picture: "/assets/4.jpg",
//         key: "楽しい",
//       },
//     // more sentences
// ]
