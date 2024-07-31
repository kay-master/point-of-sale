import { Request } from 'express';
import DB from '../db';
import { Order, OrderStatus } from '../db/models/order.model';
import { OrderCreationType } from '../schema/order.schema';
import {
	BadRequestException,
	InternalException,
	// UnauthorizedException,
} from '@libs/middlewares';
import { ApiService } from '@libs/api-service';
import { Product } from '../interfaces/order.interface';
import {
	OrderDetail,
	OrderDetailCreationAttributes,
} from '../db/models/orderDetail.model';

/**
 * Inter-service communication to fetch product details from the product service
 */
const getProducts = async (data: OrderCreationType, req: Request) => {
	const productIds = data.items.map((item) => item.productId);
	const upsellProductIds =
		data.upsellItems?.map((item) => item.productId) || [];

	req.query = {
		products: JSON.stringify([...productIds, ...upsellProductIds]),
	};

	const products = await ApiService.get<Product[]>(
		'PRODUCT_SERVICE',
		req,
		'/'
	);

	if (!products.success) {
		throw new BadRequestException(products.message, products.errors);
	}

	return products.data;
};

export const createOrderService = async (req: Request) => {
	// if (!req.user) {
	// 	throw new UnauthorizedException();
	// }

	const transaction = await DB.transaction();

	const accountId = 1; // req.user.accountId;
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

		const orderDetailsData: OrderDetailCreationAttributes[] = [];

		const insufficientProducts: Product[] = [];

		// Add order details to the order
		for (const detail of items) {
			const findProductQty = orderData.items.find(
				(item) => item.productId === detail.productId
			);

			if (!findProductQty) {
				throw new BadRequestException(
					'Product quantity not found',
					null
				);
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

			orderDetailsData.push({
				orderId: order.id,
				productId: detail.productId,
				productName: detail.name,
				productPrice: detail.price,
				productDescription: detail.description,
				productSKU: detail.sku,
				quantity: findProductQty.quantity,
				totalPrice: itemTotal,
			});
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

		await OrderDetail.bulkCreate(orderDetailsData, {
			transaction,
		});

		// Update the total amount of the order
		order.totalAmount = totalAmount;
		await order.save({ transaction });

		// TODO: After successful creation of the order, update the stock of the products in the product service (quantity of remaining products in stock)
		// await ApiService.post(
		// 	'PRODUCT_SERVICE',
		// 	req,
		// 	'/stock/update',
		// 	orderData.items
		// );

		// await transaction.commit();
	} catch (error) {
		console.error(error);

		await transaction.rollback();

		if (error instanceof BadRequestException) {
			throw new BadRequestException(error.message, error.errors);
		}

		throw new InternalException('Failed to create order', null);
	}
};
