import { Request } from 'express';
import DB from '../db';
import { Order } from '../db/models/order.model';
import { OrderCreationType, OrderUpdateType } from '../schema/order.schema';
import {
	BadRequestException,
	InternalException,
	UnauthorizedException,
} from '@libs/middlewares';
import { ApiService } from '@libs/api-service';
import { Product } from '../interfaces/order.interface';
import {
	OrderDetail,
	OrderDetailCreationAttributes,
} from '../db/models/orderDetail.model';
import { ORDER_EVENTS, OrderEvent, publishEvent } from '@libs/event-bus';
import {
	EventOrderDetail,
	EventOrderStatus,
	OrderStatus,
} from '@libs/interfaces';

/**
 * Inter-service communication to fetch product details from the product service
 */
const getProducts = async (data: OrderCreationType, req: Request) => {
	const productIds = data.items.map((item) => item.productId);
	const upsellProductIds =
		data.upsellItems?.map((item) => item.upsellProductId) || [];

	req.query = {
		products: JSON.stringify([...productIds, ...upsellProductIds]),
	};

	// Get products from the product service
	const products = await ApiService.get<Product[]>(
		'PRODUCT_SERVICE',
		req,
		'/list'
	);

	if (!products.success) {
		throw new BadRequestException(products.message, products.errors);
	}

	return products.data;
};

export const createOrderService = async (req: Request) => {
	if (!req.user) {
		throw new UnauthorizedException();
	}

	const transaction = await DB.transaction();

	const accountId = req.user.accountId;
	const orderData = req.body as OrderCreationType;

	try {
		// Create a new order with initial status as PENDING and total amount as 0
		const order = await Order.create(
			{
				totalAmount: 0,
				userId: accountId,
				status: OrderStatus.PENDING,
			},
			{
				transaction,
			}
		);

		let totalAmount = 0;

		const items = await getProducts(orderData, req);

		const combinedItems: Record<string, OrderDetailCreationAttributes> = {};

		const insufficientProducts: Product[] = [];

		// Logic below is to combine the order items and upsell items into a single object

		// Add order details to the order
		for (let i = 0; i < items.length; i++) {
			const detail = items[i];
			const findProductQty = orderData.items.find(
				(item) => item.productId === detail.productId
			);

			if (!findProductQty) {
				continue;
			}

			// Check if the quantity of the product is sufficient
			if (
				detail.quantity === 0 ||
				findProductQty.quantity > detail.quantity
			) {
				insufficientProducts.push(detail);

				continue;
			}

			const itemTotal = detail.price * findProductQty.quantity;
			totalAmount += itemTotal;

			if (combinedItems[detail.sku]) {
				combinedItems[detail.sku].quantity += findProductQty.quantity;
				combinedItems[detail.sku].totalPrice += itemTotal;
			} else {
				combinedItems[detail.sku] = {
					orderId: order.orderId,
					productId: detail.productId,
					productName: detail.name,
					productPrice: detail.price,
					productDescription: detail.description,
					productSKU: detail.sku,
					quantity: findProductQty.quantity,
					totalPrice: itemTotal,
				};
			}

			// Remove the processed item from the array
			items.splice(i, 1);
		}

		// Process upsell items
		if (orderData.upsellItems) {
			for (const detail of items) {
				const findProductQty = orderData.upsellItems.find(
					(item) => item.upsellProductId === detail.productId
				);

				if (!findProductQty) {
					continue;
				}

				const itemTotal = detail.price * findProductQty.quantity;
				totalAmount += itemTotal;

				if (combinedItems[detail.sku]) {
					combinedItems[detail.sku].quantity +=
						findProductQty.quantity;
					combinedItems[detail.sku].totalPrice += itemTotal;
				} else {
					combinedItems[detail.sku] = {
						orderId: order.orderId,
						productId: detail.productId,
						productName: detail.name,
						productPrice: detail.price,
						productDescription: detail.description,
						productSKU: detail.sku,
						quantity: findProductQty.quantity,
						totalPrice: itemTotal,
					};
				}
			}
		}

		// Check if there are insufficient products
		if (insufficientProducts.length > 0) {
			throw new BadRequestException(
				`Following products have insufficient quantity in stock`,
				insufficientProducts.map((product) => ({
					productId: product.productId,
					name: product.name,
					quantity: product.quantity,
				}))
			);
		}

		const orderDetails = Object.values(combinedItems);

		if (orderDetails.length === 0) {
			throw new BadRequestException(
				'No valid products found in the order',
				null
			);
		}

		await OrderDetail.bulkCreate(orderDetails, {
			transaction,
		});

		// Update the total amount of the order
		order.totalAmount = totalAmount;
		await order.save({ transaction });

		const eventData: EventOrderDetail = {
			orderId: order.orderId,
			userId: accountId,
			totalAmount,
			products: orderDetails.map((item) => ({
				productId: item.productId,
				sku: item.productSKU,
				quantity: item.quantity,
			})),
		};

		// On successful creation of the order, update the stock of the products in the product service (quantity of remaining products in stock)
		publishEvent({
			queue: {
				exchange: ORDER_EVENTS.exchange,
				routingKey: OrderEvent.ORDER_CREATED,
			},
			data: eventData,
		});

		await transaction.commit();
	} catch (error) {
		console.error(error);

		await transaction.rollback();

		if (error instanceof BadRequestException) {
			throw new BadRequestException(error.message, error.errors);
		}

		throw new InternalException('Failed to create order', null);
	}
};

/**
 * Order status can be one of the following: Pending, Processing, Complete, Cancelled
 * @param req
 * @returns
 */
export const updateOrderStatusService = async (req: Request) => {
	if (!req.user) {
		throw new UnauthorizedException();
	}

	const userId = req.user.accountId;

	const { orderId } = req.params;
	const { status } = req.body as OrderUpdateType;

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
		attributes: ['orderId', 'status', 'totalAmount', 'updatedAt'],
	});

	if (!order) {
		throw new BadRequestException(
			`Order with ID ${orderId} not found`,
			null
		);
	}

	await order.update({
		status,
	});

	const eventData: EventOrderStatus = {
		orderId: order.orderId,
		createdAt: order.createdAt,
		userId,
		updatedAt: order.updatedAt,
		status,
		products: order.details.map((detail) => ({
			productId: detail.productId,
			sku: detail.productSKU,
			name: detail.productName,
			quantity: detail.quantity,
		})),
	};

	// TODO: Publish the order status update event: notification service
	publishEvent({
		queue: {
			exchange: ORDER_EVENTS.exchange,
			routingKey: OrderEvent.ORDER_UPDATED,
		},
		data: eventData,
	});

	return order;
};
