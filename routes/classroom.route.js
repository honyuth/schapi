const express = require('express');
const ClassroomController = require('../controllers/classroom.controller');

module.exports = (managers, mwsRepo) => {
  const router = express.Router({ mergeParams: true });
  const controller = new ClassroomController(managers);
  const { createValidationErrorsMw, classroom: validators } =
    managers.validators;

  router.use(mwsRepo.authorization('edit', 'classrooms'));

  router.get('/classrooms', controller.getClassrooms);
  router.get('/classrooms/:id', controller.getClassroom);
  router.post(
    '/classrooms',
    createValidationErrorsMw(validators.createClassroomSchema),
    controller.createClassroom,
  );
  router.patch(
    '/classrooms/:id',
    createValidationErrorsMw(validators.updateClassroomSchema),
    controller.updateClassroom,
  );
  router.delete('/classrooms/:id', controller.deleteClassroom);

  return router;
};
