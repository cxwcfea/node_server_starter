import path from 'path';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mountRoutes from 'mount-routes';
import requireDirectory from 'require-directory';
import logger from './logger';
import sendJson from '../middlewares/sendJson';
import auth from '../core/passport';
import util from '../utils/util';

export default (config) => {
  const app = express();

  app.set('json spaces', 2);
  app.set('trust proxy', config.trustProxy || false);
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.raw());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(sendJson);

  serverContext.errorCode = {
    MongoError: 4001,
  };
  serverContext.logger = logger(app);
  serverContext.ctrls = util.loadModules(requireDirectory(module, '../controllers'));
  serverContext.services = util.loadModules(requireDirectory(module, '../services'));
  serverContext.mongoModels = util.loadModules(requireDirectory(module, '../models/mongo'));
  serverContext.auth = auth(app);

  mountRoutes(app, path.join(__dirname, '..', 'routes'), false);

  app.use((req, res) => {
    res.sendJsonError('Not Found!', 404);
  });

  app.use((err, req, res) => {
    serverContext.logger.error(err.stack);
    res.sendJsonError(err.message || 'Internal Server Error!', err.status || 500);
  });

  return app;
};
