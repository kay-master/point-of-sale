import { SERVICE } from "@libs/api-service";
import { RabbitMQService } from "./rabbitmq";

export async function bootstrapRabbitMQ(
	serviceName: SERVICE,
): Promise<RabbitMQService> {
	const rabbitMQService = RabbitMQService.getInstance(serviceName);

	// Connect to RabbitMQ
	await rabbitMQService.connect();

	// Close RabbitMQ connection on process exit

	process.on("SIGINT", async () => {
		await rabbitMQService.close();
	});

	process.on("SIGTERM", async () => {
		await rabbitMQService.close();
	});

	return rabbitMQService;
}
