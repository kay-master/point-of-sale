import {
	ORDER_EVENTS,
	PRODUCT_EVENTS,
	bootstrapRabbitMQ,
} from '@libs/event-bus';
import { msgConsumer } from './consumers/consumer';

export async function rabbitMqInit() {
	if (process.env.NODE_ENV === 'test') return;

	const rabbitMQService = await bootstrapRabbitMQ('PRODUCT_SERVICE');
	rabbitMQService.connection.on('connection', () => {
		// Create publisher
		rabbitMQService.createPublisher({
			exchanges: [
				{
					exchange: PRODUCT_EVENTS.name,
					type: 'fanout',
					durable: true,
				},
			],
		});
	});

	// Subscribe to different queues from this service

	rabbitMQService.subscribe(
		{
			queue: PRODUCT_EVENTS.queue,
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
}
