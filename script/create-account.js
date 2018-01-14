const inquirer = require('inquirer');
const { Account } = require('../lib/model');

inquirer.prompt([
    {
        type: 'input',
        name: 'username',
        message: 'Username?',
    },
    {
        type: 'password',
        name: 'password',
        message: 'Password?',
    },
    {
        type: 'input',
        name: 'name',
        message: 'Name?',
    },
]).then((answer) => {
    const account = Account.create(answer.username, answer.password, answer.name, Date.now());

    return account.save()
        .then(() => {
            console.log('User created!');
        });
}).catch(console.error);
