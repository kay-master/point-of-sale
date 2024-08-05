import { ConsumerStatus, MessageData, OrderEvent } from '@libs/event-bus';
import { updateProductStock } from '../../services/inventory.service';

export async function msgConsumer(
	message: MessageData
): Promise<ConsumerStatus | void> {
	switch (message.routingKey) {
		case OrderEvent.ORDER_CREATED: {
			return await updateProductStock(message.data);
		}
	}

	return ConsumerStatus.REQUEUE;
}
