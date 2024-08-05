import { ConsumerStatus, MessageData, OrderEvent } from '@libs/event-bus';

export async function msgConsumer(
	message: MessageData
): Promise<ConsumerStatus | void> {
	console.log('Received message', message);
	switch (message.routingKey) {
		case OrderEvent.ORDER_CREATED: {
			// return await updateEmployeeId(message.data);
			console.log('Order created', message.data);
		}
	}

	return ConsumerStatus.REQUEUE;
}
