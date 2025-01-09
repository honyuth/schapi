const express = require('express');
const StudentController = require('../controllers/student.controller');

module.exports = (managers, mwsRepo) => {
  const router = express.Router({ mergeParams: true });
  const controller = new StudentController(managers);
  const { createValidationErrorsMw, student: validators } = managers.validators;

  router.use(mwsRepo.authorization('edit', 'students'));

  router.get('/students', controller.getStudents);
  router.get('/students/:id', controller.getStudent);
  router.post(
    '/students',
    createValidationErrorsMw(validators.createStudentSchema),
    controller.createStudent,
  );
  router.patch(
    '/students/:id',
    createValidationErrorsMw(validators.updateStudentSchema),
    controller.updateStudent,
  );
  router.delete('/students/:id', controller.deleteStudent);

  return router;
};
