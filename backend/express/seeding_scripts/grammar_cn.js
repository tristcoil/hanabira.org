const fs = require('fs'); // import the 'fs' module
const path = require('path'); // import the 'path' module

const directory = './json_data'; // parent directory name
const prefix = 'grammar_cn_'; // prefix for the files
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

//console.log(data)
// export the 'data' variable so it can be used in other parts of your code
module.exports = data;
