// Upsell product management controller

import { Request, Response } from 'express';

import {
	HTTP_STATUS_CODES,
	errorResponse,
	successResponse,
} from '@libs/middlewares';

import {
	createUpsellProductService,
	removeUpsellProductService,
	retrieveUpsellProducts,
} from '../services/upsell.service';

export const getAllUpsellProducts = async (_req: Request, res: Response) => {
	// Check if the product has any upselled products
	const results = await retrieveUpsellProducts();

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(results, 'Upsell products')
	);
};

export const getUpsellProducts = async (req: Request, res: Response) => {
	const { productId } = req.query;

	if (!productId) {
		return res
			.status(HTTP_STATUS_CODES.BAD_REQUEST)
			.json(errorResponse('Product Id is required'));
	}

	// Check if the product has any upselled products
	const results = await retrieveUpsellProducts(parseInt(productId as string));

	if (results.length === 0) {
		return res
			.status(HTTP_STATUS_CODES.NOT_FOUND)
			.json(successResponse(results, 'Product has no upselled products'));
	}

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(results, 'Upsell products retrieved successfully')
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
