import express, { ErrorRequestHandler } from 'express';
import { createPhotoHandler as createPhotoHandler, getAllPhotoHandler } from './controllers/photoController';
import path from 'path';
import { uriGenerator } from './controllers/uriGenerator';



const app = express();
app.use(express.json());

app.get(path.join(uriGenerator('photo'), 'all'), async(req, res, next) => {
  await getAllPhotoHandler(req, res, next);
  next();
});
app.post(path.join(uriGenerator('photo'), 'create'), async (req, res, next) => {
  await createPhotoHandler(req, res);
  next();
});

app.get('/', (req, res, next) => {
  res.send('Hello World!');
  console.log('Hello, World');
  next();
});

app.get('*', function(req, res, next){
  res.status(404);
  res.send('404 Not found!');
  next();
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
};

app.use(errorHandler);

export { app };
