const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const swaggerUi = require('swagger-ui-express');
const ApiRouter = require('../../routes');

const fs = require('fs');
const YAML = require('yaml');

const file = fs.readFileSync('docs/api.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

module.exports = class UserServer {
  constructor({ config, managers, mwsRepo }) {
    this.config = config;
    this.userApi = managers.userApi;
    this.managers = managers;
    this.mwsRepo = mwsRepo;
  }

  /** for injecting middlewares */
  use(args) {
    app.use(args);
  }

  /** server configs */
  run() {
    app.use(morgan('combined'));

    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/static', express.static('public'));

    /** an error handler */
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    /** a single middleware to handle all */
    //TODO(solo): Figure out what this is trying to do
    // app.all('/api/:moduleName/:fnName', this.userApi.mw);

    // Middleware to serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // register API routes
    app.use('/api', ApiRouter(this.managers, this.mwsRepo));

    let server = http.createServer(app);
    server.listen(this.config.dotEnv.USER_PORT, () => {
      console.log(
        `${this.config.dotEnv.SERVICE_NAME.toUpperCase()} is running on port: ${
          this.config.dotEnv.USER_PORT
        }`,
      );
    });
  }
};
