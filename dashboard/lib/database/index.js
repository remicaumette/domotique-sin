const Connection = require('./connection');
const Account = require('./account');
const Sensor = require('./sensor');
const { EventEmitter } = require('events');

const TEMPERATURE_SENSOR = new Sensor('temperature');
const HUMIDITY_SENSOR = new Sensor('humidity');
const VOLATIL_ORGANIC_COMPOUND_SENSOR = new Sensor('volatil_organic_compound');
const POWER_CONSUMPTION_SENSOR = new Sensor('power_consumption');
const LUMINOSITY_SENSOR = new Sensor('luminosity');

const SENSORS = {
    TEMPERATURE: TEMPERATURE_SENSOR,
    HUMIDITY: HUMIDITY_SENSOR,
    VOLATIL_ORGANIC_COMPOUND: VOLATIL_ORGANIC_COMPOUND_SENSOR,
    POWER_CONSUMPTION: POWER_CONSUMPTION_SENSOR,
    LUMINOSITY: LUMINOSITY_SENSOR,
};

const SENSORS_EVENTS = new EventEmitter();
Object.values(SENSORS)
    .forEach((sensor) => {
        sensor.on('add', value => SENSORS_EVENTS.emit('add', { sensor, time: value.time, value: value.value }));
    });
const CAMERA_EVENTS = new EventEmitter();

const getDesiredTemperature = () => {
    const redis = Connection.open();
    return redis.get('desired_temperature')
        .then((temperature) => {
            redis.disconnect();
            return temperature ? parseInt(temperature, 10) : 19;
        });
};

const setDesiredTemperature = (temperature) => {
    const redis = Connection.open();
    return redis.set('desired_temperature', temperature)
        .then(() => redis.disconnect());
};

const init = () => {
    const sensorsListener = Connection.open();

    sensorsListener.subscribe('sensors');

    sensorsListener.on('message', (channel, message) => {
        const data = JSON.parse(message);
        data.time = Math.floor(Date.now() / 1000) * 1000;
        SENSORS[data.sensor].addMetric(data.time, data.value);
    });
};

module.exports = {
    Sensor,
    Account,
    SENSORS,
    SENSORS_EVENTS,
    CAMERA_EVENTS,
    getDesiredTemperature,
    setDesiredTemperature,
    init,
};
