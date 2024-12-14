const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const mongoDB = 'mongodb://localhost:27017/jmdictDatabase';
console.log("Attempting to connect to MongoDB...");
mongoose.connect(mongoDB).then(() => {
  console.log('Connected to the database successfully.');
  seedDatabase();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const EntrySchema = new mongoose.Schema({
  expression: String,
  reading: String,
  type: String,
  meanings: [String]
});

const Entry = mongoose.model('Entry', EntrySchema);

const inputDir = path.join(__dirname, 'jmdict_json_data_simplified');

async function seedDatabase() {
  fs.readdir(inputDir, async (err, files) => {
    if (err) {
      console.error("Error reading input directory:", err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(inputDir, file);

      // Check if it is a directory
      const stats = fs.lstatSync(filePath);
      if (stats.isDirectory()) {
        console.log(`Skipping directory: ${filePath}`);
        continue;
      }

      // Process only JSON files
      if (file.endsWith('.json')) {
        await processFile(filePath);
      } else {
        console.log(`Skipping non-JSON file: ${filePath}`);
      }
    }
    
    console.log("--- All files processed, closing connection. ---");
    mongoose.connection.close();
  });
}

async function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const entries = JSON.parse(fileContents);

    await Entry.insertMany(entries);
    console.log(`Data from ${filePath} inserted successfully.`);
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
  }
}













// ---------------------- //


// // infinite failed db seeding loop in container ------//
// const mongoose = require('mongoose');
// const fs = require('fs');
// const path = require('path');

// // MongoDB connection
// const mongoDB = 'mongodb://localhost:27017/jmdictDatabase';
// console.log("Attempting to connect to MongoDB...");
// mongoose.connect(mongoDB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to the database successfully.');
//   seedDatabase();
// }).catch(err => {
//   console.error('Error connecting to MongoDB:', err);
// });

// // Define the schema for the entries
// const EntrySchema = new mongoose.Schema({
//   expression: String,
//   reading: String,
//   type: String,
//   meanings: [String]
// });

// const Entry = mongoose.model('Entry', EntrySchema);

// // Directory containing the simplified JSON files
// const inputDir = path.join(__dirname, 'jmdict_json_data_simplified');

// async function seedDatabase() {
//   fs.readdir(inputDir, async (err, files) => {
//     if (err) {
//       console.error("Error reading input directory:", err);
//       return;
//     }

//     for (const file of files) {
//       if (file.endsWith('.json')) {
//         await processFile(path.join(inputDir, file));
//       }
//     }
//     console.log("--- All files processed, closing connection. ---");
//     mongoose.connection.close();
//   });
// }

// async function processFile(filePath) {
//   console.log(`Processing file: ${filePath}`);
//   try {
//     const fileContents = fs.readFileSync(filePath, 'utf8');
//     const entries = JSON.parse(fileContents);

//     // Insert the entries into the MongoDB database
//     await Entry.insertMany(entries);
//     console.log(`Data from ${filePath} inserted successfully.`);
//   } catch (err) {
//     console.error(`Error processing file ${filePath}:`, err);
//   }
// }
