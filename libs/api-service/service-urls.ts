export const SERVICE_NAME = {
	AUTH_SERVICE: "auth-service/auth",
	PRODUCT_SERVICE: "product-service/products",
	ORDERS_SERVICE: "orders-service/orders",
};

export type SERVICE = keyof typeof SERVICE_NAME;
