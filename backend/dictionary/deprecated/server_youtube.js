const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const cors = require("cors");
const he = require('he');

const port = process.env.PORT || 8000; // Set port from environment variable or default to 3000

const app = express();
app.use(cors({ origin: "*" })); // Enable CORS for all origins


// curl -X GET "http://localhost:8000/d-api/v1/get-transcript?url=https://www.youtube.com/watch?v=mjzZ5i9i2rY&lang=jp"
// bite size japanese does not have english subtitles, so it gives japanese by default even when we ask for english
// he - html entities fixes issues like: It&amp;#39;s -> It's
// well we have issues parsing the incoming text, but the he library itself looks fine
//> console.log(he.decode("I&#39;m Akane from Akane Japanese Language Class."));
//I'm Akane from Akane Japanese Language Class.
//undefined
//>
// we can tshoot this later 
app.get("/d-api/v1/get-transcript", async (req, res) => {
  const videoUrl = req.query.url;
  const lang = req.query.lang || "ja"; // Default to Japanese if no language is specified

  if (!videoUrl) {
    return res.status(400).send("Missing video URL parameter");
  }

  try {
    console.log(`fetching transcript for youtube video: ${videoUrl} in language: ${lang}`);

    const transRes = await YoutubeTranscript.fetchTranscript(videoUrl, {
      lang: lang, // Use the language code specified in the query parameter
    });

    console.log('*** TRANS RES ***');
    console.log(transRes);


    // Decode HTML entities in the transcript
    const decodedTranscript = await transRes.map(entry => ({
      ...entry,
      text: he.decode(entry.text)
      //text: "LOLOLOL"   // this worked fine, keep in mind you have subtitles stored in Local Storage
    }));


    console.log('*** HE DECODED TRANSCRIPT ***');
    console.log(decodedTranscript);

    console.log("fetched transcript successfully");

    res.status(200).json({ status: "success", transcript: decodedTranscript });
  } catch (error) {
    console.error("Error fetching transcript:", error);

    res.status(500).send("Error fetching transcript");
  }
});






//console.log("Test decoding:", he.decode("I&#39;m Akane from Akane Japanese Language Class."));




// --- //

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
