const Connection = require('./connection');
const Account = require('./account');
const Metrics = require('./metrics');
const { EventEmitter } = require('events');

/*
 * Gestion des mesures de la température.
 */
const TEMPERATURE_METRICS = new Metrics('temperature');

/*
 * Gestion des mesures de la teneur en monoxyde de carbone.
 */
const CARBON_MONOXIDE_METRICS = new Metrics('carbon_monoxide');

/*
 * Gestion des mesures de la consommation électrique.
 */
const POWER_CONSUMPTION_METRICS = new Metrics('power_consumption');

/*
 * Gestion des mesures de la luminosité.
 */
const LUMINOSITY_METRICS = new Metrics('luminosity');

/*
 * Gestion des mesures de reconnaissance faciale.
 */
const FACE_RECOGNITION_METRICS = new Metrics('face_recognition');

/*
 * Liste de toutes les mesures.
 */
const METRICS = {
    TEMPERATURE: TEMPERATURE_METRICS,
    CARBON_MONOXIDE: CARBON_MONOXIDE_METRICS,
    POWER_CONSUMPTION: POWER_CONSUMPTION_METRICS,
    LUMINOSITY: LUMINOSITY_METRICS,
    FACE_RECOGNITION: FACE_RECOGNITION_METRICS,
};

/**
 * Gestion des evenements de la caméra.
 */
const CAMERA_EVENTS = new EventEmitter();

/**
 * On récupère la température désiré (par défaut 19°C).
 */
const getDesiredTemperature = () => {
    const redis = Connection.open();
    return redis.get('desired_temperature')
        .then((temperature) => {
            redis.disconnect();
            return temperature ? parseInt(temperature, 10) : 19;
        });
};

/**
 * On défini la température désiré.
 */
const setDesiredTemperature = (temperature) => {
    const redis = Connection.open();
    return redis.set('desired_temperature', temperature)
        .then(() => redis.disconnect());
};

/*
 * On initialise la base de donnée (lancement des subscribers...).
 */
const init = () => {
    const redisListener = Connection.open();

    redisListener.subscribe('sensors');

    redisListener.on('message', (channel, message) => {
        const data = JSON.parse(message);
        data.time = Math.floor(Date.now() / 1000) * 1000;
        if (data.sensor === 'CAMERA') {
            CAMERA_EVENTS.emit('data', data.value);
        } else {
            METRICS[data.sensor].add(data.time, data.value);
        }
    });
};

module.exports = {
    Metrics,
    Account,
    TEMPERATURE_METRICS,
    CARBON_MONOXIDE_METRICS,
    POWER_CONSUMPTION_METRICS,
    LUMINOSITY_METRICS,
    FACE_RECOGNITION_METRICS,
    METRICS,
    CAMERA_EVENTS,
    getDesiredTemperature,
    setDesiredTemperature,
    init,
};
