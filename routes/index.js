const Router = require('express');
const UserRouter = require('./user.route');
const SchoolRouter = require('./school.route');
const UserController = require('../controllers/user.controller');

module.exports = (managers, mwsRepo) => {
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
  router.use(mwsRepo.authentication);
  router.use('/admin', UserRouter(managers, mwsRepo));
  router.use('/admin', SchoolRouter(managers, mwsRepo));

  return router;
};
