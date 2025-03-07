const express = require('express');
const UserController = require('../controllers/user.controller');

module.exports = (managers, mwsRepo) => {
  const router = express.Router();
  router.use(mwsRepo.authorization('edit', 'users'));

  const controller = new UserController(managers);
  const { createValidationErrorsMw, user: userValidators } =
    managers.validators;

  // user routes
  router.get('/users', controller.getUsers);
  router.get('/users/:id', controller.getUser);
  router.post(
    '/users',
    createValidationErrorsMw(userValidators.createUserSchema),
    controller.createUser,
  );
  router.patch(
    '/users/:id',
    createValidationErrorsMw(userValidators.updateUserSchema),
    controller.updateUser,
  );
  router.delete('/users/:id', controller.deleteUser);

  return router;
};
