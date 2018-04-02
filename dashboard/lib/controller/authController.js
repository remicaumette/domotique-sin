const JWT = require('jsonwebtoken');
const { Account } = require('../database');

module.exports.getLogin = (req, res) => {
    if (req.cookies.access_token) {
        return res.redirect('/home');
    }

    res.render('login');
};

module.exports.postLogin = (req, res) => {
    if (req.cookies.access_token) {
        return res.redirect('/home');
    }

    const { username, password } = req.body;

    Account.findByUsername(username)
        .then((user) => {
            if (user) {
                return user.comparePassword(password)
                    .then((match) => {
                        if (match) {
                            return JWT.sign({ user: user.username }, process.env.SECRET || 'wowthisismysecret', (err, token) => {
                                if (err) {
                                    return res.render('login', { error: "Une erreur s'est produite." });
                                }
                                res.cookie('access_token', token);
                                return res.redirect('/home');
                            });
                        }
                        res.render('login', { error: 'Nom de compte ou mot de passe incorrect.' });
                    });
            }
            res.render('login', { error: 'Nom de compte ou mot de passe incorrect.' });
        })
        .catch((error) => {
            console.error(error);
            res.render('login', { error: "Une erreur s'est produite." });
        });
};

module.exports.getLogout = (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/auth/login');
};
