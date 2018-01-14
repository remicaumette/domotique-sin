const http = require('http');
const App = require('../lib/app');

const server = http.createServer(App);

server.on('listening', () => {
    console.log('   App is running at http://%s:%d', server.address().address, server.address().port);
    console.log('   Press CTRL-C to stop\n');
});

server.on('error', (error) => {
    console.log();
    console.error(error);
    console.log();
});

server.listen(process.env.PORT || 3000);
