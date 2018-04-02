const JWT = require('jsonwebtoken');
const { Account } = require('../database');

module.exports = (req, res, next) => {
    if (req.cookies.access_token) {
        return JWT.verify(req.cookies.access_token, process.env.SECRET || 'wowthisismysecret', (err, data) => {
            if (err) {
                return res.redirect('/auth/login');
            }
            Account.findByUsername(data.user)
                .then((user) => {
                    if (user) {
                        req.user = user;
                        return next();
                    }
                    res.clearCookie('access_token');
                    res.redirect('/auth/login');
                });
        });
    }
    res.redirect('/auth/login');
};
