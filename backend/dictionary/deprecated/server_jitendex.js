const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const port = 5200;



app.use(cors()); // This will allow all CORS requests


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/jitendexDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define the schema and model for the vocabulary entries
const entrySchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed  // Mixed type for flexible data structure
});
const Entry = mongoose.model('Entry', entrySchema);


// Nkf is a yet another kanji code converter among networks, hosts and terminals.  It converts input
// kanji code to designated kanji code such as ISO-2022-JP, Shift_JIS, EUC-JP, UTF-8, UTF-16 or
// UTF-32.


// curl http://localhost:5200/vocabulary/$(echo -n '寿司屋' | nkf -WwMQ | tr = %)
// curl http://localhost:5200/vocabulary/$(echo -n '焼酒' | nkf -WwMQ | tr = %)
// curl http://localhost:5200/vocabulary/$(echo -n '感じ' | nkf -WwMQ | tr = %)

// API endpoint to get a vocabulary entry by the first element in the 'data' array
app.get('/vocabulary/:word', async (req, res) => {
  // Decode the URI component to handle non-ASCII characters like Kanji
  const word = decodeURIComponent(req.params.word);
  console.log(`Searching for the word: ${word}`);
  try {
    const result = await Entry.findOne({ '0': word });
    
    console.log(`DB query result: ${result}`);

    //const result = await Entry.findOne({ '2': '' });
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).send(`Word not found: ${word}`);
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ---

// curl http://localhost:5200/simple-vocabulary/$(echo -n '寿司屋' | nkf -WwMQ | tr = %)
// {"original":"寿司屋","hiragana":"すしや","englishTranslations":["sushi shop","sushi restaurant","sushi bar"]} 
app.get('/simple-vocabulary/:word', async (req, res) => {
  const word = decodeURIComponent(req.params.word);
  console.log(`Searching for the simplified entry of the word: ${word}`);
  try {
    ///////const result = await Entry.findOne({ '0': word });
   
    let result='xxx'
    if (result) {
      // Convert Mongoose document to a plain JavaScript object
      ////////const plainResult = result.toObject();

      // Now you can safely log and access properties like a normal object
      /////////console.log(plainResult['0']); // This should now definitely work


      // jitendex is too complex, we should use just jmdic for simple translations

      // 寿司屋
      // for single meaning
      ///////////const englishTranslations = plainResult['5'][0].content[0].content[1].content[0].content.map(item => item.content);
      
      // 犬
      // multiple meanings (has different json format)
      // contains "sense-number" key in payload

      // const simplifiedResult = {
      //   original: plainResult['0'],
      //   hiragana: plainResult['1'],
      //   englishTranslations: englishTranslations
      // };

      const simplifiedResult = {
        original: 'xxx',
        hiragana: 'xxx',
        englishTranslations: ['xxx', 'xxx', 'xxx']
      };



      res.json(simplifiedResult);
    } else {
      res.status(404).send(`Word not found: ${word}`);
    }
  } catch (error) {
    console.error('Error retrieving simplified data:', error);
    res.status(500).send('Internal Server Error');
  }
});





// ---

app.get('/elements', async (req, res) => {
  try {
    // Query for entries, projecting only the '0' and '1' fields
    const results = await Entry.find({}, {'0': 1, '1': 1});
    console.log('Database results:', results); // Debugging: log raw results from DB

    res.json(results);

  } catch (error) {
    console.error('Error retrieving elements:', error);
    res.status(500).send('Internal Server Error');
  }
});












// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




















// -------------------------------------------------


// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const port = 5200;


// // example call 
// // curl http://localhost:5200/vocabulary/焼酒


// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/yourDatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('Connected to MongoDB successfully'))
//   .catch(err => console.error('Failed to connect to MongoDB:', err));

// // Define the schema and model for the vocabulary entries
// const entrySchema = new mongoose.Schema({
//   data: mongoose.Schema.Types.Mixed  // Mixed type for flexible data structure
// });
// const Entry = mongoose.model('Entry', entrySchema);

// // API endpoint to get a vocabulary entry by the first element in the 'data' array
// app.get('/vocabulary/:word', async (req, res) => {
//   const word = req.params.word;
//   try {
//     console.log(`Searching for the word: ${word}`);
//     // Adjusted to match the first word being stored under key '0'
//     const result = await Entry.findOne({ 'data.0': word });
//     if (result) {
//       res.json(result);
//     } else {
//       res.status(404).send(`Word not found: ${word}`);
//     }
//   } catch (error) {
//     console.error('Error retrieving data:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });







// --- //

// curl http://localhost:5200/vocabulary

// Endpoint to get all entries in the collection
// app.get('/vocabulary', async (req, res) => {
//   try {
//     console.log("Fetching all entries from the database...");
//     const results = await Entry.find({});
//     if (results.length > 0) {
//       res.json(results);
//     } else {
//       res.status(404).send('No entries found');
//     }
//   } catch (error) {
//     console.error('Error retrieving all entries:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // --- //

// // curl http://localhost:5200/vocabulary/first-two


// // Endpoint to get the first two entries in the collection
// app.get('/vocabulary/first-two', async (req, res) => {
//   try {

    
//     console.log("Fetching the first two entries from the database...");
//     //const results = await Entry.find({}).limit(2);
//     const results = await Entry.find({});
//     console.log("Query executed, results:", results);

    
//     if (results.length > 0) {
//       res.json(results);
//     } else {
//       res.status(404).send('No entries found');
//     }


//   } catch (error) {
//     console.error('Error retrieving first two entries:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


