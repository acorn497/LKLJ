const db = require('./db');
const log = require('./log');
const { hashPassword, comparePassword } = require('./passwordService');

const createUser = (userId, userPassword, userPhone, userName) => {
    return new Promise((resolve, reject) => {
        log(`Creating new user: ${userId}, ${userPassword}, ${userPhone}, ${userName}`, 2);
        if (!userId || !userPassword) {
            log('ID or password is missing', 3);
            reject(new Error('UserId or UserPassword is missing.'));
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
                                resolve("Authentication successful");
                            } else {
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