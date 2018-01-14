const Database = require('../lib/database');

const redis = Database.openConnection();

setInterval(() => {
    redis.publish('metrics', JSON.stringify({ sensor: 'TEMPERATURE', value: Math.floor(Math.random() * 40) }));
    redis.publish('metrics', JSON.stringify({ sensor: 'CARBON_MONOXIDE', value: Math.floor(Math.random() * 30) }));
    redis.publish('metrics', JSON.stringify({ sensor: 'POWER_CONSUMPTION', value: Math.floor(Math.random() * 100) }));

    console.log('Populate!');
}, 60 * 1000);
