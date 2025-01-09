const { z } = require('zod');

module.exports = {
  createSchoolSchema: z.object({
    name: z
      .string({ message: 'Name is required' })
      .nonempty({ message: 'Name cannot be empty' }),
    address: z
      .string({ message: 'Address is required' })
      .nonempty({ message: 'Address cannot be empty' }),
    phone: z.string({ message: 'Phone must be a string' }).optional(),
    email: z
      .string({ message: 'Email is required' })
      .nonempty({ message: 'Email cannot be empty' })
      .email({ message: 'Email is invalid' }),
    establishedYear: z
      .number({ message: 'Established year must be a number' })
      .int({ message: 'Established year must be an integer' })
      .optional(),
    isActive: z
      .boolean({ message: 'isActive must be a boolean' })
      .default(true),
  }),

  updateSchoolSchema: z
    .object({
      name: z
        .string({ message: 'Name is required' })
        .nonempty({ message: 'Name cannot be empty' })
        .optional(),
      address: z
        .string({ message: 'Address is required' })
        .nonempty({ message: 'Address cannot be empty' })
        .optional(),
      phone: z.string({ message: 'Phone must be a string' }).optional(),
      email: z
        .string({ message: 'Email is required' })
        .nonempty({ message: 'Email cannot be empty' })
        .email({ message: 'Email is invalid' })
        .optional(),
      establishedYear: z
        .number({ message: 'Established year must be a number' })
        .int({ message: 'Established year must be an integer' })
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
