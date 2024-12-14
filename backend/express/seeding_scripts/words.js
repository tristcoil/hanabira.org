const fs = require('fs'); // import the 'fs' module
const path = require('path'); // import the 'path' module

const directory = './json_data'; // parent directory name
const prefix = 'words_'; // prefix for the files
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






// load only file called words.json
// const fs = require('fs'); // import the 'fs' module

// let data; // create an empty variable to store the data from the JSON file

// try {
//   // use the 'fs.readFileSync' method to read the contents of the 'words.json' file
//   // and assign the result to a variable 'jsonString'
//   const jsonString = fs.readFileSync('./json_data/words.json');

//   // use the 'JSON.parse' method to parse the contents of the jsonString variable as JSON
//   // and assign the result to the 'data' variable
//   data = JSON.parse(jsonString);
// } catch (err) {
//   // if an error occurs, log the error message to the console
//   console.error(err);
// }

// // export the 'data' variable so it can be used in other parts of your code
// module.exports = data;







// we need to take data from JSON external file
// old approach
// module.exports = [
//     {
//         vocabulary_japanese: "入場券",
//         vocabulary_simplified: "にゅうじょうけん",
//         vocabulary_english: "entrance ticket",
//         word_type: "Verb",
//         vocabulary_audio: "/audio/vocab/v_入場券.mp3",
//         p_tag: "JLPT_N3",
//         s_tag: "100",
//       },
//       {
//         vocabulary_japanese: "切る",
//         vocabulary_simplified: "[きる]",
//         vocabulary_english: "cut",
//         word_type: "Verb",
//         vocabulary_audio: "/audio/vocab/v_切る.mp3",
//         p_tag: "JLPT_N3",
//         s_tag: "100",
//       },
//       {
//         vocabulary_japanese: "楽しい",
//         vocabulary_simplified: "[たのしい]",
//         vocabulary_english: "fun, enjoyable",
//         word_type: "Adjective",
//         vocabulary_audio: "/audio/vocab/v_楽しい.mp3",
//         p_tag: "JLPT_N3",
//         s_tag: "100",
//       },
//     // more words
// ]
