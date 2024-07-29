import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email().toLowerCase(),
	password: z.string().min(6).max(36),
});

export const RegisterSchema = z.object({
	...LoginSchema.shape,
	firstName: z.string().min(2).max(36),
	lastName: z.string().min(2).max(36),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
