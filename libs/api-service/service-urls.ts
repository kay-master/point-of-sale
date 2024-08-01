export const SERVICE_URLS = {
	AUTH_SERVICE: "http://localhost:4001",
	PRODUCT_SERVICE: "http://localhost:4002",
	ORDERS_SERVICE: "http://localhost:4003",
};

export type SERVICE = keyof typeof SERVICE_URLS;
