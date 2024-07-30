import { z } from 'zod';

export const ProductCreationSchema = z.object({
	name: z.string().min(2).max(32),
	price: z.number(),
	description: z.string().min(5, {
		message: 'Description should be minimum of 5 characters',
	}),
	quantity: z.number(),
});

export const ProductUpdateSchema = ProductCreationSchema.partial();

export type ProductCreationType = z.infer<typeof ProductCreationSchema>;
export type ProductUpdateType = z.infer<typeof ProductUpdateSchema>;
