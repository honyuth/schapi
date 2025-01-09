//TODO(solo): Think about moving roles and permissions to mongoDB
const Roles = Object.freeze({
  SUPER_ADMIN: {
    name: 'SuperAdmin',
    permissions: [],
  },
  SCHOOL_ADMIN: {
    name: 'SchoolAdmin',
    permissions: [
      { action: 'view', resourceTypes: 'student' },
      { action: 'edit', resourceType: 'student' },
      { action: 'view', resourceType: 'classroom' },
    ],
  },
  STUDENT: {
    name: 'Student',
    permissions: [
      { action: 'view', resourceType: 'student' },
      { action: 'view', resourceType: 'student_profile' },
    ],
  },
});

module.exports = Roles;
