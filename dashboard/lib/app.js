const express = require('express');
const socketio = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const body = require('body-parser');
const Database = require('./database');
const { HomeController, AuthController } = require('./controller');
const { checkAuth } = require('./middleware');

const app = express();
const io = socketio();

app.io = io;
app.engine('hbs', handlebars());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '..', 'view'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookie());
app.use(body.urlencoded({ extended: false }));
app.use(body.json());

Database.init();

app.get('/', HomeController.getIndex);
app.get('/home', checkAuth, HomeController.getHome);
app.get('/desired_temperature', checkAuth, HomeController.getDesiredTemperature);
app.post('/desired_temperature', checkAuth, HomeController.postDesiredTemperature);

app.get('/auth/login', AuthController.getLogin);
app.post('/auth/login', AuthController.postLogin);
app.get('/auth/logout', checkAuth, AuthController.getLogout);

io.on('connection', (client) => {
    client.on('ready', () => {
        Object.values(Database.SENSORS)
            .forEach(sensor =>
                sensor.getLastData(10)
                    .then(metrics => metrics.forEach(value =>
                        client.emit('sensors', { sensor: sensor.name, time: value.time, value: value.value })))
                    .catch(console.error));
        Database.EVENTS.on('add', event => client.emit('sensors', { sensor: event.sensor.name, time: event.time, value: event.value }));
    });
});

module.exports = app;
