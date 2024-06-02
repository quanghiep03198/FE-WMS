import z from 'zod';

export const loginSchema = z.object({
	email: z.string({ required_error: 'Enter your email' }),
	password: z.string({ required_error: 'Enter your password' })
});

export type LoginFormValues = z.infer<typeof loginSchema>;
