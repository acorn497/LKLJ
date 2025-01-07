const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/changePassword', authenticateToken, changePassword);

module.exports = router;
