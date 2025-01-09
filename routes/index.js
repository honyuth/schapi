const Router = require('express');
const UserRouter = require('./user.route');
const SchoolRouter = require('./school.route');
const ClassroomRouter = require('./classroom.route');
const StudentRouter = require('./student.route');
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

  /* School routes */
  router.use('/schools/:schoolId', ClassroomRouter(managers, mwsRepo));
  router.use('/classrooms/:classroomId', StudentRouter(managers, mwsRepo));

  return router;
};
