global.Promise = require('bluebird');

import http from 'http';
import config from './env/development';
import express from './core/express';
import connectMongo from './utils/mongodb';

function startServer() {
  global.serverContext = {
    config,
  };
  connectMongo(config.mongo.uri);
  const app = express(config);
  const port = config.port;
  const server = http.createServer(app);

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = `Port ${port}`;

    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        app.ctx.logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const addr = server.address();
    const bind = `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  });

  server.listen(port);
}

if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
