import { app } from './app';
import config from './config';

import 'reflect-metadata';
import { createConnection } from 'typeorm';


createConnection(config.app.db).then(
  () => {
    const port = config.app.server.port;
    app.listen(port, () => {
      console.log(`App listening on port http://localhost:${port} !!`);
    });
  }
).catch(error => console.log(error));