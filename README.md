# Domotique SIN

### Informations

Ecrit en nodejs, template handlebars, base de donnée redis, framework front
bootstrap et plain js.

Variable d'environnement :

- REDIS : URL de connexion à la base de donnée
- SECRET : Secret utilisé pour les sessions
- PORT : Port du serveur web

### Installation avec Docker Compose

```
docker-compose up -d
```

### Modules

L'ensemble des modules sont disponibles dans le dossier ```module```.
Ils fonctionnent avec l'esp8266 et utilisent Arduino. Pour le module intercom,
il faut directement l'installer sur la Raspberry à l'aide du Makefile.

### Créer un compte

```
npm run create-account
```

### Fake modules

```
npm run fake-modules
```

### Lancer

```
npm run start
```
