const Redis = require('ioredis');

const URL = process.env.REDIS || 'redis://127.0.0.1/';

const open = () => new Redis(URL);

module.exports = {
    URL,
    open,
};
