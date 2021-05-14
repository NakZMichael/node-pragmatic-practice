import express from 'express';
import { customerHandler } from './customer';
import config from '../config';

const app = express();
app.use(express.json());

app.get(config.app.customer.api,customerHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export { app };
