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
sudo apt install git
sudo git clone https://github.com/remicaumette/domotique-sin.git /opt/domotique-sin
sudo sh ./script/install/node.sh
cd /opt/domotique-sin
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
