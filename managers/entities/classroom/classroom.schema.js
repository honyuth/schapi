const { z } = require('zod');

module.exports = {
  createClassroomSchema: z.object({
    name: z
      .string({ message: 'Name is required' })
      .nonempty({ message: 'Name cannot be empty' }),
    capacity: z
      .number({ message: 'Capacity is required' })
      .int({ message: 'Capacity must be an integer' })
      .min(1, { message: 'Capacity must be at least 1' }),
    school: z
      .string({ message: 'School ID is required' })
      .nonempty({ message: 'School ID cannot be empty' }),
  }),

  updateClassroomSchema: z
    .object({
      name: z
        .string({ message: 'Name must be a string' })
        .nonempty({ message: 'Name cannot be empty' })
        .optional(),
      capacity: z
        .number({ message: 'Capacity must be a number' })
        .int({ message: 'Capacity must be an integer' })
        .min(1, { message: 'Capacity must be at least 1' })
        .optional(),
      school: z
        .string({ message: 'School ID must be a string' })
        .nonempty({ message: 'School ID cannot be empty' })
        .optional(),
    })
    .refine(
      (data) => Object.values(data).some((value) => value !== undefined),
      {
        message: 'At least one field must be provided to update',
      },
    ),
};
