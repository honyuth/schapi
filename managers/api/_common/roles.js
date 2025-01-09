//TODO(solo): Think about moving roles and permissions to mongoDB
const Roles = Object.freeze({
  SUPER_ADMIN: {
    name: 'SuperAdmin',
    permissions: [],
  },
  SCHOOL_ADMIN: {
    name: 'SchoolAdmin',
    permissions: [
      { action: 'view', resourceTypes: 'students' },
      { action: 'edit', resourceType: 'students' },
      { action: 'edit', resourceType: 'classrooms' },
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
