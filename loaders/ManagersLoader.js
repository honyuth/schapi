const MiddlewaresLoader = require('./MiddlewaresLoader');
const ApiHandler = require('../managers/api/Api.manager');
const LiveDB = require('../managers/live_db/LiveDb.manager');
const UserServer = require('../managers/http/UserServer.manager');
const Seeder = require('../managers/seed/seed.manager');
const ResponseDispatcher = require('../managers/response_dispatcher/ResponseDispatcher.manager');
const VirtualStack = require('../managers/virtual_stack/VirtualStack.manager');
const ValidatorsLoader = require('./ValidatorsLoader');
const ResourceMeshLoader = require('./ResourceMeshLoader');
const utils = require('../libs/utils');

const systemArch = require('../static_arch/main.system');
const TokenManager = require('../managers/token/Token.manager');
const SharkFin = require('../managers/shark_fin/SharkFin.manager');
const TimeMachine = require('../managers/time_machine/TimeMachine.manager');
const MongoLoader = require('../loaders/MongoLoader');

/**
 * load sharable modules
 * @return modules tree with instance of each module
 */
module.exports = class ManagersLoader {
  constructor({ config, cortex, cache, oyster, aeon }) {
    this.managers = {};
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;

    this._preload();
    this.injectable = {
      utils,
      cache,
      config,
      cortex,
      oyster,
      aeon,
      managers: this.managers,
      mongomodels: this.mongomodels,
      resourceNodes: this.resourceNodes,
    };
  }

  _preload() {
    const resourceMeshLoader = new ResourceMeshLoader({});
    const mongoLoader = new MongoLoader({ schemaExtension: 'mongoModel.js' });

    this.resourceNodes = resourceMeshLoader.load();
    this.mongomodels = mongoLoader.load();
  }

  load() {
    const responseDispatcher = new ResponseDispatcher();
    this.managers.responseDispatcher = responseDispatcher;
    this.managers.liveDb = new LiveDB(this.injectable);
    const middlewaresLoader = new MiddlewaresLoader(this.injectable);
    const mwsRepo = middlewaresLoader.load();
    const { layers, actions } = systemArch;
    this.injectable.mwsRepo = mwsRepo;
    /*****************************************CUSTOM MANAGERS*****************************************/
    this.managers.shark = new SharkFin({ ...this.injectable, layers, actions });
    this.managers.timeMachine = new TimeMachine(this.injectable);
    this.managers.token = new TokenManager(this.injectable);
    /*************************************************************************************************/
    this.managers.mwsExec = new VirtualStack({
      ...{ preStack: [/* '__token', */ '__device'] },
      ...this.injectable,
    });
    this.managers.userApi = new ApiHandler({
      ...this.injectable,
      ...{ prop: 'httpExposed' },
    });
    this.managers.userServer = new UserServer({
      config: this.config,
      managers: this.managers,
      mwsRepo: mwsRepo,
    });
    this.managers.mongo = this.mongomodels;
    console.log(responseDispatcher);
    this.managers.validators = new ValidatorsLoader(responseDispatcher).load();
    this.managers.seeder = new Seeder(this.mongomodels);

    return this.managers;
  }
};
