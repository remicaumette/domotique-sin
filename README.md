# Domotique SIN

### Informations

Ecrit en nodejs, template handlebars, base de donnée redis, framework front
bootstrap et plain js. Supporte :

- Site web
- HomeKit

Variable d'environnement :

- REDIS : URL de connexion à la base de donnée
- SECRET : Secret utilisé pour les sessions
- PORT : Port du serveur web

### Installation

```
sudo apt install redis-server git
git clone https://github.com/remicaumette/domotique-sin.git
cd domotique-sin
sudo sh ./script/install_nodejs.sh
npm install -g yarn
yarn install
```

### Créer un compte

```
yarn create-account
```

### Fake metrics

```
yarn populate-metrics
```

### Lancer

```
yarn start
```
