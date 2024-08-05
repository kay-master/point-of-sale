import { MessageData } from "./interface";
import {
	AsyncMessage,
	Connection,
	Consumer,
	ConsumerProps,
	ConsumerStatus,
	Envelope,
	Publisher,
	PublisherProps,
} from "rabbitmq-client";
import { SERVICE } from "@libs/api-service";
import { eventBus } from "./eventBus";

class RabbitMQService {
	private static instance: RabbitMQService;
	public connection!: Connection;
	private publisher!: Publisher;
	private consumer!: Consumer;
	private publisherProps!: PublisherProps;

	// This represents the service that made the connection, e.g. 'auth-service'
	private static connectionName: string;

	private constructor() {}

	public static getInstance(serviceName: SERVICE): RabbitMQService {
		this.connectionName = serviceName;

		if (!this.instance) {
			this.instance = new RabbitMQService();
		}

		return this.instance;
	}

	public async connect() {
		if (!this.connection) {
			this.connection = new Connection({
				connectionName: RabbitMQService.connectionName,
				username: process.env.RABBITMQ_USER,
				password: process.env.RABBITMQ_PASSWORD,
				hostname: process.env.RABBITMQ_HOST,
				port: parseInt(process.env.RABBITMQ_PORT || "5672"),
			});

			this.connection.on("error", (err: any) => {
				console.log("RabbitMQ connection error", err);
			});

			this.connection.on("connection", () => {
				console.log("RabbitMQ connection successfully (re)established");
			});
		}
	}

	/**
	 * Create a message publisher that can recover from dropped connections
	 */
	public createPublisher(publisherProps: PublisherProps) {
		this.publisherProps = publisherProps;

		if (!this.publisherProps.confirm) {
			this.publisherProps.confirm = true;
		}

		// Enable retries
		if (!this.publisherProps.maxAttempts) {
			this.publisherProps.maxAttempts = 2;
		}

		if (!this.publisher) {
			console.log("Creating publisher");

			try {
				this.publisher = this.connection.createPublisher(this.publisherProps);

				eventBus.on("rabbitmq.publish").subscribe((eventData) => {
					this.publish(eventData.queue, eventData.data);
				});
			} catch (err) {
				console.error("Error creating publisher", err);
			}
		}
	}

	// Publish message to RabbitMQ
	public async publish(queue: string | Envelope, message: any) {
		if (this.publisher) {
			try {
				console.log("Publishing event", { queue, message });

				await this.publisher.send(queue, message);
			} catch (err) {
				console.error(err);
			}
		}
	}

	async subscribe(
		exchangeName: string,
		queueName: string,
		consumerProps: Omit<ConsumerProps, "queue" | "queueOptions" | "qos">,
		callback: (message: MessageData) => Promise<ConsumerStatus | void>,
	) {
		if (!this.connection) {
			await this.connect();
		}

		// Declare the queue first
		await this.connection.queueDeclare({ queue: queueName, durable: true });

		// Bind the queue to the exchange
		await this.connection.queueBind({
			queue: queueName,
			exchange: exchangeName,
		});

		this.consumer = this.connection.createConsumer(
			{
				queue: queueName,
				queueOptions: { durable: true },
				qos: { prefetchCount: 2 },
				...consumerProps,
			},
			async (msg: AsyncMessage) =>
				callback({
					data: msg.body,
					exchange: msg.exchange,
					routingKey: msg.routingKey,
				}),
		);

		this.consumer.on("error", (err: any) => {
			console.log(`Consumer error (${queueName})`, err);
		});
	}

	async close() {
		if (this.publisher) {
			await this.publisher.close();
		}

		if (this.consumer) {
			await this.consumer.close();
		}

		await this.connection.close();
	}
}

export { RabbitMQService };
