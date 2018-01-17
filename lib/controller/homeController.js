const Database = require('../database');

module.exports.getIndex = (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.redirect('/auth/login');
};

module.exports.getHome = (req, res) => {
    res.render('home');
};

const connections = [];

module.exports.getEvents = (req, res) => {
    res.set('Content-Type', 'text/event-stream');
    res.set('Cache-Control', 'no-cache');
    res.set('Connection', 'keep-alive');
    res.status(200);

    res.sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    Object.keys(Database.REDIS_KEY_BY_SENSOR)
        .forEach(key => Database.getLastSensorMetrics(key, 20)
            .then(data => res.sendEvent(data))
            .catch(console.error));

    connections.push(res);

    res.socket.on('close', () => {
        delete connections[res];
    });
};

Database.events.on('metrics', (data) => {
    connections.forEach(res => res.sendEvent(data));
});
