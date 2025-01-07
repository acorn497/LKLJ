const db = require('../services/db');
const log = require('../services/log');
const { hashPassword, comparePassword } = require('./passwordService');

const createUser = (userId, userPassword, userPhone = '', userName = '') => {
    return new Promise((resolve, reject) => {
        log(`Creating new user: ${userId}, ${userPassword}, ${userPhone}, ${userName}`, 2);
        if (!userId || !userPassword) {
            log('ID or Password is missing', 3);
            reject(new Error('ID or Password is missing.'));
            return;
        }

        const queryCheck = 'SELECT COUNT(*) AS count FROM users WHERE userId = ?';
        db.query(queryCheck, [userId], (err, results) => {
            if (err) {
                log(err, 3);
                reject(new Error('Database error during user check.'));
                return;
            }

            if (results[0].count > 0) {
                log(`Existing ID`, 3);
                reject(new Error('ID already exists.'));
            } else {
                hashPassword(userPassword)
                    .then(hashedPassword => {
                        const queryInsert = 'INSERT INTO users (userId, userPassword, userPhone, userName) VALUES (?, ?, ?, ?)';
                        db.query(queryInsert, [userId, hashedPassword, userPhone, userName], (err, result) => {
                            if (err) {
                                log(err, 3);
                                reject(new Error('Database error during user creation.'));
                            } else {
                                log(`Created new user`, 1);
                                resolve('User created successfully');
                            }
                        });
                    })
                    .catch(err => {
                        log(err, 3);
                        reject(new Error('Error during password hashing.'));
                    });
            }
        });
    });
};


const authenticateUser = (userId, userPassword) => {
    return new Promise((resolve, reject) => {
        log(`Logging in: ${userId}, ${userPassword}`);
        let query = 'SELECT userPassword FROM users WHERE userId = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length === 0) {
                    reject("User not found");
                } else {
                    comparePassword(userPassword, results[0].userPassword)
                        .then(isMatch => {
                            if (isMatch) {
                                log(`Authentication successful: ${userId}`, 1);
                                resolve("Authentication successful");
                            } else {
                                log(`Authentication failed: ${userId}`, 3);
                                reject("Incorrect password");
                            }
                        })
                        .catch(err => reject(err));
                }
            }
        });
    });
};

module.exports = {
    createUser,
    authenticateUser
};