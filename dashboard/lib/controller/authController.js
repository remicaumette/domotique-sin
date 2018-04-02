const { Account } = require('../database');

module.exports.getLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }

    res.render('login');
};

module.exports.postLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }

    const { username, password } = req.body;

    Account.findByUsername(username)
        .then((user) => {
            if (user) {
                return user.comparePassword(password)
                    .then((match) => {
                        if (match) {
                            req.session.user = user.username;
                            return res.redirect('/home');
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
    req.session.user = undefined;
    res.redirect('/auth/login');
};
