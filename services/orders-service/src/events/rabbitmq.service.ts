import { ORDER_EVENTS, bootstrapRabbitMQ } from '@libs/event-bus';

export async function rabbitMqInit() {
	const rabbitMQService = await bootstrapRabbitMQ('ORDERS_SERVICE');
	rabbitMQService.connection.on('connection', () => {
		// Create publisher
		rabbitMQService.createPublisher({
			exchanges: [{ exchange: ORDER_EVENTS.name, type: 'fanout' }],
		});
	});
	// Subscribe to different queues from this service
}
