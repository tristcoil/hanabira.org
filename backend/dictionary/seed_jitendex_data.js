const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const mongoDB = 'mongodb://localhost:27017/jitendexDatabase';
console.log("Attempting to connect to MongoDB...");
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to the database successfully.');
  checkAndDropCollection();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const Entry = mongoose.model('Entry', new mongoose.Schema({}, { strict: false }));

async function checkAndDropCollection() {
    console.log("Checking if the 'entries' collection exists...");
    try {
        const collections = await mongoose.connection.db.listCollections({ name: 'entries' }).toArray();
        if (collections.length > 0) {
            console.log("'entries' collection exists. Attempting to drop collection...");
            await mongoose.connection.db.dropCollection('entries');
            console.log("Collection dropped successfully.");
        } else {
            console.log("Collection doesn't exist, starting import.");
        }
    } catch (err) {
        console.error("Error during collection operation:", err);
    }

    startImport();
}

async function startImport() {
  const directoryPath = path.join(__dirname, 'jitendex_json_data');
  console.log(`Reading the directory: ${directoryPath}`);
  
  try {
    const files = fs.readdirSync(directoryPath);
    const jsonFiles = files.filter(file => 
      path.extname(file) === '.json' && path.basename(file) !== 'index.json'
    );

    console.log(`Found ${jsonFiles.length} JSON files to process.`);
    if (jsonFiles.length === 0) {
      console.log("No JSON files found, closing connection.");
      mongoose.connection.close();
      return;
    }

    for (const file of jsonFiles) {
      await processFile(path.join(directoryPath, file));
    }
    console.log("--- All files processed, closing connection. ---");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error during directory reading or file processing:", err);
    mongoose.connection.close();
  }
}

async function processFile(filePath) {
  console.log(`Reading file: ${filePath}`);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    if (!Array.isArray(data) || !data.length) {
      console.error(`Skipping empty or invalid data in file: ${filePath}`);
      return;
    }
    console.log(`Inserting data from file: ${filePath}`);
    await Entry.insertMany(data);
    console.log(`${path.basename(filePath)} imported successfully.`);
  } catch (err) {
    console.error(`Error reading or parsing file ${filePath}:`, err);
  }
}
