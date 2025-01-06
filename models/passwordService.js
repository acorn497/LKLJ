const bcrypt = require('bcrypt');

const hashPassword = (password) => {
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

const comparePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                reject(err);
            } else {
                resolve(isMatch);
            }
        });
    });
};

module.exports = {
    hashPassword,
    comparePassword
};
