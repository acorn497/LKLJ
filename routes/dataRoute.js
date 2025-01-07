const express = require('express');
const { getSearchFestList, postComment } = require('../controllers/dataController');
const router = express.Router();

router.post('/getSearchFestList', getSearchFestList);
router.post('/postComment', postComment);

module.exports = router;