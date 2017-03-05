import path from 'path';
import log4js from 'log4js';

const logFileName = path.join(__dirname, '..', '..', 'log', 'server.log');

const logConfig = {
  appenders: [
    {
      type: 'clustered',
      appenders: [{ type: 'console' }],
    },
  ],
  replaceConsole: true,
};

const defaultFormat = ':remote-addr - :method :url :status :user-agent - :response-time ms';

export default (app) => {
  if (process.env.NODE_ENV === 'production') {
    logConfig.appenders.push({
      type: 'dateFile',
      filename: logFileName,
      pattern: '-yyyy-MM-dd',
      alwaysIncludePattern: false,
      // category: 'express',
    });
  }
  log4js.configure(logConfig);
  app.ctx.logger = log4js.getLogger('console');
  app.use(log4js.connectLogger(log4js.getLogger('express'), { level: 'debug', format: defaultFormat }));
};
