import {
	ConsumerStatus,
	MessageData,
	OrderEvent,
	ProductEvent,
} from '@libs/event-bus';
import {
	orderConfirmation,
	orderStatusUpdate,
} from '../../services/order.service';
import { lowStockNotification } from '../../services/stock.service';

export async function msgConsumer(
	message: MessageData
): Promise<ConsumerStatus | void> {
	switch (message.routingKey) {
		case OrderEvent.ORDER_CREATED: {
			return await orderConfirmation(message.data);
		}
		case OrderEvent.ORDER_UPDATED: {
			return await orderStatusUpdate(message.data);
		}
		case ProductEvent.PRODUCT_LOW_STOCK: {
			return await lowStockNotification(message.data);
		}
	}

	return ConsumerStatus.REQUEUE;
}
