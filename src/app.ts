import express, { ErrorRequestHandler } from 'express';
import { createPhotoHandler as createPhotoHandler, getAllPhotoHandler } from './controllers/photoController';
import path from 'path';
import { uriGenerator } from './controllers/uriGenerator';
import winston,{ format } from 'winston';

const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = express();
app.use(express.json());

app.get(path.join(uriGenerator('photo'),'all'),async(req,res,next) => {
  await getAllPhotoHandler(req,res,next);
  next();
});
app.post(path.join(uriGenerator('photo'),'create'),async (req,res,next) => {
  await createPhotoHandler(req,res);
  next();
});

app.get('/', (req, res,next) => {
  res.send('Hello World!');
  next();
});

app.get('*', function(req, res,next){
  res.status(404);
  res.send('404 Not found!');
  next();
});

app.use((req, res, next) => {
  logger.log({
    level: 'info',
    message: `Request:${req.url} Resp:${res.statusCode}`
  });
  next();
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
};
app.use(errorHandler);

export { app };
