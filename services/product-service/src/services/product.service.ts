import { NotFoundException, UnprocessableEntity } from '@libs/middlewares';
import { Product } from '../db/models/product.model';
import {
	ProductCreationType,
	ProductUpdateSchema,
	ProductUpdateType,
} from '../schema/product.schema';

const constructProduct = (product: Product) => ({
	productId: product.productId,
	name: product.name,
	price: product.price,
	quantity: product.quantity,
	description: product.description,
	createdAt: product.createdAt,
});

export const getProductsService = async () => {
	const products = await Product.findAll();

	return products.map((product) => constructProduct(product));
};

export const createProductService = async (data: ProductCreationType) => {
	return constructProduct(await Product.create(data));
};

export const updateProductService = async (
	id: number,
	data: ProductUpdateType
) => {
	const product = await Product.findByPk(id);

	if (Object.keys(data).length === 0) {
		throw new UnprocessableEntity('At least one field must be provided', {
			fields: Object.keys(ProductUpdateSchema.shape),
		});
	}

	if (!product) {
		throw new NotFoundException('Product not found', null);
	}

	return constructProduct(await product.update(data));
};

/**
 * Deleting a product
 *
 * A product that has upsell products cannot be deleted, the upsell products must be deleted first
 */
export const deleteProductService = async (productId: number) => {
	const product = await Product.scope('withUpsells').findByPk(productId);

	if (!product) {
		throw new NotFoundException('Product not found', null);
	}

	// Check if the product has upsell products
	if (product.upsellProducts.length > 0) {
		throw new UnprocessableEntity(
			'Product has upsell products, delete upsell products first',
			{
				upsellProducts: product.upsellProducts.map(
					(upsell) => upsell.upsellProductId
				),
			}
		);
	}

	await product.destroy();

	return product;
};
