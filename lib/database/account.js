const BCrypt = require('bcrypt-nodejs');
const Connection = require('./connection');

class Account {
    /*
     * Créer l'objet Account.
     * /!\ NE PAS UTILISER /!\
     */
    constructor(username, password, fullname, createdAt) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.createdAt = createdAt;
    }

    /*
     * Comparer le mot de passe du compte avec un autre.
     */
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

    /*
     * Sauvegarder le compte.
     */
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

    /*
     * Encrypter un mot de passe.
     */
    static encryptPassword(password) {
        const salt = BCrypt.genSaltSync(10);
        const encryptedPassword = BCrypt.hashSync(password, salt, undefined);
        return encryptedPassword;
    }

    /*
     * Créé un nouveau compte.
     */
    static create(username, password, fullname, createdAt) {
        return new Account(username, Account.encryptPassword(password), fullname, createdAt);
    }

    /*
     * Chercher un compte à partir de son pseudo.
     */
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
