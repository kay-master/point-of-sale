import { Op } from 'sequelize';
import { Product } from '../db/models/product.model';
import { UpsellCreationType } from '../schema/upsell.schema';
import { BadRequestException, NotFoundException } from '@libs/middlewares';
import { UpsellProduct } from '../db/models/upsellProduct.model';

const retrieveUpsellProducts = async (productId: number) => {
	const results = await Product.scope('withUpsells').findByPk(productId);

	if (!results) {
		throw new NotFoundException('Product not found', null);
	}

	return results;
};

export const getUpsellProductsService = async (productId: number) => {
	return await retrieveUpsellProducts(productId);
};

/**
 * Create a new upselled product

 * @param upsellProductId Product Id of the product to be upselled
 * @returns
 */
export const createUpsellProductService = async (data: UpsellCreationType) => {
	const { productId, upsellProductId } = data;

	// Check if the upselled product is not the same as the product
	if (productId === upsellProductId) {
		throw new BadRequestException(
			'Product and Upsell Product cannot be the same',
			null
		);
	}

	// Check if the product and upselled product exist
	const checkProducts = await Product.findAndCountAll({
		where: {
			id: {
				[Op.in]: [productId, upsellProductId],
			},
		},
	});

	if (checkProducts.count < 2) {
		throw new BadRequestException(
			'Product or Upsell Product does not exist',
			null
		);
	}

	// Check if the product is not already upselled with the upselled product
	const checkUpsell = await UpsellProduct.findOne({
		where: {
			productId,
			upsellProductId,
		},
	});

	if (checkUpsell) {
		throw new BadRequestException(
			'Product is already linked with the upselled product',
			null
		);
	}

	// Create the upselled product
	await UpsellProduct.create({
		productId,
		upsellProductId,
	});

	return await retrieveUpsellProducts(productId);
};

export const removeUpsellProductService = async (upsellId: number) => {
	const upsell = await UpsellProduct.findByPk(upsellId);

	if (!upsell) {
		throw new NotFoundException('Upsell Product not found', null);
	}

	await upsell.destroy();
};
