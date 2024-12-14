const fs = require('fs');
const path = require('path');

// Specify the input and output directories
const inputDir = path.join(__dirname, 'jmdict_json_data'); // Adjust this to your actual path
const outputDir = path.join(__dirname, 'jmdict_json_data_simplified');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

// Read all files in the input directory
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error("Error reading input directory:", err);
        return;
    }

    files.forEach(file => {
        if (file !== 'index.json' && file !== 'tag_bank_1.json' && path.extname(file) === '.json') {
            processFile(path.join(inputDir, file));
        }
    });
});

function processFile(filePath) {
    const fileName = path.basename(filePath);
    const outputFile = path.join(outputDir, `simplified_${fileName}`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${filePath}`, err);
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
        fs.writeFile(outputFile, JSON.stringify(simplifiedData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(`Error writing the simplified JSON data to file: ${outputFile}`, writeErr);
                return;
            }
            console.log(`Simplified JSON data has been written successfully to ${outputFile}.`);
        });
    });
}

function extractMeanings(contentArray) {
    let meanings = [];

    // Ensure that the contentArray itself is properly formatted
    if (!Array.isArray(contentArray)) {
        console.error('Meanings content is not an array:', contentArray);
        return meanings;
    }

    contentArray.forEach(contentItem => {
        if (contentItem.type === 'structured-content' && contentItem.content) {
            if (Array.isArray(contentItem.content)) {
                contentItem.content.forEach(item => {
                    if (item.data && item.data.content === "glossary" && item.content) {
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
            meanings.push(contentItem);
        }
    });

    return meanings;
}
