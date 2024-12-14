const express = require('express');
const { getAllWords } = require('../controllers/wordsController');


const router = express.Router();

router.route('/').get(getAllWords);

//router.route('/save').post(saveFileAsMp3);

//export default router;
module.exports = { router };
