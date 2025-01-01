// server.js

// --- Imports --- //
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");

// Load config
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

// --- Initialize App --- //
const app = express();
const PORT = process.env.PORT || 5200;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB (adjust the URI as needed)
mongoose.connect("mongodb://localhost:27017/jmdictDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- Mount Routes --- //

// Each module file exports a router
app.use("/d-api/v1", require("./server_modules/mecab-logic"));
// app.use("/d-api/v1", require("./server_modules/deepl-logic"));
// app.use("/d-api/v1", require("./server_modules/dictionary-logic"));
// app.use("/d-api/v1", require("./server_modules/kanji-logic"));
// app.use("/d-api/v1", require("./server_modules/kuroshiro-logic"));
// app.use("/d-api/v1", require("./server_modules/radicals-logic"));
// app.use("/d-api/v1", require("./server_modules/gpt-logic"));
// app.use("/d-api/v1", require("./server_modules/subtitles-logic"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
