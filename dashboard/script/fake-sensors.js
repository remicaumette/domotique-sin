const Connection = require('../lib/database/connection');

const fakeTemperatureSensor = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'TEMPERATURE',
        value: Math.floor(Math.random() * 40),
    })), 60 * 1000);
};

const fakeHumiditySensor = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'HUMIDITY',
        value: Math.floor(Math.random() * 100),
    })), 60 * 1000);
};

const fakeVolatilOrganicCompoundSensor = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'VOLATIL_ORGANIC_COMPOUND',
        value: Math.floor(Math.random() * 500),
    })), 60 * 1000);
};

const fakePowerConsumptionSensor = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'POWER_CONSUMPTION',
        value: Math.floor(Math.random() * 4),
    })), 60 * 1000);
};

const fakeLuminositySensor = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'LUMINOSITY',
        value: Math.floor(Math.random() * 800),
    })), 60 * 1000);
};

fakeTemperatureSensor();
fakeHumiditySensor();
fakeVolatilOrganicCompoundSensor();
fakePowerConsumptionSensor();
fakeLuminositySensor();
