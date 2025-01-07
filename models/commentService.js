const db = require('../services/db');
const log = require('../services/log');

exports.postComment = (content, userId, shopId) => {
    return new Promise((resolve, reject) => {
        log(`Posting new comment: ${userId}, ${content}`);
        const query = `INSERT INTO comment (userId, shopId, content) VALUES (?, ?, ?)`;
        db.query(query, [userId, shopId, content], (err, result) => {
            if (err) {
                log(err, 3);
                reject(new Error('Database error during comment posting.'));
            } else {
                log(`Successfully posted comment: ${userId}`, 1);
                resolve('Comment posted successfully');
            }
        });
    });
};
