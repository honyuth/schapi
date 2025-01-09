module.exports = class ApiController {
  constructor(managers) {
    this.managers = managers;
    this.db = managers.mongo;
  }

  formatResponse = (item) => {
    const { _id: id, __v: _, ...itemWithoutId } = item._doc;
    return { id, ...itemWithoutId };
  };
};
