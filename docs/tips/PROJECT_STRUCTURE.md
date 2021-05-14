## Structure your solution by components

The very least you should do is create basic borders between components, assign a folder in your project root for each business component and make it self-contained - other components are allowed to consume its functionality only through its public interface or API.

## Layer your app, keep Express within its boundaries

Keep the Express in the Web layer only!
It get tests easer.

## Wrap common utilities as npm packages

 In a large app that constitutes a large codebase, cross-cutting-concern utilities like a logger, encryption and alike, should be wrapped by your code and exposed as private npm packages. This allows sharing them among multiple codebases and projects

 If you are at this stage, check out [here](https://docs.npmjs.com/creating-and-publishing-private-packages)!

 ### Separate Express 'app' and 'server'

 API declaration, should reside in app.js/app.ts

 ```typescript
const app = express();
app.use(bodyParser.json());
app.use('/api/events', events.API);
app.use('/api/forms', forms);
 ```

### Server network declaration, should reside in /bin/www

```typescript
import app from '../app';
import http from 'http';

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);
```

I think it would be better to reside in $projct_root/index.ts.
Then codes above reduce into ones below.

```typescript
import app from './app';
import http from 'http';

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);
```

### test your API in-process using supertest (popular testing package)

Example

```typescript
import * as request from "supertest";
const app = express();

app.get('/user', (req: Request, res: Response) => {
  res.status(200).json({ name: 'tobi' });
});

request(app)
  .get('/user')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end((err: Error) => {
    if (err) throw err;
  });
```


##  Use environment aware, secure and hierarchical config

A perfect and flawless configuration setup should ensure 

- keys can be read from file AND from environment variable
- secrets are kept outside committed code
- config is hierarchical for easier findability.


