import { z } from 'zod';

export const OrderCreationSchema = z.object({
	items: z.array(
		z.object({
			productId: z.number(),
			quantity: z.number(),
		})
	),
	upsellItems: z
		.array(
			z.object({
				productId: z.number(),
				quantity: z.number(),
				upsellProductId: z.number(),
			})
		)
		.optional(),
});

export type OrderCreationType = z.infer<typeof OrderCreationSchema>;
