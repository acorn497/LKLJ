const log = require('../services/log');
const { changePassword } = require('../models/passwordService');
const { createUser, authenticateUser } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key';

exports.registerUser = (req, res) => {
    const { userId, userPassword, userPhone, userName } = req.body;
    createUser(userId, userPassword, userPhone, userName)
        .then(message => res.status(201).json({ message }))
        .catch(error => res.status(400).json({ error }));
};

exports.loginUser = (req, res) => {
    const { userId, userPassword } = req.body;
    authenticateUser(userId, userPassword)
        .then(user => {
            const token = jwt.sign(
                { userId: user.userId, userName: user.userName },
                secretKey,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token
            });
        })
        .catch(error => res.status(400).json({ error }));
};

exports.changePassword = (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    changePassword(userId, oldPassword, newPassword)
        .then(message => res.status(200).json({ message }))
        .catch(error => res.status(400).json({ error }));
};
