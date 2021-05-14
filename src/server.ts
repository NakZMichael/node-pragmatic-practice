import { app } from './controllers/app';
import config from './config';

const port = config.app.port;
app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port} !!`);
});