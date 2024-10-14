import 'babel-polyfill';
import { boot, exit, preBoot, preExit } from './core/boot';
import { errors, jsonError, jsonSuccess, logger } from './utils/system';
import { environments } from './core/framework';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { config } from './core/config';
import IO from 'socket.io';
import helmet from 'helmet';
import limiter from './core/limitRequest';
import { regulators } from './middlewares/regulators';
import { cronJob } from './core/cronjob';
import swaggerUi from 'swagger-ui-express';
import { api } from './docs/api';

(async () => {
  let awaitResult;

  //-- handle signals
  const shutdownProcess = async () => {
    if (!global.isShuttingDown) {
      global.isShuttingDown = true;
      awaitResult = await preExit();
      if (awaitResult && !awaitResult.success)
        logger.warn(awaitResult);

      awaitResult = await exit();
      if (awaitResult && !awaitResult.success)
        logger.warn(awaitResult);
      logger.info('All services stopped. Server exited.');
      return process.exit();
    }
  };

  process.on('SIGTERM', () => {
    logger.warn(`interrupt signal`);
    return shutdownProcess();
  });

  process.on('SIGINT', () => {
    logger.warn(`interrupt signal`);
    return shutdownProcess();
  });

  process.on('uncaughtException', (err) => {
    console.log(err);
    logger.error('uncaughtException');
    return shutdownProcess();
  });

  process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
    logger.error('unhandledRejection');
    return shutdownProcess();
  });

  //-- load env
  if (!environments || environments.length === 0) {
    logger.error('At least one environment must be set');
    throw jsonError(errors.SYSTEM_ERROR);
  }

  global.env = process.env.NODE_ENV || 'LCL';
  if (environments.indexOf(global.env) < 0) {
    logger.error('Environment not found');
    throw errors.SYSTEM_ERROR;
  }

  try {
    let env = dotenv.parse(fs.readFileSync(path.join(__dirname, `../env/${global.env}.env`)));
    process.env = Object.assign({}, env, process.env);
    logger.info(`Current environment: ${global.env}`);
  } catch (err) {
    logger.error(`File not found: ${env}.env`);
    throw errors.SYSTEM_ERROR;
  }

  global.getEnv = (key, defaultValue) => {
    key = `${global.env}_${key}`;
    if (process.env[key] !== null && process.env[key] !== undefined) {
      return process.env[key];
    }
    else if (defaultValue !== undefined) {
      return defaultValue;
    }
    else {
      logger.error(key);
      throw errors.ENV_NOT_SET_ERROR;
    }
  };

  logger.verbose('Pre-booting...');
  //-- pre-boot and load models
  awaitResult = await preBoot();
  if (!awaitResult.success) {
    throw awaitResult.error;
  }

  //-- boot the services
  // keys = Object.keys(services);
  // for (let i = 0; i < keys.length; i++) {
  //   let s = services[keys[i]];
  //   if (s.boot) {
  //     logger.verbose(`${s.name} booting`);
  //     awaitResult = await s.boot();
  //     if (awaitResult && !awaitResult.success)
  //       throw awaitResult.error;
  //     logger.verbose(`${s.name} boot completed`);
  //   }
  // }

  //-- run boot after all services had started
  awaitResult = await boot();
  if (!awaitResult.success) {
    throw awaitResult.error;
  }

  //-- create server and apply configs
  const app = express();
  let listener = app;

  app.use((req, res, next) => {
    if (global.isShuttingDown)
      return res.json(jsonError(errors.SERVER_SHUTTING_DOWN));
    return next();
  });

  if (config.session && config.session.enabled) {
    const session = require('express-session');
    app.use(session(config.session.settings));
  }

  if (config.socketIO && config.socketIO.enabled) {
    let http = require('http').Server(app);
    global.io = IO(http, config.socketIO.settings.options);
    if (config.socketIO.settings.jwt.enabled) {
      const socketJwt = require('socketio-jwt');
      io.use(socketJwt.authorize(config.socketIO.settings.jwt.settings));
    }
    listener = http;
  }

  if (config.static && config.static.enabled && config.static.settings && config.static.settings.length) {
    for (let i = 0; i < config.static.settings.length; i++) {
      app.use(config.static.settings[i].mount, express.static(config.static.settings[i].root, config.static.settings[i].options));
    }
  }

  if (config.fileUpload && config.fileUpload.enabled) {
    const fileUpload = require('express-fileupload');
    app.use(fileUpload(config.fileUpload.settings));
  }

  if (config.bodyParser && config.bodyParser.enabled) {
    const bodyParser = require('body-parser');
    if (config.bodyParser.settings.json && config.bodyParser.settings.json.enabled)
      app.use(bodyParser.json(config.bodyParser.settings.json.settings));
    if (config.bodyParser.settings.urlencoded && config.bodyParser.settings.urlencoded.enabled)
      app.use(bodyParser.urlencoded(config.bodyParser.settings.urlencoded.settings));
  }

  /** limit request: 100 request/1minute  */
  app.use(limiter)
  /** security header with helmet https://helmetjs.github.io/docs/ */
  app.use(helmet())

  /** Run cronjob */
  cronJob.runCronJob();

  if (config.CORS && config.CORS.enabled) {
    let settings = Object.keys(config.CORS.settings).map((key) => {
      return [key, config.CORS.settings[key]];
    });
    app.use((req, res, next) => {
      for (let i = 0; i < settings.length; i++) {
        res.header(settings[i][0], settings[i][1]);
      }
      next();
    });
  }

  //-- apply middleware
  if (regulators && regulators.length) {
    for (let i = 0; i < regulators.length; i++)
      app.use(regulators[i]);
  }

  //-- load controllers
  const controllers = require('./controllers');
  Object.keys(controllers).forEach(g => {
    logger.verbose(`Mounting controller group: ${g}`);
    controllers[g].controllers.forEach(c => {
      app.use(`${controllers[g].prefix ? '/' + controllers[g].prefix : ''}/${c.base || ''}`, c);
    })
  });

  //-- start server
  let port = getEnv('API_PORT');

  awaitResult = await new Promise((resolve, reject) => {
    listener.listen(port, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(jsonSuccess());
    }).on('error', (err) => {
      reject(jsonError(errors.LISTEN_ERROR));
    });
  });

  if (!awaitResult.success) {
    throw awaitResult.error;
  }

  // api document
  if (env === 'development' || env === 'LCL' || env === 'DEV') {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(api(port), {
      customSiteTitle: 'DAOLaunch - Documentation'
    }));
  }

  return { port };
})().then((result) => {
  logger.info(`Server bootstrapped. Listening at port: ${result.port}`);
})
  .catch((err) => {
    console.log(err);
    logger.error(err);
    process.exit();
  });
