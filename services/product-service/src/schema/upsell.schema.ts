import { z } from 'zod';

export const UpsellCreationSchema = z.object({
	/** Product Id of the product that will be linked with the upselled product */
	productId: z
		.number({
			invalid_type_error: 'Product Id should be a number',
			required_error: 'Product Id is required',
		})
		.int({
			message: 'Product Id should be an integer',
		}),
	/** Product Id of the product to be upselled */
	upsellProductId: z
		.number({
			invalid_type_error: 'Upsell Product Id should be a number',
			required_error: 'Upsell Product Id is required',
		})
		.int({
			message: 'Upsell Product Id should be an integer',
		}),
});

export type UpsellCreationType = z.infer<typeof UpsellCreationSchema>;
