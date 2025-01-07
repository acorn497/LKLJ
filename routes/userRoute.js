const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/changePassword', changePassword)

module.exports = router;
