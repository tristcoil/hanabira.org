const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const PORT = 5300;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // Logging HTTP requests

// MongoDB Connections
const videoDB = mongoose.createConnection('mongodb://localhost:27017/youtube-videos');

const textDB = mongoose.createConnection('mongodb://localhost:27017/japaneseTextsDB');

// Mongoose Schemas
const videoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    customTitle: { type: String, required: true },
    customDescription: { type: String, required: true },
    userid: { type: String, required: true },       
    p_tag: { type: String, required: true },        
    s_tag: { type: String, required: true },        
    lang: { type: String, required: true, default: 'jp' },
});

const textSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  sourceLink: { type: String, required: true },
  actualText: { type: String, required: true },
  p_tag: { type: String, required: true },
  s_tag: { type: String, required: true },
  userid: { type: String, required: true },
  lang: { type: String, required: true, default: 'jp' },
});

// Mongoose Models using their respective connections
const Video = videoDB.model('Video', videoSchema);
const Text = textDB.model('Text', textSchema);

// ----------------------------- Routes for Custom Videos ------------------------------ //

// Get all custom videos
app.get('/d-api/v1/custom-videos', async (req, res) => {
    console.log('Received GET request for /d-api/v1/custom-videos');
    try {
      const { userid, p_tag, s_tag, lang } = req.query;
      const filter = {};
  
      if (userid) filter.userid = userid;
      if (p_tag) filter.p_tag = p_tag;
      if (s_tag) filter.s_tag = s_tag;
      if (lang) filter.lang = lang;
  
      const videos = await Video.find(filter);
      console.log(`Sending ${videos.length} videos`);
      res.json(videos);
    } catch (err) {
      console.error('Error fetching videos:', err.message);
      res.status(500).json({ message: err.message });
    }
});
  
// Add a new custom video
app.post('/d-api/v1/custom-videos', async (req, res) => {
    console.log('Received POST request for /d-api/v1/custom-videos');
    const { url, customTitle, customDescription, userid, p_tag, s_tag, lang } = req.body;
  
    if (!url || !customTitle || !customDescription || !userid || !p_tag || !s_tag || !lang) {
      console.log('Missing required fields in POST request');
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const video = new Video({
      url,
      customTitle,
      customDescription,
      userid,
      p_tag,
      s_tag,
      lang,
    });
  
    try {
      const savedVideo = await video.save();
      console.log(`Saved new video: ${savedVideo._id}`);
      res.status(201).json(savedVideo);
    } catch (err) {
      console.error('Error saving video:', err.message);
      res.status(500).json({ message: err.message });
    }
});
  
// Delete a custom video by ID
app.delete('/d-api/v1/custom-videos/:id', async (req, res) => {
    console.log(`Received DELETE request for /api/custom-videos/${req.params.id}`);
    try {
      const deletedVideo = await Video.findByIdAndDelete(req.params.id);
      if (!deletedVideo) {
        console.log('Video not found');
        return res.status(404).json({ message: 'Video not found' });
      }
      console.log(`Deleted video: ${deletedVideo._id}`);
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (err) {
      console.error('Error deleting video:', err.message);
      res.status(500).json({ message: err.message });
    }
});

// ----------------------------- Routes for Custom Texts ------------------------------ //

// GET: Retrieve all texts
app.get('/d-api/v1/japanese-texts', async (req, res) => {
  try {
    const texts = await Text.find();
    res.json(texts);
  } catch (err) {
    console.error('Error fetching texts:', err.message);
    res.status(500).json({ message: 'Error fetching texts' });
  }
});

// POST: Create a new text entry
app.post('/d-api/v1/japanese-texts', async (req, res) => {
  const { topic, sourceLink, actualText, p_tag, s_tag, userid, lang } = req.body;

  if (!topic || !sourceLink || !actualText || !p_tag || !s_tag || !userid || !lang) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newText = new Text({
    topic,
    sourceLink,
    actualText,
    p_tag,
    s_tag,
    userid,
    lang,
  });

  try {
    const savedText = await newText.save();
    res.status(201).json(savedText);
  } catch (err) {
    console.error('Error saving text:', err.message);
    res.status(500).json({ message: 'Error saving text' });
  }
});

// DELETE: Delete a text entry by ID
app.delete('/d-api/v1/japanese-texts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedText = await Text.findByIdAndDelete(id);
    if (!deletedText) {
      return res.status(404).json({ message: 'Text not found' });
    }
    res.status(200).json({ message: 'Text deleted successfully' });
  } catch (err) {
    console.error('Error deleting text:', err.message);
    res.status(500).json({ message: 'Error deleting text' }); // Fixed typo here
  }
});

// --- //

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
