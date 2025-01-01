const fs = require('fs');
const path = require('path');

// Specify the input and output directories
const inputDir = path.join(__dirname, 'jmdict_json_data_testing'); // Adjust this to your actual path
const outputDir = path.join(__dirname, 'simplified_json_data');

// File names (example)
const inputFile = 'term_bank_2.json'; // This should be your actual input file name
const outputFile = 'simplified_data.json';



// Read and process the original JSON file
fs.readFile(path.join(inputDir, inputFile), 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    // Parse the JSON data
    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error("Error parsing JSON data:", parseErr);
        return;
    }

    // Create simplified data structure, excluding entries with type "forms"
    const simplifiedData = jsonData.filter(entry => entry[2] !== "forms").map(entry => ({
        expression: entry[0],
        reading: entry[1],
        type: entry[2],
        meanings: extractMeanings(entry[5])
    }));



    // Write the simplified data to a new JSON file
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }
    fs.writeFile(path.join(outputDir, outputFile), JSON.stringify(simplifiedData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error("Error writing the simplified JSON data:", writeErr);
            return;
        }
        console.log("Simplified JSON data has been written successfully.");
    });
});



function extractMeanings(contentArray) {
    let meanings = [];

    // Ensure that the contentArray itself is properly formatted
    if (!Array.isArray(contentArray)) {
        console.error('Meanings content is not an array:', contentArray);
        return meanings;
    }

    contentArray.forEach(contentItem => {
        if (contentItem.type === 'structured-content' && contentItem.content) {
            // Check if content is an array before iterating
            if (Array.isArray(contentItem.content)) {
                contentItem.content.forEach(item => {
                    if (item.data && item.data.content === "glossary" && item.content) {
                        // Ensure the item's content is an array before mapping
                        if (Array.isArray(item.content)) {
                            meanings.push(...item.content.map(li => li.content));
                        } else {
                            console.error('Expected an array of items:', item.content);
                        }
                    }
                });
            } else {
                console.error('Structured contentItem.content is not an array:', contentItem.content);
            }
        } else if (typeof contentItem === 'string') {
            // Simple string meanings that are not in a structured-content object
            meanings.push(contentItem);
        }
    });

    return meanings;
}

