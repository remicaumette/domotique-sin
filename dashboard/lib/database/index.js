const Connection = require('./connection');
const Account = require('./account');
const Metrics = require('./metrics');

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
 * Liste de toutes les mesures.
 */
const METRICS = {
    TEMPERATURE: TEMPERATURE_METRICS,
    CARBON_MONOXIDE: CARBON_MONOXIDE_METRICS,
    POWER_CONSUMPTION: POWER_CONSUMPTION_METRICS,
    LUMINOSITY: LUMINOSITY_METRICS,
};

const getDesiredTemperature = () => {
    const redis = Connection.open();
    return redis.get('desired_temperature')
        .then((temperature) => {
            redis.disconnect();
            return temperature ? parseInt(temperature, 10) : 19;
        });
};

TEMPERATURE_METRICS.on('add', (data) => {
    const redis = Connection.open();
    getDesiredTemperature()
        .then((temp) => {
            if (data.value < temp) {
                redis.publish('actuators', JSON.stringify({ actuator: 'HEATING', value: 1 }));
            } else {
                redis.publish('actuators', JSON.stringify({ actuator: 'HEATING', value: 0 }));
            }
        });
});

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
        METRICS[data.sensor].add(data.time, data.value);
    });
};

module.exports = {
    Metrics,
    Account,
    TEMPERATURE_METRICS,
    CARBON_MONOXIDE_METRICS,
    POWER_CONSUMPTION_METRICS,
    LUMINOSITY_METRICS,
    METRICS,
    getDesiredTemperature,
    setDesiredTemperature,
    init,
};
