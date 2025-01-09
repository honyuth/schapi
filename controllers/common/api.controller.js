module.exports = class ApiController {
  constructor(managers) {
    this.managers = managers;
    this.db = managers.mongo;
  }
};
