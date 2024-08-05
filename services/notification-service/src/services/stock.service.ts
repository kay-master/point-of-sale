import { ConsumerStatus } from '@libs/event-bus';
import { ProductDetail } from '@libs/interfaces';

/**
 * Send notification about low stock products to admin
 */
export const lowStockNotification = async (product: ProductDetail) => {
	console.log('Received message: lowStockNotification', product);

	return ConsumerStatus.ACK;
};
