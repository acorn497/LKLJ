const db = require('./db');
const log = require('./log');
const { hashPassword, comparePassword } = require('./passwordService');

const createUser = (userId, userPassword) => {
    return new Promise((resolve, reject) => {
        log(`Creating new user: ${userId}, ${userPassword}`, 2);
        if (userId == null || userPassword == null) {
            log('ID or password is missing', 3);
            reject(new Error('UserId or UserPassword is missing.'));
            return;        
        }
        let query = 'SELECT COUNT(*) AS count FROM users WHERE userId = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results[0].count > 0) {
                    log(`Existing ID`, 3);
                    reject("ID is already exists");
                } else {
                    hashPassword(userPassword)
                        .then(hashedPassword => {
                            query = 'INSERT INTO users (userId, userPassword) VALUES (?, ?)';
                            db.query(query, [userId, hashedPassword], (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    log(`Created new user`, 1);   
                                    resolve("User created successfully");

                                }
                            });
                        })
                        .catch(err => reject(err));
                }
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