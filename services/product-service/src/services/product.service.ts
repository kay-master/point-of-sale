import { NotFoundException, UnprocessableEntity } from '@libs/middlewares';
import { Product } from '../db/models/product.model';
import {
	ProductCreationType,
	ProductUpdateSchema,
	ProductUpdateType,
} from '../schema/product.schema';

const constructProduct = (product: Product) => ({
	id: product.id,
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
