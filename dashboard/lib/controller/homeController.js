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

Object.values(Database.METRICS)
    .forEach((metrics) => {
        metrics.on('add', (data) => {
            connections.forEach(connection =>
                connection.sendMetric(metrics.name, data.time, data.value));
        });
    });

Database.CAMERA_EVENTS.on('data', (data) => {
    connections.forEach(connection =>
        connection.sendMetric('CAMERA', 0, data));
});

module.exports.getEvents = (req, res) => {
    res.set('Content-Type', 'text/event-stream');
    res.set('Cache-Control', 'no-cache');
    res.set('Connection', 'keep-alive');

    res.status(200);

    res.sendMetric = (metric, time, value) => {
        res.write(`data: ${JSON.stringify({ metric, time, value })}\n\n`);
    };

    Object.values(Database.METRICS)
        .forEach(metrics =>
            metrics.getLast(20)
                .then(data => data.forEach(value =>
                    res.sendMetric(metrics.name, value.time, value.value)))
                .catch(console.error));

    connections.push(res);

    res.socket.on('close', () => {
        delete connections[res];
    });
};
