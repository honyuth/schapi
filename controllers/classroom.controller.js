const ApiController = require('./common/api.controller');

module.exports = class ClassroomController extends ApiController {
  validateSchoolId = async (schoolId, res) => {
    const schoolExists = await this.db.school.findById(schoolId);
    if (!schoolExists) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: `School with id: ${schoolId} does not exist`,
      });
    }
    return null;
  };

  createClassroom = async (req, res) => {
    const { name, capacity } = req.body;
    const { schoolId } = req.params;

    const result = await this.validateSchoolId(schoolId, res);
    if (result) return result;

    const classroom = new this.db.classroom({
      name,
      capacity,
      school: schoolId,
      createdBy: req.currentUser._id,
    });

    const newClassroom = await classroom.save();

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { classroom: this.formatResponse(newClassroom) },
    });
  };

  updateClassroom = async (req, res) => {
    const classroomId = req.params.id;
    const { schoolId } = req.params;
    const result = await this.validateSchoolId(schoolId, res);
    if (result) return result;

    const { name, capacity } = req.body;

    const updatedClassroom = await this.db.classroom.findByIdAndUpdate(
      classroomId,
      {
        ...(name && { name }),
        ...(capacity && { capacity }),
      },
      { new: true, runValidators: true },
    );

    if (!updatedClassroom) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'Classroom does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { classroom: this.formatResponse(updatedClassroom) },
    });
  };

  deleteClassroom = async (req, res) => {
    const classroomId = req.params.id;
    const { schoolId } = req.params;
    const result = await this.validateSchoolId(schoolId, res);
    if (result) return result;

    const deletedClassroom = await this.db.classroom.findByIdAndDelete(
      classroomId,
    );

    if (!deletedClassroom) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'Classroom does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      message: 'Classroom deleted successfully',
    });
  };

  getClassrooms = async (req, res) => {
    const { schoolId } = req.params;

    const result = await this.validateSchoolId(schoolId, res);
    if (result) return result;

    const classrooms = await this.db.classroom.find({ school: schoolId });

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { classrooms: classrooms.map(this.formatResponse) },
    });
  };

  getClassroom = async (req, res) => {
    const classroomId = req.params.id;
    const { schoolId } = req.params;
    const result = await this.validateSchoolId(schoolId, res);
    if (result) return result;

    const classroom = await this.db.classroom.findById(classroomId);

    if (!classroom) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'Classroom does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { classroom: this.formatResponse(classroom) },
    });
  };
};
