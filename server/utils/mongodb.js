import _ from 'lodash';
import mongoose from 'mongoose';

mongoose.Promise = require('bluebird');

const defaultOptions = {
  server: {
    poolSize: 5,
    socketOptions: { keepAlive: 1 },
  },
};

function connect(mongoStr, options = {}) {
  mongoose.connect(mongoStr, _.assign(defaultOptions, options));
  mongoose.connection.on('error', () => {
    console.error('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
    process.exit(0);
  });
  mongoose.connection.once('open', () => {
    console.log('mongo db opened');
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
}

function gracefulShutdown(msg, callback) {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through %s', msg);
    callback();
  });
}

// restart
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

export default connect;
