import { ORDER_EVENTS, bootstrapRabbitMQ } from '@libs/event-bus';

export async function rabbitMqInit() {
	if (process.env.NODE_ENV === 'test') return;

	const rabbitMQService = await bootstrapRabbitMQ('ORDERS_SERVICE');

	rabbitMQService.connection.on('connection', () => {
		// Create publisher
		rabbitMQService.createPublisher({
			exchanges: [
				{ exchange: ORDER_EVENTS.name, type: 'fanout', durable: true },
			],
		});
	});
	// Subscribe to different queues from this service
}
