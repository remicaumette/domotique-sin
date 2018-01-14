const HomeKit = require('homekit');
const Database = require('./database');

const initHeatingManagementModule = () => {
    const uuid = HomeKit.uuid.generate('module:heating_management');
    const accessory = new HomeKit.Accessory('Heating management', uuid);

    accessory.on('identify', (paired, callback) => {
        console.log('An homekit user is paired!');
        callback();
    });

    const service = accessory.addService(HomeKit.Service.TemperatureSensor, 'Temperature sensor');

    service.getCharacteristic(HomeKit.Characteristic.CurrentTemperature)
        .on('get', (callback) => {
            Database.getLastSensorMetrics('TEMPERATURE')
                .then(data => callback(null, data.value))
                .catch(error => callback(error, null));
        });

    accessory.publish({
        port: 51000,
        username: 'CC:22:3D:E3:CE:F1',
        pincode: '151-12-000',
    });

    Database.events.on('metrics', (data) => {
        if (data.sensor === 'TEMPERATURE') {
            service.setCharacteristic(HomeKit.Characteristic.CurrentTemperature, data.value);
        }
    });
};

module.exports.init = () => {
    initHeatingManagementModule();
};
