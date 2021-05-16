import express from 'express';
import { customerHandler } from './controllers/customer';
import config from './config';
import { getAllPhotoHandler } from './controllers/photoController';



const app = express();
app.use(express.json());

app.get(config.app.customer.api,customerHandler);

app.get('/photos', getAllPhotoHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export { app };
