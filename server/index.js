import http from 'http';

import config from './env/development';
import express from './core/express';

function startServer() {
  const app = express(config);
  const port = config.port;
  const server = http.createServer(app);

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
