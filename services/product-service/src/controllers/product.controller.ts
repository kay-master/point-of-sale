import { HTTP_STATUS_CODES, successResponse } from '@libs/middlewares';
import { Request, Response } from 'express';
import {
	createProductService,
	deleteProductService,
	getProductsService,
	updateProductService,
} from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await getProductsService(req.query.products as string),
			'Products retrieved successfully'
		)
	);
};

export const createProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await createProductService(req),
			'Product created successfully'
		)
	);
};

export const updateProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await updateProductService(req),
			'Product updated successfully'
		)
	);
};

export const deleteProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await deleteProductService(req),
			'Product deleted successfully'
		)
	);
};
