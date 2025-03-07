module.exports =
  ({ meta, config, managers }) =>
  (operation, resourceType) =>
  (req, res, next) => {
    if (!req.currentUser) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        message: 'You are not authorized to perform this operation',
      });
    }

    user = req.currentUser;
    if (user.isSuperAdmin) {
      return next();
    }

    const isAuthorized = user.permissions.some(
      (permission) =>
        permission.action === operation &&
        permission.resourceType === resourceType,
    );

    if (!isAuthorized) {
      console.log(
        `You do not have the '${operation}' permission on ${resourceType}. `,
      );
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 403,
        message: 'You are not authorized to perform this operation',
      });
    }

    next();
  };
