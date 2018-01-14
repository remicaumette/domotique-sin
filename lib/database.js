const Redis = require('ioredis');
const { EventEmitter } = require('events');

const URL = process.env.REDIS || 'redis://127.0.0.1/';

const openConnection = () => new Redis(URL);

const events = new EventEmitter();

const REDIS_KEY_BY_SENSOR = {
    TEMPERATURE: 'temperature_metrics',
    CARBON_MONOXIDE: 'carbon_monoxide_metrics',
    POWER_CONSUMPTION: 'power_consumption_metrics',
};

const getLastSensorMetrics = (sensor, limit) => {
    const redis = openConnection();
    const from = Date.now() - ((limit || 1) * 60 * 1000);

    return redis.zrangebyscore(REDIS_KEY_BY_SENSOR[sensor], from, Date.now())
        .then((rawData) => {
            redis.disconnect();
            const data = rawData.map(raw => JSON.parse(raw));
            return data.length <= 1 ? data.pop() : data;
        });
};

const init = () => {
    const redisListener = openConnection();
    const redis = openConnection();
    redisListener.subscribe('metrics');

    redisListener.on('message', (channel, message) => {
        const data = JSON.parse(message);
        data.receivedAt = Date.now();

        /* Such time series database */
        redis.zadd(REDIS_KEY_BY_SENSOR[data.sensor], data.receivedAt, JSON.stringify(data));
        /* On rebalance ca dans interne */
        events.emit('metrics', data);
    });
};

module.exports = {
    URL,
    REDIS_KEY_BY_SENSOR,
    openConnection,
    getLastSensorMetrics,
    init,
    events,
};
