import {
	ConsumerStatus,
	PRODUCT_EVENTS,
	ProductEvent,
	publishEvent,
} from '@libs/event-bus';
import { EventOrderDetail, ProductDetail } from '@libs/interfaces';
import { Product } from '../db/models/product.model';
import Bottleneck from 'bottleneck';

// Limiting the number of concurrent operations to 5, this is to avoid overwhelming the database connection pool incase there are a lot of products to update
const limiter = new Bottleneck({
	maxConcurrent: 5,
});

// Threshold for low stock
const LOW_STOCK_THRESHOLD = 5;

/**
 * Updating product stock after order creation, event received from order service
 */
export const updateProductStock = async (data: EventOrderDetail) => {
	const { products } = data;

	console.log('Received message: updateProductStock');

	const productList: ProductDetail[] = products.map((product) => ({
		sku: product.sku,
		quantity: product.quantity,
		id: product.productId,
	}));

	const lowStockProducts: ProductDetail[] = [];

	// Update each product's quantity
	await Promise.all(
		productList.map((product) =>
			limiter.schedule(async () => {
				try {
					const existingProduct = await Product.findByPk(product.id);

					if (existingProduct) {
						const oldQuantity = existingProduct.quantity;
						const newQuantity = oldQuantity - product.quantity;

						// Ensure quantity doesn't go below zero
						existingProduct.quantity =
							newQuantity < 0 ? 0 : newQuantity;

						await existingProduct.save();

						console.log(
							`Updated product SKU: ${product.sku}, quantity: from ${oldQuantity} -> ${existingProduct.quantity}`
						);

						// Check if the product is running low on stock
						if (existingProduct.quantity <= LOW_STOCK_THRESHOLD) {
							lowStockProducts.push({
								sku: existingProduct.sku,
								quantity: existingProduct.quantity,
								id: existingProduct.productId,
							});
						}
					} else {
						console.error(
							`Product with ID: ${product.id} not found`
						);
					}
				} catch (error) {
					console.error(
						`Error updating product ID: ${product.id}, SKU: ${product.sku}`,
						error
					);
				}
			})
		)
	);

	// TODO: If there are products with low stock, send event to notification service
	if (lowStockProducts.length > 0) {
		publishEvent({
			queue: {
				exchange: PRODUCT_EVENTS.exchange,
				routingKey: ProductEvent.PRODUCT_LOW_STOCK,
			},
			data: lowStockProducts,
		});
	}

	return ConsumerStatus.ACK;
};
