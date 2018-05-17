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
        .then(() => res.status(200).end())
        .catch((error) => {
            console.error(error);
            res.status(500).end();
        });
};

module.exports.postDoorStatus = (req, res) => {
    Database.updateDoorStatus(req.body.state)
        .then(() => res.status(200).end())
        .catch((error) => {
            console.error(error);
            res.status(500).end();
        });
}
