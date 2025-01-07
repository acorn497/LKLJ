const express = require('express');
const { getFestList, getSearchFestList, postComment } = require('../controllers/dataController');
const router = express.Router();

router.get('/getFestList', getFestList);
router.get('/getSearchFestList', getSearchFestList);
router.post('/postComment', postComment);

module.exports = router;