export const SERVICE_URLS = {
	AUTH_SERVICE: "http://localhost/auth",
	PRODUCT_SERVICE: "http://localhost/products",
	ORDERS_SERVICE: "http://localhost/orders",
};

export type SERVICE = keyof typeof SERVICE_URLS;
