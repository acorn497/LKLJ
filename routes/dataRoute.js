const express = require('express');
const { getFestList, getSearchFestList } = require('../controllers/dataController');
const router = express.Router();

router.get('/getFestList', getFestList);
router.get('/getSearchFestList', getSearchFestList);

module.exports = router;