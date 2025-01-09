const ApiController = require('./common/api.controller');

module.exports = class SchoolController extends ApiController {
  createSchool = async (req, res) => {
    const { name, address, phone, email, establishedYear } = req.body;

    const school = new this.db.school({
      name,
      address,
      phone,
      email,
      establishedYear,
      createdBy: req.currentUser._id,
    });

    const newSchool = await school.save();

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { school: this.formatResponse(newSchool) },
    });
  };

  updateSchool = async (req, res) => {
    const schoolId = req.params.id;
    const { name, address, phone, email, establishedYear, isActive } = req.body;

    const updatedSchool = await this.db.school.findByIdAndUpdate(
      schoolId,
      {
        ...(name && { name }),
        ...(address && { address }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(establishedYear && { establishedYear }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true },
    );

    if (!updatedSchool) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'School does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { school: this.formatResponse(updatedSchool) },
    });
  };

  deleteSchool = async (req, res) => {
    const schoolId = req.params.id;

    const deletedSchool = await this.db.school.findByIdAndDelete(schoolId);

    if (!deletedSchool) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'School does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      message: 'School deleted successfully',
    });
  };

  getSchools = async (req, res) => {
    const schools = await this.db.school.find();

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { schools: schools.map(this.formatResponse) },
    });
  };

  getSchool = async (req, res) => {
    const schoolId = req.params.id;

    const school = await this.db.school.findById(schoolId);

    if (!school) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'School does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { school: this.formatResponse(school) },
    });
  };
};
