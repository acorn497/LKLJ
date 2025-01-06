const log = require('../models/log');
const { createUser, authenticateUser } = require('../models/userModel');

const registerUser = (req, res) => {
    const { userId, userPassword } = req.body;
    createUser(userId, userPassword)
        .then(message => res.status(201).json({ message }))
        .catch(error => res.status(400).json({ error }));
};

const loginUser = (req, res) => {
    const { userId, userPassword } = req.body;
    authenticateUser(userId, userPassword)
        .then(message => res.status(200).json({ message }))
        .catch(error => res.status(400).json({ error }));
};

module.exports = {
    registerUser,
    loginUser
};
