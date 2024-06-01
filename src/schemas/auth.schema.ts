import z from 'zod';

export const loginSchema = z.object({
	email: z.string({ required_error: 'Enter your email' }),
	password: z.string({ required_error: 'Enter your password' }),
	company_code: z.string({ required_error: 'Select your factory' }),
	department_code: z.string({ required_error: 'Select your department' })
});

export type LoginFormValues = z.infer<typeof loginSchema>;
