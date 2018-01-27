const { Account } = require('../database');

module.exports = (req, res, next) => {
    if (req.session.user) {
        return Account.findByUsername(req.session.user)
            .then((user) => {
                if (user) {
                    req.user = user;
                    return next();
                }
                req.session.user = undefined;
                res.redirect('/auth/login');
            });
    }
    res.redirect('/auth/login');
};
