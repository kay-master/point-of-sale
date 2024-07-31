import {
	BadRequestException,
	NotFoundException,
	UnprocessableEntity,
} from '@libs/middlewares';
import { Product } from '../db/models/product.model';
import {
	ProductCreationType,
	ProductUpdateSchema,
	ProductUpdateType,
} from '../schema/product.schema';
import { Op } from 'sequelize';
import { z } from 'zod';

const constructProduct = (product: Product) => ({
	productId: product.productId,
	name: product.name,
	sku: product.sku,
	price: product.price,
	quantity: product.quantity,
	description: product.description,
	createdAt: product.createdAt,
});

const fetchProductWithIds = async (productIds: string) => {
	let idList: number[] = [];

	try {
		idList = JSON.parse(productIds);
	} catch (error) {
		throw new UnprocessableEntity(
			'Invalid data type. Please provide a valid list of product IDs, i.e [1, 2, 3]',
			null
		);
	}

	const results = z.array(z.number()).safeParse(idList);

	if (!results.success) {
		throw new UnprocessableEntity(
			'Invalid request data. Please review your request and try again',
			results.error
		);
	}

	const ids = results.data;

	const products = await Product.findAll({
		where: {
			id: {
				[Op.in]: ids,
			},
		},
	});

	if (products.length !== ids.length) {
		const fetchedIds = products.map((product) => product.productId);

		const missingIds = ids.filter((id) => !fetchedIds.includes(id));
		throw new BadRequestException(
			`Products with the following IDs do not exist: ${missingIds.join(', ')}`,
			{
				missingIds,
			}
		);
	}

	return products.map((product) => constructProduct(product));
};

export const getProductsService = async (productIds?: string) => {
	if (productIds) {
		return await fetchProductWithIds(productIds);
	}

	const products = await Product.findAll();

	return products.map((product) => constructProduct(product));
};

/**
 * Generate a SKU
 * @param name
 * @returns
 */
const generateSKU = (name: string): string => {
	const uniqueIdentifier = Date.now().toString().slice(-5); // Unique identifier based on timestamp
	const cleanedName = name.replace(/\s+/g, '').toUpperCase().slice(0, 3); // Clean and shorten the name
	return `SKU-${cleanedName}-${uniqueIdentifier}`;
};

export const createProductService = async (data: ProductCreationType) => {
	const sku = generateSKU(data.name);

	return constructProduct(
		await Product.create({
			...data,
			sku,
		})
	);
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
