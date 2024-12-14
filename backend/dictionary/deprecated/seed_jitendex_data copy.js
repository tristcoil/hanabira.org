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
        console.log("Proceeding to import without dropping collection due to error.");
    }

    startImport();
}

// Ensure startImport is also properly defined as an async function if it performs any asynchronous operations.


// function startImport() {
//   const directoryPath = path.join(__dirname, 'jitendex_json_data');
//   console.log(`Reading the directory: ${directoryPath}`);
//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       console.error("Could not list the directory.", err);
//       console.log("Closing connection due to error listing directory.");
//       mongoose.connection.close();
//       return;
//     }
//     // there is just licence info in the index.json
//     //const jsonFiles = files.filter(file => path.extname(file) === '.json');
//     const jsonFiles = files.filter(file => 
//       path.extname(file) === '.json' && path.basename(file) !== 'index.json'
//     );
    

//     console.log(`Found ${jsonFiles.length} JSON files to process.`);
//     if (jsonFiles.length === 0) {
//       console.log("No JSON files found, closing connection.");
//       mongoose.connection.close();
//       return;
//     }

//     jsonFiles.forEach((file, index) => {
//       const filePath = path.join(directoryPath, file);
//       console.log(`Reading file: ${filePath}`);
      
//       fs.readFile(filePath, 'utf8', (err, fileContents) => {
//         if (err) {
//           console.error(`Error reading file ${file}:`, err);
//           return;
//         }
//         try {
//           console.log(`Parsing data from file: ${file}`);
//           const data = JSON.parse(fileContents);
//           if (!Array.isArray(data) || !data.length) {
//             console.error(`Skipping empty or invalid data in file: ${file}`);
//             return;
//           }
//           console.log(`Inserting data from file: ${file}`);
//           Entry.insertMany(data)
//             .then(() => console.log(`${file} imported successfully.`))
//             .catch(error => console.error('Failed to import data:', error))
//             .finally(() => {
//               if (index === jsonFiles.length - 1) {
//                 console.log("All files processed, closing connection.");
//                 mongoose.connection.close();
//               }
//             });
//         } catch (parseError) {
//           console.error(`Error parsing JSON from file ${file}:`, parseError);
//         }
//       });


//     });
//   });
// }



function startImport() {
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

    jsonFiles.forEach((file, index) => {
      const filePath = path.join(directoryPath, file);
      console.log(`Reading file: ${filePath}`);
      
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        console.log(`Parsing data from file: ${file}`);
        const data = JSON.parse(fileContents);
        if (!Array.isArray(data) || !data.length) {
          console.error(`Skipping empty or invalid data in file: ${file}`);
          return;
        }
        console.log(`Inserting data from file: ${file}`);
        Entry.insertMany(data)
          .then(() => console.log(`${file} imported successfully.`))
          .catch(error => console.error('Failed to import data:', error))
          .finally(() => {
            if (index === jsonFiles.length - 1) {
              console.log("All files processed, closing connection.");
              mongoose.connection.close();
            }
          });
      } catch (err) {
        console.error(`Error reading or parsing file ${file}:`, err);
      }
    });
  } catch (err) {
    console.error("Could not list the directory.", err);
    console.log("Closing connection due to error listing directory.");
    mongoose.connection.close();
  }
}

















