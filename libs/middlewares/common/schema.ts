import { z } from "zod";

export const NameSchema = z.object({
	name: z.string().min(2).max(32),
});

export const EmailSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
});

export const FullNameSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(2),
});

export const AccountDetailsSchema = z.object({
	...FullNameSchema.shape,
	...EmailSchema.shape,
	accountId: z.number(),
	organizationName: z.string().min(2).max(32),
});

export type AccountDetails = z.infer<typeof AccountDetailsSchema>;
