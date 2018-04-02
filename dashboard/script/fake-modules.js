const Connection = require('../lib/database/connection');

const fakeTemperatureModule = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'TEMPERATURE',
        value: Math.floor(Math.random() * 40),
    })), 60 * 1000);
};

const fakeCarbonMonoxideModule = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'CARBON_MONOXIDE',
        value: Math.floor(Math.random() * 100),
    })), 60 * 1000);
};

const fakePowerConsumptionModule = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'POWER_CONSUMPTION',
        value: Math.floor(Math.random() * 4),
    })), 60 * 1000);
};

const fakeLightModule = () => {
    const publisher = Connection.open();

    setInterval(() => publisher.publish('sensors', JSON.stringify({
        sensor: 'LUMINOSITY',
        value: Math.floor(Math.random() * 800),
    })), 60 * 1000);
};

fakeTemperatureModule();
fakeCarbonMonoxideModule();
fakePowerConsumptionModule();
fakeLightModule();
