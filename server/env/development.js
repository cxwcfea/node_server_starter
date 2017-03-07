exports.port = 8000;

exports.mongo = {
  uri: 'mongodb://localhost/node_server',
};

exports.confidential = {
  sessionSecret: 'developmentSessionSecret',
  jwtSecret: 'devJwtSecret',
};
