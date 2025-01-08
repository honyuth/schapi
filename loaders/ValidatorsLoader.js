const loader = require('./_common/fileLoader');

/**
 * load any file that match the pattern of function file and require them
 * @return an array of the required functions
 */
module.exports = class ValidatorsLoader {
  constructor(responseDispatcher) {
    this.responseDispatcher = responseDispatcher;
  }

  parseError = (error) => {
    const zodErrors = error.errors.map((val) => ({
      [val.path.join(',')]: val.message,
    }));
    return zodErrors.reduce((acc, item) => {
      const key = Object.keys(item)[0];
      acc[key] = item[key];
      return acc;
    }, {});
  };

  validate = (schema, data) => {
    const result = schema.safeParse(data);
    return result.success ? null : this.parseError(result.error);
  };

  createValidationErrorsMw = (schema) => (req, res, next) => {
    const errors = this.validate(schema, req.body);
    if (errors) {
      return this.responseDispatcher.dispatch(res, {
        ok: false,
        errors: errors,
      });
    }
    next();
  };

  load() {
    /**
     * load custom validators
     */
    const validators = loader('./managers/**/*.schema.js');
    return {
      validate: this.validate,
      createValidationErrorsMw: this.createValidationErrorsMw,
      ...validators,
    };
  }
};
