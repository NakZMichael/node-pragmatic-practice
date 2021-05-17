import express from 'express';
import { customerHandler } from './controllers/customer';
import config from './config';
import { createPhotoHandler as createPhotoHandler, getAllPhotoHandler } from './controllers/photoController';
import path from 'path';
import { uriGenerator } from './controllers/uriGenerator';


const app = express();
app.use(express.json());

app.get(config.app.server.api.customer.api,customerHandler);

app.get(path.join(uriGenerator('photo'),'all'), getAllPhotoHandler);
app.get(path.join(uriGenerator('photo'),'create'),createPhotoHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export { app };
