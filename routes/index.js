const Router = require('express');
const UserRouter = require('./user.route');
const UserController = require('../controllers/user.controller');

module.exports = (managers) => {
  const router = Router();
  const controller = new UserController(managers);
  const { createValidationErrorsMw, user: userValidators } =
    managers.validators;

  // register all routes

  /* Authentication routes */
  router.post(
    '/auth/login',
    createValidationErrorsMw(userValidators.loginSchema),
    controller.login,
  );

  /* Admin routes */
  router.use('/admin', UserRouter(managers));

  return router;
};
