const Router = require('express');
const SchoolController = require('../controllers/school.controller');

module.exports = (managers, mwsRepo) => {
  const router = Router();
  const controller = new SchoolController(managers);
  const { createValidationErrorsMw, school: validators } = managers.validators;

  router.use(mwsRepo.authorization('edit', 'schools'));

  router.get('/schools', controller.getSchools);
  router.get('/schools/:id', controller.getSchool);
  router.post(
    '/schools',
    createValidationErrorsMw(validators.createSchoolSchema),
    controller.createSchool,
  );
  router.patch(
    '/schools/:id',
    createValidationErrorsMw(validators.updateSchoolSchema),
    controller.updateSchool,
  );
  router.delete('/schools/:id', controller.deleteSchool);

  return router;
};
