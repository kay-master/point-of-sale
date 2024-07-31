import { HTTP_STATUS_CODES, successResponse } from '@libs/middlewares';
import { Request, Response } from 'express';
import { createOrderService } from '../services/order.service';
import {
	getOrdersService,
	orderDetailsService,
} from '../services/details.service';

export const createOrder = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await createOrderService(req),
			'Order created successfully'
		)
	);
};

export const getOrders = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await getOrdersService(req),
			'Orders retrieved successfully'
		)
	);
};

export const getOrderDetails = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await orderDetailsService(req),
			'Order specific details'
		)
	);
};
