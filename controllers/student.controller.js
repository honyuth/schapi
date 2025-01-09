const ApiController = require('./common/api.controller');
const Roles = require('../managers/api/_common/roles');

module.exports = class StudentController extends ApiController {
  validateClassroomId = async (classroomId, res) => {
    const classroomExists = await this.db.classroom.findById(classroomId);
    if (!classroomExists) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: `Classroom with id: ${classroomId} does not exist`,
      });
    }
    return null;
  };

  createStudent = async (req, res) => {
    const { firstName, lastName, dateOfBirth, authProfile, classrooms } =
      req.body;
    const { classroomId } = req.params;

    const result = await this.validateClassroomId(classroomId, res);
    if (result) return result;

    const user = await this.db.user.findById(authProfile);
    if (!user) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: `User  with id: ${authProfile} does not exist`,
      });
    } else if (user.role !== Roles.STUDENT.name) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: `User  with id: ${authProfile} is not a student`,
      });
    }

    const student = new this.db.student({
      firstName,
      lastName,
      dateOfBirth,
      authProfile,
      classroom: classroomId,
      classrooms,
      createdBy: req.currentUser._id,
    });

    const newStudent = await student.save();

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { student: this.formatResponse(newStudent) },
    });
  };

  updateStudent = async (req, res) => {
    const studentId = req.params.id;
    const { classroomId } = req.params;

    const result = await this.validateClassroomId(classroomId, res);
    if (result) return result;

    const { firstName, lastName, dateOfBirth, authProfile, classrooms } =
      req.body;

    if (authProfile) {
      const user = await this.db.user.findById(authProfile);
      if (!user) {
        return this.managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 404,
          message: `User  with id: ${authProfile} does not exist`,
        });
      }
    } else if (user.role !== Roles.STUDENT.name) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: `User  with id: ${authProfile} is not a student`,
      });
    }

    const updatedStudent = await this.db.student.findByIdAndUpdate(
      studentId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(authProfile && { authProfile }),
        ...(classrooms && { classrooms }),
      },
      { new: true, runValidators: true },
    );

    if (!updatedStudent) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'Student does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { student: this.formatResponse(updatedStudent) },
    });
  };

  deleteStudent = async (req, res) => {
    const studentId = req.params.id;
    const { classroomId } = req.params;

    const result = await this.validateClassroomId(classroomId, res);
    if (result) return result;

    const deletedStudent = await this.db.student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'Student does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      message: 'Student deleted successfully',
    });
  };

  getStudents = async (req, res) => {
    const { classroomId } = req.params;

    const result = await this.validateClassroomId(classroomId, res);
    if (result) return result;

    const students = await this.db.student.find({ classroom: classroomId });

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { students: students.map(this.formatResponse) },
    });
  };

  getStudent = async (req, res) => {
    const studentId = req.params.id;
    const { classroomId } = req.params;

    const result = await this.validateClassroomId(classroomId, res);
    if (result) return result;

    const student = await this.db.student.findById(studentId);

    if (!student) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'Student does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { student: this.formatResponse(student) },
    });
  };
};
