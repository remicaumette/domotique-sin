const Connection = require('./connection');
const { EventEmitter } = require('events');

class Sensor extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }

    addMetric(time, value) {
        const redis = Connection.open();

        return redis.zadd(`sensors:${this.name}`, time, value)
            .then(() => {
                this.emit('add', { time, value });
                return redis.disconnect();
            });
    }

    getLastMetrics(limit) {
        const redis = Connection.open();

        return redis.zrange(`sensors:${this.name}`, `-${limit || 1}`, '-1', 'WITHSCORES')
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

module.exports = Sensor;
