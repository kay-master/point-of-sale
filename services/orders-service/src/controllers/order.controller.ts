import { HTTP_STATUS_CODES, successResponse } from '@libs/middlewares';
import { Request, Response } from 'express';
import { createOrderService } from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await createOrderService(req),
			'Order created successfully'
		)
	);
};
