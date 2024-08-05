import { OrderStatus } from '@libs/interfaces';
import { z } from 'zod';

export const OrderCreationSchema = z.object({
	items: z
		.array(
			z.object({
				productId: z.number(),
				quantity: z.number(),
			}),
			{
				invalid_type_error: 'Order products must be an array',
				message: 'Order products are required',
			}
		)
		.nonempty({
			message: 'Order products are required',
		}),
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

const filterOrderStatus = Object.values(OrderStatus)
	.map((role) => role)
	.filter((role) => role !== OrderStatus.PENDING);

export const OrderUpdateSchema = z.object({
	status: z.enum([OrderStatus.PENDING, ...filterOrderStatus]),
});

export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;
