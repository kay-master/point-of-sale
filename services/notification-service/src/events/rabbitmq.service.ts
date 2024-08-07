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
		{
			queue: NOTIFICATION_EVENTS.queue,
			durable: true,
		},
		{
			exchanges: [
				{
					exchange: ORDER_EVENTS.exchange,
					type: 'fanout',
					durable: true,
				},
			],
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
		{
			queue: NOTIFICATION_EVENTS.queue,
			durable: true,
		},
		{
			exchanges: [
				{
					exchange: PRODUCT_EVENTS.exchange,
					type: 'fanout',
					durable: true,
				},
			],
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
