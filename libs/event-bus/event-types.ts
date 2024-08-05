export const EVENT_BUS = {
	/**
	 * Event for publishing to RabbitMQ
	 */
	RABBIT_MQ: "rabbitmq.publish",
};

export const AUTH_EVENTS = {
	name: "auth-events",
	exchange: "auth",
	routingKey: "auth.*",
};

export const PRODUCT_EVENTS = {
	name: "product-events",
	exchange: "product",
	exchangeDirect: "product.direct",
	routingKey: "product.*",
};

export const ORDER_EVENTS = {
	name: "order-events",
	exchange: "order",
	exchangeDirect: "order.direct",
	routingKey: "order.*",
};

// Auth Events
export const AuthEvent = {
	ACCOUNT_CREATED: "auth.account-created",
};

// Product Events
export const ProductEvent = {
	PRODUCT_CREATED: "product.product-created",
	PRODUCT_UPDATED: "product.product-updated",
	PRODUCT_LOW_STOCK: "product.product-low-stock",
};

// Order Events
export const OrderEvent = {
	ORDER_CREATED: "order.order-created",
	ORDER_UPDATED: "order.order-updated",
};
