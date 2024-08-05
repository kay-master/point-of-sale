import { ConsumerStatus } from '@libs/event-bus';
import { EventOrderDetail, EventOrderStatus } from '@libs/interfaces';

// TODO: Send order confirmation email to user
export const orderConfirmation = async (order: EventOrderDetail) => {
	const emailData = {
		to: order.userId,
		subject: 'Order Confirmation',
		text: `Thank you for your order! Your order ID is ${order.orderId}.`,
		items: order.products,
	};

	console.log('Sending order confirmation email to user', emailData);

	return ConsumerStatus.ACK;
};

export const orderStatusUpdate = async (order: EventOrderStatus) => {
	const emailData = {
		to: order.userId,
		subject: 'Order Status Update',
		text: `Your order ID ${order.orderId} has been updated to ${order.status}.`,
		items: order.products,
	};

	console.log('Sending order status update email to user', emailData);

	return ConsumerStatus.ACK;
};
