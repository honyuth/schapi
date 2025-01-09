const Roles = require('../managers/api/_common/roles');

module.exports = ({ meta, config, managers }) => {
  return async (req, res, next) => {
    if (!req.headers.token) {
      console.log('token required but not found');
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        message: 'unauthorized',
      });
    }
    try {
      const decoded = managers.token.verifyLongToken({
        token: req.headers.token,
      });
      if (!decoded) {
        console.log('failed to decode-1');
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 401,
          message: 'unauthorized',
        });
      }
      const currentUser = await managers.mongo.user.findById(decoded.userId);
      if (!currentUser || currentUser.deleted) {
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 401,
          message: 'unauthorized',
        });
      }
      // inject current user into the request object
      const { password: _, ...userWithoutPassword } = currentUser._doc;
      req.currentUser = {
        ...userWithoutPassword,
        permissions: Object.values(Roles).find(
          (role) => role.name === currentUser.role,
        ).permissions,
      };

      next();
    } catch (err) {
      console.log('failed to decode-2', err);
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        message: 'unauthorized',
      });
    }
  };
};
