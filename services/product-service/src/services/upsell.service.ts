import { Op, Transaction } from 'sequelize';
import { Product } from '../db/models/product.model';
import { UpsellCreationType } from '../schema/upsell.schema';
import {
	BadRequestException,
	InternalException,
	NotFoundException,
	UnauthorizedException,
} from '@libs/middlewares';
import { UpsellProduct } from '../db/models/upsellProduct.model';
import { Request } from 'express';
import DB from '../db';
import { SOMETHING_WENT_WRONG } from '@libs/interfaces';

export const retrieveUpsellProducts = async (
	productId?: number,
	upsellProductId?: number,
	transaction?: Transaction
) => {
	let where = {};
	let count = 0;

	if (productId) {
		where = { ...where, productId };
		count++;
	}

	if (upsellProductId) {
		where = { ...where, upsellProductId };
		count++;
	}

	const results = await UpsellProduct.findAll({
		where: count > 0 ? where : undefined,
		transaction,
		order: [['createdAt', 'DESC']],
		include: [
			{
				model: Product,
				as: 'product',
			},
			{
				model: Product,
				as: 'upsellProductDetail',
			},
		],
	});

	if (results.length === 0 && count > 0) {
		throw new NotFoundException('Product(s) not found', null);
	}

	return results;
};

/**
 * Create a new upselled product

 * @param upsellProductId Product Id of the product to be upselled
 * @returns
 */
export const createUpsellProductService = async (req: Request) => {
	const { productId, upsellProductId } = req.body as UpsellCreationType;

	if (!req.user) {
		throw new UnauthorizedException('Account not found');
	}

	// Check if the upselled product is not the same as the product
	if (productId === upsellProductId) {
		throw new BadRequestException(
			'Product and Upsell Product cannot be the same',
			null
		);
	}

	const transaction = await DB.transaction();

	try {
		// Check if the product and upselled product exist
		const checkProducts = await Product.findAndCountAll({
			where: {
				id: {
					[Op.in]: [productId, upsellProductId],
				},
				userId: req.user.accountId,
			},
			transaction,
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
			transaction,
		});

		if (checkUpsell) {
			throw new BadRequestException(
				'Product is already linked with the upselled product',
				null
			);
		}

		// Create the upselled product
		await UpsellProduct.create(
			{
				productId,
				upsellProductId,
			},
			{
				transaction,
			}
		);

		const data = await retrieveUpsellProducts(
			productId,
			upsellProductId,
			transaction
		);

		await transaction.commit();

		return {
			success: true,
			data: data[0],
		};
	} catch (error) {
		console.error('createUpsellProductService', error);

		await transaction.rollback();

		if (error instanceof BadRequestException) {
			throw new BadRequestException(error.message, error.errors);
		}

		throw new InternalException(SOMETHING_WENT_WRONG, null);
	}
};

export const removeUpsellProductService = async (req: Request) => {
	const upsellId = parseInt(req.params.upsellId);

	if (!req.user) {
		throw new UnauthorizedException('Account not found');
	}

	// Check if the upsell record exists and the user owns the product
	const upsell = await UpsellProduct.findOne({
		where: { id: upsellId },
		include: {
			model: Product,
			as: 'product',
			where: { userId: req.user.accountId },
		},
	});

	if (!upsell) {
		throw new NotFoundException(
			'Upsell Product not found or user does not own the product',
			null
		);
	}

	await upsell.destroy();
};
