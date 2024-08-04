import { NotFoundException } from '@libs/middlewares';
import { Order } from '../db/models/order.model';
import { OrderDetail } from '../db/models/orderDetail.model';
import { Request } from 'express';

/**
 * Fetch all orders for an authenticated user
 */
export const getOrdersService = async (_req: Request) => {
	const userId = 1;

	const orders = await Order.findAll({
		where: {
			userId,
		},
		include: [
			{
				model: OrderDetail,
				as: 'details',
			},
		],
		order: [['createdAt', 'DESC']],
	});

	return orders;
};

/**
 * Fetch order details for a specific order that is associated with an authenticated user
 */
export const orderDetailsService = async (req: Request) => {
	const userId = 1;
	const { orderId } = req.params;

	const order = await Order.findOne({
		where: {
			orderId,
			userId,
		},
		include: [
			{
				model: OrderDetail,
				as: 'details',
			},
		],
	});

	if (!order) {
		throw new NotFoundException(`Order with ID ${orderId} not found`, null);
	}

	return order;
};
