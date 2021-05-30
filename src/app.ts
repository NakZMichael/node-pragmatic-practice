import express, { ErrorRequestHandler } from 'express';
import { createPhotoHandler as createPhotoHandler, getAllPhotoHandler } from './controllers/photoController';
import path from 'path';
import { uriGenerator } from './controllers/common/uriGenerator';
import { AppLogger } from './logging';
import { AppError, WrappedError } from './error';



const app = express();
app.use(express.json());

app.get(path.join(uriGenerator('photo'), 'all'), async(req, res, next) => {
  await getAllPhotoHandler(req, res, next);
  next();
});
app.post(path.join(uriGenerator('photo'), 'create'), createPhotoHandler);

app.get('/', getAllPhotoHandler);

app.get('*', function(req, res){
  res.status(404);
  res.send('404 Not found!');
  throw new Error(`404 Not Found Error: ${req.url}`);
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.constructor.name);
  if(err instanceof AppError){
    const { logger, ...modifiedError } = err;
    modifiedError.stack = err.stack;
    logger.error(modifiedError);
  }
  else{
    console.error('Unwrapped Error is caught, please use classe of WrappedError');
    console.error(err);
  }
  if(!res.statusCode){
    res.status(500).send('Something broke!');
  }
  next();
};

app.use(errorHandler);

export { app };
