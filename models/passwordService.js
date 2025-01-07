const db = require('../services/db');
const bcrypt = require('bcrypt');
const log = require('../services/log');

exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                reject(err);
            } else {
                resolve(hashedPassword);
            }
        });
    });
};

exports.comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
        .catch(err => {
            throw new Error('Error comparing passwords: ' + err.message);
        });
};

exports.changePassword = (userId, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        log(`Changing password for user: ${userId}`);

        const query = 'SELECT userPassword FROM users WHERE userId = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                log("Error at 1", 3);
                reject(new Error('Database error during user password check.'));
                return;
            }

            if (results.length === 0) {
                log(`User not found: ${userId}`, 3);
                reject(new Error('User not found.'));
                return;
            }

            const currentHashedPassword = results[0].userPassword;

            exports.comparePassword(oldPassword, currentHashedPassword)
                .then(isMatch => {
                    if (!isMatch) {
                        log(`Password mismatch for user: ${userId}`, 3);
                        reject(new Error('Old password does not match.'));
                    } else {
                        exports.hashPassword(newPassword)
                            .then(hashedPassword => {
                                const updateQuery = 'UPDATE users SET userPassword = ? WHERE userId = ?';
                                db.query(updateQuery, [hashedPassword, userId], (err, result) => {
                                    if (err) {
                                        log("Error at 3", 3);
                                        reject(new Error('Database error during password update.'));
                                    } else {
                                        log(`Password updated successfully for user: ${userId}`, 1);
                                        resolve('Password updated successfully');
                                    }
                                });
                            })
                            .catch(err => {
                                log("Error at 4", 3);
                                reject(new Error('Error during password hashing.'));
                            });
                    }
                })
                .catch(err => {
                    log("Error at 5", 3);
                    reject(new Error('Error comparing passwords.'));
                });
        });
    });
};