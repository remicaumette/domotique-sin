const Database = require('../database');

module.exports.getIndex = (req, res) => {
    if (req.cookies.access_token) {
        return res.redirect('/home');
    }
    res.redirect('/auth/login');
};

module.exports.getHome = (req, res) => {
    res.render('home');
};

module.exports.getDesiredTemperature = (req, res) => {
    Database.getDesiredTemperature()
        .then(temperature => res.json({ temperature }).end())
        .catch((error) => {
            console.error(error);
            res.status(500).end();
        });
};

module.exports.postDesiredTemperature = (req, res) => {
    Database.setDesiredTemperature(req.body.temperature)
        .then(() => res.status(204).end())
        .catch((error) => {
            console.error(error);
            res.status(500).end();
        });
};

const connections = [];

Database.SENSORS_EVENTS.on('add', event => connections.forEach(connection => connection.sendMetric(event.sensor.name, event.time, event.value)));

module.exports.getEvents = (req, res) => {
    res.set('Content-Type', 'text/event-stream');
    res.set('Cache-Control', 'no-cache');
    res.set('Connection', 'keep-alive');

    res.status(200);

    res.sendMetric = (sensor, time, value) => {
        res.write(`data: ${JSON.stringify({ sensor, time, value })}\n\n`);
    };

    Object.values(Database.SENSORS)
        .forEach(sensor =>
            sensor.getLastMetrics(10)
                .then(metrics => metrics.forEach(value =>
                    res.sendMetric(sensor.name, value.time, value.value)))
                .catch(console.error));

    connections.push(res);

    res.socket.on('close', () => {
        delete connections[res];
    });
};
