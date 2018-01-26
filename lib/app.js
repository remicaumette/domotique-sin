const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const body = require('body-parser');
const Database = require('./database');
const { HomeController, AuthController } = require('./controller');
const { checkAuth } = require('./middleware');

const app = express();

app.engine('hbs', handlebars());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '..', 'view'));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({ secret: process.env.SECRET || 'wowthisismysecret', resave: false, saveUninitialized: false }));
app.use(body.urlencoded({ extended: false }));
app.use(body.json());

Database.init();

app.get('/', HomeController.getIndex);
app.get('/home', checkAuth, HomeController.getHome);
app.get('/events', checkAuth, HomeController.getEvents);

app.get('/auth/login', AuthController.getLogin);
app.post('/auth/login', AuthController.postLogin);
app.get('/auth/logout', checkAuth, AuthController.getLogout);

module.exports = app;
