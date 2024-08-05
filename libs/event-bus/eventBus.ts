import { Envelope } from "rabbitmq-client";
import { Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { EVENT_BUS } from "./event-types";

export interface EventData {
	/**
	 * Queue name or Envelope object
	 * @type {string} Queue name, e.g 'order-events', publishing directly to a queue
	 * @type {Envelope} Envelope: publishing to an exchange. `{exchange: 'my-events', routingKey: 'order.created'}`
	 */
	queue: string | Envelope;
	data: Record<string, any> | Record<string, any>[];
}

export interface SubjectEvent {
	event: string;
	data: EventData;
}

class EventBus {
	private static instance: EventBus;
	private eventSubject: Subject<SubjectEvent>;

	private constructor() {
		this.eventSubject = new Subject<SubjectEvent>();
	}

	static getInstance(): EventBus {
		if (!EventBus.instance) {
			EventBus.instance = new EventBus();
		}
		return EventBus.instance;
	}

	public emit(event: string, data: EventData) {
		this.eventSubject.next({ event, data });
	}

	public on(event: string) {
		return this.eventSubject.asObservable().pipe(
			filter((e) => e.event === event),
			map((e) => e.data),
		);
	}
}

/**
 * Singleton event bus for publishing events to RabbitMQ publish method
 */
const eventBus = EventBus.getInstance();

/**
 * Singleton event bus for publishing events to RabbitMQ publish method
 * 
 * @example
 * 
 * publishEvent({
				queue: {
					exchange: ORDER_EVENTS.exchange,
					routingKey: OrderEvent.ORDER_CREATED
				},
				data: {
					orderId: order.orderId,
					userId: accountId,
				},
		});
 * 
 * Data can be any object or array of objects
 * @returns
 */
function publishEvent(data: EventData) {
	eventBus.emit(EVENT_BUS.RABBIT_MQ, data);
}

export { eventBus, publishEvent };
