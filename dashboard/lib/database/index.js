const Connection = require('./connection');
const Account = require('./account');
const Sensor = require('./sensor');
const { EventEmitter } = require('events');

const TEMPERATURE_SENSOR = new Sensor('temperature');
const HUMIDITY_SENSOR = new Sensor('humidity');
const VOLATIL_ORGANIC_COMPOUND_SENSOR = new Sensor('volatil_organic_compound');
const POWER_CONSUMPTION_SENSOR = new Sensor('power_consumption');
const LUMINOSITY_SENSOR = new Sensor('luminosity');
const FACE_RECOGNITION_SENSOR = new Sensor('face_recognition');

const SENSORS = {
    TEMPERATURE: TEMPERATURE_SENSOR,
    HUMIDITY: HUMIDITY_SENSOR,
    VOLATIL_ORGANIC_COMPOUND: VOLATIL_ORGANIC_COMPOUND_SENSOR,
    POWER_CONSUMPTION: POWER_CONSUMPTION_SENSOR,
    LUMINOSITY: LUMINOSITY_SENSOR,
    FACE_RECOGNITION: FACE_RECOGNITION_SENSOR,
};

const EVENTS = new EventEmitter();
Object.values(SENSORS)
    .forEach((sensor) => {
        sensor.on('add', value => EVENTS.emit('add', { sensor, time: value.time, value: value.value }));
    });

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
    return Promise.all([
        redis.set('desired_temperature', temperature),
        redis.publish('updates', JSON.stringify({ type: 'DESIRED_TEMPERATURE', value: temperature })),
    ]).then(() => redis.disconnect());
};

const updateDoorStatus = (state) => {
    const redis = Connection.open();
    return redis.publish('updates', JSON.stringify({ type: 'UPDATE_DOOR_STATUS', value: state }))
        .then(() => redis.disconnect());
};

const init = () => {
    const sensorsListener = Connection.open();

    sensorsListener.subscribe('sensors', 'camera');

    sensorsListener.on('message', (channel, message) => {
        const data = JSON.parse(message);
        if (channel === 'sensors') {
            const sensor = SENSORS[data.sensor];
            data.time = Date.now();
            if (sensor) {
                sensor.addData(data.time, data.value);
            } else {
                EVENTS.emit('add', { sensor: { name: data.sensor }, time: data.time, value: data.value });
            }
        } else if (channel === 'camera') {
            EVENTS.emit('camera', data.value);
        }
    });
};

module.exports = {
    Sensor,
    Account,
    SENSORS,
    EVENTS,
    getDesiredTemperature,
    setDesiredTemperature,
    updateDoorStatus,
    init,
};
