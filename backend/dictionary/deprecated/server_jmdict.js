const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set the port and start the server
const PORT = process.env.PORT || 5200;


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jmdictDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(cors()); // Enable CORS

// Define the schema and model
const entrySchema = new mongoose.Schema({
  expression: String,
  reading: String,
  type: String,
  meanings: [String]
}, { collection: 'entries' });

const Entry = mongoose.model('Entry', entrySchema);


// curl http://localhost:5200/simple-vocabulary/$(echo -n '寿司屋' | nkf -WwMQ | tr = %)
// {"original":"寿司屋","hiragana":"すしや","englishTranslations":["sushi shop","sushi restaurant","sushi bar"]} 

// Route to get vocabulary
app.get('/simple-vocabulary/:expression', async (req, res) => {
  const expression = decodeURIComponent(req.params.expression);
  console.log(expression)

  try {
    const result = await Entry.findOne({ expression: expression });

    if (!result) {
      return res.status(404).json({ message: "Word not found" });
    }

    // Structure the output to match expected format
    const response = {
      original: result.expression,
      hiragana: result.reading,
      englishTranslations: result.meanings
    };

    res.json(response);
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
