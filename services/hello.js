const log = require('./log');

const hello = (name) => {
    log(`Hello, ${name}!`);
}

module.exports = hello;