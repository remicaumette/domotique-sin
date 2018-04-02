const Connection = require('./connection');
const { EventEmitter } = require('events');

class Metrics extends EventEmitter {
    /*
     * Créer un nouveau tableau de mesure.
     */
    constructor(name) {
        super();
        this.name = name;
    }

    /*
     * Ajouter une mesure.
     */
    add(time, value) {
        const redis = Connection.open();

        return redis.zadd(`metrics:${this.name}`, time, value)
            .then(() => {
                this.emit('add', { time, value });
                return redis.disconnect();
            });
    }

    /*
     * Obtenir les dernières mesures.
     */
    getLast(limit) {
        const redis = Connection.open();

        return redis.zrange(`metrics:${this.name}`, `-${limit || 1}`, '-1', 'WITHSCORES')
            .then((rawData) => {
                const data = [];
                for (let i = 0; i < rawData.length; i += 2) {
                    data.push({ time: JSON.parse(rawData[i + 1]), value: JSON.parse(rawData[i]) });
                }
                redis.disconnect();
                return data;
            });
    }
}

module.exports = Metrics;
