const config = require('./config/index.config.js');
const Cortex = require('ion-cortex');
const ManagersLoader = require('./loaders/ManagersLoader.js');

config.dotEnv.MONGO_URI
  ? require('./connect/mongo')({
      uri: config.dotEnv.MONGO_URI,
    })
  : null;

const cache = require('./cache/cache.dbh')({
  prefix: config.dotEnv.CACHE_PREFIX,
  url: config.dotEnv.CACHE_REDIS,
});

const cortex = new Cortex({
  prefix: config.dotEnv.CORTEX_PREFIX,
  url: config.dotEnv.CORTEX_REDIS,
  type: config.dotEnv.CORTEX_TYPE,
  state: () => {
    return {};
  },
  activeDelay: '50ms',
  idlDelay: '200ms',
});



const managersLoader = new ManagersLoader({ config, cache, cortex });
const managers = managersLoader.load();

// seed some data in development
if(config.dotEnv.NODE_ENV === 'development' && config.dotEnv.SEED_DB) {
  managers.seeder.run();
}

managers.userServer.run();
