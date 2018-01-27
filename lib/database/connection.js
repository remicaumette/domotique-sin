const Redis = require('ioredis');

/*
 * URL de connexion à la base de donnée.
 */
const URL = process.env.REDIS || 'redis://127.0.0.1/';

/*
 * Ouverture d'une connexion à la base de donnée.
 */
const open = () => new Redis(URL);

module.exports = {
    URL,
    open,
};
