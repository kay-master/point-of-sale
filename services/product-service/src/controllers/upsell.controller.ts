// Upsell product management controller

import { Request, Response } from 'express';

import { HTTP_STATUS_CODES, successResponse } from '@libs/middlewares';

import {
	createUpsellProductService,
	getUpsellProductsService,
	removeUpsellProductService,
} from '../services/upsell.service';

export const getUpsellProducts = async (req: Request, res: Response) => {
	const { productId } = req.query;

	if (!productId) {
		return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
			message: 'Product Id is required',
		});
	}

	// Check if the product has any upselled products
	const results = await getUpsellProductsService(
		parseInt(productId as string)
	);

	const upsellProducts = results.upsellProducts;

	const product = {
		productId: results.productId,
		name: results.name,
		description: results.description,
		price: results.price,
	};

	if (upsellProducts.length === 0) {
		return res.status(HTTP_STATUS_CODES.NOT_FOUND).json(
			successResponse(
				{
					product,
					upsellProducts: upsellProducts,
				},
				'Product has no upselled products'
			)
		);
	}

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			{
				product,
				upsellProducts: upsellProducts,
			},
			'Upsell products retrieved successfully'
		)
	);
};

export const createUpsellProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await createUpsellProductService(req),
			'Upsell product created successfully'
		)
	);
};

export const removeUpsellProduct = async (req: Request, res: Response) => {
	await removeUpsellProductService(req);

	res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
};
