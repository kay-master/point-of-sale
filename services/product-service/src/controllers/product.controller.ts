import { HTTP_STATUS_CODES, successResponse } from '@libs/middlewares';
import { Request, Response } from 'express';
import {
	createProductService,
	deleteProductService,
	getProductsService,
	updateProductService,
} from '../services/product.service';

export const getProducts = async (_req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await getProductsService(),
			'Products retrieved successfully'
		)
	);
};

export const createProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await createProductService(req.body),
			'Product created successfully'
		)
	);
};

export const updateProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await updateProductService(parseInt(req.params.id), req.body),
			'Product updated successfully'
		)
	);
};

export const deleteProduct = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await deleteProductService(parseInt(req.params.id)),
			'Product deleted successfully'
		)
	);
};
