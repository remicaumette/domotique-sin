const Redis = require('ioredis');
const { EventEmitter } = require('events');

const URL = process.env.REDIS || 'redis://127.0.0.1/';

const SENSORS = {
    TEMPERATURE: 'temperature_metrics',
    CARBON_MONOXIDE: 'carbon_monoxide_metrics',
    POWER_CONSUMPTION: 'power_consumption_metrics',
};

const ACTUATORS = {
    HEATING: 'HEATING',
    LIGHT: 'LIGHT',
};

const ACTIONS = {
    TURN_ON: 'TURN_ON',
    TURN_OFF: 'TURN_OFF',
};

const openConnection = () => new Redis(URL);

const events = new EventEmitter();

const getLastSensorMetrics = (sensor, limit) => {
    const redis = openConnection();
    const from = Date.now() - ((limit || 1) * 60 * 1000);

    return redis.zrangebyscore(SENSORS[sensor], from, Date.now())
        .then((rawData) => {
            redis.disconnect();
            const data = rawData.map(raw => JSON.parse(raw));
            return data.length <= 1 ? data.pop() : data;
        });
};

const getDesiredTemperature = () => {
    const redis = openConnection();
    return redis.get('desired_temperature')
        .then((data) => {
            redis.disconnect();
            return JSON.parse(data);
        });
};

const setDesiredTemperature = (value) => {
    const redis = openConnection();
    return redis.set('desired_temperature', value)
        .then(() => redis.disconnect());
};

const trigger = (actuator, action) => {
    const redis = openConnection();
    redis.publish('triggers', { actuator, action });
    redis.disconnect();
};

const init = () => {
    const redisListener = openConnection();
    const redis = openConnection();
    redisListener.subscribe('metrics');

    redisListener.on('message', (channel, message) => {
        const data = JSON.parse(message);
        data.receivedAt = Math.floor(Date.now() / 1000) * 1000;

        /* Such time series database */
        redis.zadd(SENSORS[data.sensor], data.receivedAt, JSON.stringify(data));
        /* On rebalance ca dans interne */
        events.emit('metrics', data);
    });
};

module.exports = {
    URL,
    SENSORS,
    ACTUATORS,
    ACTIONS,
    openConnection,
    events,
    getLastSensorMetrics,
    getDesiredTemperature,
    setDesiredTemperature,
    trigger,
    init,
};
