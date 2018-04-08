const BCrypt = require('bcrypt-nodejs');
const Connection = require('./connection');

class Account {

    constructor(username, password, fullname, createdAt) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.createdAt = createdAt;
    }

    comparePassword(password) {
        return new Promise((resolve, reject) => {
            BCrypt.compare(password, this.password, (error, match) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(match);
                }
            });
        });
    }

    save() {
        const redis = Connection.open();

        return redis
            .set(`accounts:${this.username}`, JSON.stringify({
                username: this.username,
                password: this.password,
                fullname: this.fullname,
                createdAt: this.createdAt,
            }))
            .then(() => redis.disconnect());
    }

    static encryptPassword(password) {
        const salt = BCrypt.genSaltSync(10);
        const encryptedPassword = BCrypt.hashSync(password, salt, undefined);
        return encryptedPassword;
    }

    static create(username, password, fullname, createdAt) {
        return new Account(username, Account.encryptPassword(password), fullname, createdAt);
    }

    static findByUsername(username) {
        const redis = Connection.open();

        return redis
            .get(`accounts:${username}`)
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
