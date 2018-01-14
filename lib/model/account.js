const bcrypt = require('bcrypt-nodejs');
const Database = require('../database');

class Account {
    constructor(username, password, fullname, createdAt) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.createdAt = createdAt;
    }

    comparePassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.password, (error, match) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(match);
                }
            });
        });
    }

    save() {
        const redis = Database.openConnection();

        return redis
            .set(`users:${this.username}`, JSON.stringify({
                username: this.username,
                password: this.password,
                fullname: this.fullname,
                createdAt: this.createdAt,
            }))
            .then(() => redis.disconnect());
    }

    static encryptPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(password, salt, undefined);
        return encryptedPassword;
    }

    static create(username, password, fullname, createdAt) {
        return new Account(username, Account.encryptPassword(password), fullname, createdAt);
    }

    static findByUsername(username) {
        const redis = Database.openConnection();

        return redis
            .get(`users:${username}`)
            .then((rawData) => {
                if (rawData) {
                    const data = JSON.parse(rawData);
                    redis.disconnect();
                    return new Account(data.username, data.password, data.fullname, data.createdAt);
                }
                return undefined;
            });
    }
}

module.exports = Account;
