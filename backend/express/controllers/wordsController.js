
const { Word } = require('../models/word');



const getAllWords = async (req, res) => {
  const words = await Word.find();

  //res.send('Hello World!')

  res.status(200).json({
    words,
  });
};

module.exports = { getAllWords };

