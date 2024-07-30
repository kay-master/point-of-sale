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

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await getUpsellProductsService(parseInt(productId as string)),
			'Upsell products retrieved successfully'
		)
	);
};

export const createUpsellProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await createUpsellProductService(req.body),
			'Upsell product created successfully'
		)
	);
};

export const removeUpsellProduct = async (req: Request, res: Response) => {
	await removeUpsellProductService(parseInt(req.params.upsellId));

	res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
};
