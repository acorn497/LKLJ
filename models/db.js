const mysql = require('mysql2');
const log = require('../services/log');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'sohssr'
};

let db;

const connectToDatabase = () => {
    db = mysql.createConnection(dbConfig);

    db.connect(err => {
        if (err) {
            log(`Failed to connect to MySQL database. Retrying in 1 minute...`, 3);
            log(err.stack, 3);
            
            setTimeout(() => {
                log('Retrying to connect to MySQL database.');
                setTimeout(connectToDatabase, 3000);
            }, 57000);
        }
        log(`Successfully connected to MySQL database.`, 1);
    });
};

// 최초 DB 연결 시도
connectToDatabase();

module.exports = db;
