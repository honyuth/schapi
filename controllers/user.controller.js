const bcrypt = require('bcrypt');
const Roles = require('../managers/api/_common/roles');

module.exports = class UserController {
  constructor(managers) {
    this.managers = managers;
    this.db = managers.mongo;
  }

  formatUser = (user) => {
    const { password: _password, _id: id, ...userWithoutPassword } = user._doc;
    return { id, ...userWithoutPassword };
  };

  login = async (req, res) => {
    const { username: identifier, password } = req.body;
    const user = await this.db.user.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        message: 'Wrong username or password',
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        message: 'Wrong username or password',
      });
    }
    const token = this.managers.token.genLongToken({
      userId: user.id,
      userKey: user.username,
    });

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { user: this.formatUser(user), token },
    });
  };

  createUser = async (req, res) => {
    const { username, password, role, email } = req.body;
    const user = new this.db.user({
      email,
      isSuperAdmin: role === Roles.SCHOOL_ADMIN,
      password: await bcrypt.hash(password, 10),
      role,
      username,
    });
    const newUser = await user.save();

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { user: this.formatUser(newUser) },
    });
  };

  updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, password, role, email } = req.body;
    const updatedUser = await this.db.user.findByIdAndUpdate(
      userId,
      {
        ...(username && { username }),
        ...(password && { password: await bcrypt.hash(password, 10) }),
        ...(role && { role }),
        ...(email && { email }),
        ...(typeof role !== 'undefined' && {
          isSuperAdmin: role === Roles.SCHOOL_ADMIN,
        }),
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'User does not exist',
      });
    }

    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: this.formatUser(updatedUser),
    });
  };

  deleteUser = async (req, res) => {
    const userId = req.params.id;
    const deletedUser = await this.db.user.findByIdAndDelete(userId);
    if (!deletedUser) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'User does not exist',
      });
    }
    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      message: 'User deleted successfully',
    });
  };

  getUsers = async (req, res) => {
    const users = await this.db.user.find();
    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { users: users.map(this.formatUser) },
    });
  };

  getUser = async (req, res) => {
    const userId = req.params.id;
    const user = await this.db.user.findById(userId);
    if (!user) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        message: 'User does not exist',
      });
    }
    return this.managers.responseDispatcher.dispatch(res, {
      ok: true,
      data: { user: this.formatUser(user) },
    });
  };
};
