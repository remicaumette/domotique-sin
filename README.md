# Domotique SIN

### Informations

Ecrit en nodejs, template handlebars, base de donnée redis, framework front
bootstrap et plain js.

Variable d'environnement :

- REDIS : URL de connexion à la base de donnée
- SECRET : Secret utilisé pour les sessions
- PORT : Port du serveur web

### Installation

```
sudo apt install git curl bash
sudo git clone https://github.com/remicaumette/domotique-sin.git /opt/domotique-sin
sudo chown -R $USER /opt/domotique-sin
cd /opt/domotique-sin
sh ./script/install/redis.sh
sh ./script/install/nodejs.sh
sh ./script/install/yarn.sh
sh ./script/install/service.sh
yarn install
```

### Créer un compte

```
yarn create-account
```

### Fake modules

```
yarn fake-modules
```

### Lancer

```
yarn start
```
