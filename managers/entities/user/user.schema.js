const { z } = require('zod');
const Roles = require('../../api/_common/roles');

module.exports = {
  loginSchema: z.object({
    username: z
      .string({ message: 'Username is required' })
      .nonempty({ message: 'Username is required' }),
    password: z
      .string({ message: 'Password is required' })
      .nonempty({ message: 'Password is required' }),
  }),

  createUserSchema: z.object({
    username: z
      .string({ message: 'Username is required' })
      .nonempty({ message: 'Username is required' }),
    email: z
      .string({ message: 'Email is required' })
      .nonempty({ message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
    role: z
      .string({ message: 'Role is required' })
      .nonempty({ message: 'Role is required' })
      .refine((role) => Object.values(Roles).includes(role), {
        message: `Invalid role, must be one of: ${Object.values(Roles).join(
          ', ',
        )}`,
      }),
    password: z
      .string({ message: 'Password is required' })
      .nonempty('Password is required')
      .min(6, { message: 'The minimum password length is 6 characters' })
      .refine(
        (password) =>
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password),
        {
          message: 'Cannot use a weak password',
        },
      ),
  }),

  updateUserSchema: z
    .object({
      username: z
        .string({ message: 'Username is required' })
        .nonempty({ message: 'Username is required' })
        .optional(),
      email: z
        .string({ message: 'Email is required' })
        .nonempty({ message: 'Email is required' })
        .email({ message: 'Email is invalid' })
        .optional(),
      role: z
        .string({ message: 'Role is required' })
        .nonempty({ message: 'Role is required' })
        .refine((role) => Object.values(Roles).includes(role), {
          message: `Invalid role, must be one of: ${Object.values(Roles).join(
            ', ',
          )}`,
        })
        .optional(),
      password: z
        .string({ message: 'Password is required' })
        .nonempty('Password is required')
        .min(6, { message: 'The minimum password length is 6 characters' })
        .refine(
          (password) =>
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password),
          {
            message: 'Cannot use a weak password',
          },
        )
        .optional(),
    })
    .refine(
      (data) => Object.values(data).some((value) => value !== undefined),
      {
        message:
          'At least one field (username, email, role, or password) is required',
      },
    ),
};
