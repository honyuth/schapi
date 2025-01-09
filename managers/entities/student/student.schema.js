const { z } = require('zod');

module.exports = {
  createStudentSchema: z.object({
    authProfile: z
      .string({ message: 'Auth profile (user ID) is required' })
      .nonempty({ message: 'Auth profile cannot be empty' }),
    firstName: z
      .string({ message: 'First name is required' })
      .nonempty({ message: 'First name cannot be empty' }),
    lastName: z
      .string({ message: 'Last name is required' })
      .nonempty({ message: 'Last name cannot be empty' }),
    dateOfBirth: z
      .string({ message: 'Date of birth is required' })
      .nonempty({ message: 'Date of birth cannot be empty' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Date of birth must be a valid date',
      }),
    enrollmentDate: z
      .string({ message: 'Enrollment date must be a valid date' })
      .optional()
      .default(() => new Date().toISOString()),
    isActive: z
      .boolean({ message: 'isActive must be a boolean' })
      .default(true),
  }),

  updateStudentSchema: z
    .object({
      authProfile: z
        .string({ message: 'Auth profile (user ID) must be a string' })
        .nonempty({ message: 'Auth profile cannot be empty' })
        .optional(),
      firstName: z
        .string({ message: 'First name must be a string' })
        .nonempty({ message: 'First name cannot be empty' })
        .optional(),
      lastName: z
        .string({ message: 'Last name must be a string' })
        .nonempty({ message: 'Last name cannot be empty' })
        .optional(),
      dateOfBirth: z
        .string({ message: 'Date of birth must be a valid date' })
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Date of birth must be a valid date',
        })
        .optional(),
      enrollmentDate: z
        .string({ message: 'Enrollment date must be a valid date' })
        .optional(),
      isActive: z.boolean({ message: 'isActive must be a boolean' }).optional(),
    })
    .refine(
      (data) => Object.values(data).some((value) => value !== undefined),
      {
        message: 'At least one field must be provided to update',
      },
    ),
};
