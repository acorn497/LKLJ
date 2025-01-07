const express = require('express');
const pageController = require('../controllers/pageController');
const router = express.Router();

// Route for home page
router.get('/', pageController.renderHomePage);

module.exports = router;
