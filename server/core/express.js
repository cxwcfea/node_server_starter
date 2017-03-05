import path from 'path';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import logger from './logger';
import sendJson from '../middlewares/sendJson';

export default (config) => {
  const app = express();

  app.ctx = {};
  app.set('json spaces', 4);
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.raw());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  logger(app);
  app.use(sendJson);

  app.get('/test', (req, res) => {
    res.sendJsonResponse({ name: 'ok' });
  });

  return app;
};
