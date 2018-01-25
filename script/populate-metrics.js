const Database = require('../lib/database');

const redis = Database.openConnection();

const populate = () => {
    redis.publish('metrics', JSON.stringify({ sensor: 'TEMPERATURE', value: Math.floor(Math.random() * 40) }));
    redis.publish('metrics', JSON.stringify({ sensor: 'CARBON_MONOXIDE', value: Math.floor(Math.random() * 30) }));
    redis.publish('metrics', JSON.stringify({ sensor: 'POWER_CONSUMPTION', value: Math.floor(Math.random() * 100) }));

    console.log('Populate!');
};

setInterval(populate, 60 * 1000);

populate();
