import {
	NOTIFICATION_EVENTS,
	ORDER_EVENTS,
	PRODUCT_EVENTS,
	bootstrapRabbitMQ,
} from '@libs/event-bus';
import { msgConsumer } from './consumers/consumer';

export async function rabbitMqInit() {
	const rabbitMQService = await bootstrapRabbitMQ('PRODUCT_SERVICE');

	rabbitMQService.connection.on('connection', () => {
		// Create publisher
		// rabbitMQService.createPublisher({
		// 	exchanges: [{ exchange: NOTIFICATION_EVENTS.name, type: 'direct' }],
		// });
	});

	// Subscribe to different queues from this service

	rabbitMQService.subscribe(
		ORDER_EVENTS.exchange,
		NOTIFICATION_EVENTS.queue,
		{
			exchanges: [{ exchange: ORDER_EVENTS.exchange, type: 'fanout' }],
			queueBindings: [
				{
					exchange: ORDER_EVENTS.exchange,
					routingKey: ORDER_EVENTS.routingKey,
				},
			],
		},
		async (msg) => msgConsumer(msg)
	);

	rabbitMQService.subscribe(
		PRODUCT_EVENTS.exchange,
		NOTIFICATION_EVENTS.queue,
		{
			exchanges: [{ exchange: PRODUCT_EVENTS.exchange, type: 'fanout' }],
			queueBindings: [
				{
					exchange: PRODUCT_EVENTS.exchange,
					routingKey: PRODUCT_EVENTS.routingKey,
				},
			],
		},
		async (msg) => msgConsumer(msg)
	);
}
