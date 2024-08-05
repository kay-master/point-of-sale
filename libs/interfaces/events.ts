export enum OrderStatus {
	PENDING = "pending",
	PROCESSING = "processing",
	COMPLETE = "complete",
	CANCELLED = "cancelled",
}

export interface EventOrderProduct {
	productId: number;
	sku: string;
	quantity: number;
}

export type ProductDetail = Omit<EventOrderProduct, "productId"> & {
	id: number;
};

export interface EventOrderDetail {
	orderId: number;
	totalAmount: number;
	userId: number;
	products: EventOrderProduct[];
}

export interface EventOrderStatus {
	orderId: number;
	userId: number;
	createdAt: Date;
	updatedAt: Date;
	status: OrderStatus;
	products: {
		productId: number;
		sku: string;
		name: string;
		quantity: number;
	}[];
}
