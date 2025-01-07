const log = require('../models/log');
const { createUser, authenticateUser } = require('../models/userModel');

exports.registerUser = (req, res) => {
    const { userId, userPassword, userPhone, userName } = req.body;
    createUser(userId, userPassword, userPhone, userName)
        .then(message => res.status(201).json({ message }))
        .catch(error => res.status(400).json({ error }));
};

exports.loginUser = (req, res) => {
    const { userId, userPassword } = req.body;
    authenticateUser(userId, userPassword)
        .then(message => res.status(200).json({ message }))
        .catch(error => res.status(400).json({ error }));
};