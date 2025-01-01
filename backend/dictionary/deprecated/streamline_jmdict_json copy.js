const fs = require('fs');
const path = require('path');

// Specify the input and output directories
const inputDir = path.join(__dirname, 'jmdict_json_data_testing'); // Adjust this to your actual path
const outputDir = path.join(__dirname, 'simplified_json_data');

// File names (example)
const inputFile = 'term_bank_2.json'; // This should be your actual input file name
const outputFile = 'simplified_data.json';

// Read the original JSON file
fs.readFile(path.join(inputDir, inputFile), 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    // Parse the original JSON data
    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error("Error parsing JSON data:", parseErr);
        return;
    }

    // Create simplified data structure
    const simplifiedData = jsonData.map(entry => {
        return {
            expression: entry[0],
            reading: entry[1],
            type: entry[2],
            meanings: entry[5]
        };
    });

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    // Write the simplified data to a new JSON file
    fs.writeFile(path.join(outputDir, outputFile), JSON.stringify(simplifiedData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error("Error writing the simplified JSON data:", writeErr);
            return;
        }
        console.log("Simplified JSON data has been written successfully to", outputFile);
    });
});
