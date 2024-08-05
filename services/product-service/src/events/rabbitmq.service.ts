import {
	ORDER_EVENTS,
	PRODUCT_EVENTS,
	bootstrapRabbitMQ,
} from '@libs/event-bus';
import { msgConsumer } from './consumers/consumer';

export async function rabbitMqInit() {
	const rabbitMQService = await bootstrapRabbitMQ('PRODUCT_SERVICE');
	rabbitMQService.connection.on('connection', () => {
		// Create publisher
		rabbitMQService.createPublisher({
			exchanges: [{ exchange: PRODUCT_EVENTS.name, type: 'fanout' }],
		});
	});

	// Subscribe to different queues from this service

	rabbitMQService.subscribe(
		ORDER_EVENTS.name,
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
}
