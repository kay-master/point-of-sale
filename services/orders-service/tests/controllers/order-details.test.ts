import request from 'supertest';
import app from '../../src/app';
import sinon from 'sinon';
import { signToken } from '@libs/middlewares';
import { Order } from '../../src/db/models/order.model';
import { OrderStatus } from '@libs/interfaces';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

describe.only('Fetch orders', () => {
	let findAllStub: sinon.SinonStub;
	let jwt = '';

	beforeEach(() => {
		findAllStub = sinon.stub(Order, 'findAll');

		jwt = signToken('path', { accountId: 2 });
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should fetch all orders for an authenticated user successfully', async () => {
		const mockOrders = [
			{
				orderId: 1,
				userId: 1,
				totalAmount: 100,
				status: OrderStatus.PENDING,
				createdAt: new Date(),
				updatedAt: new Date(),
				details: [
					{
						productId: 1,
						productSKU: 'SKU1',
						productName: 'Product 1',
						quantity: 2,
					},
				],
			},
			{
				orderId: 1,
				userId: 2,
				totalAmount: 100,
				status: OrderStatus.PENDING,
				createdAt: new Date(),
				updatedAt: new Date(),
				details: [
					{
						productId: 1,
						productSKU: 'SKU1',
						productName: 'Product 1',
						quantity: 2,
					},
				],
			},
		];

		const orderInstances = mockOrders.map((order) =>
			Order.build(order, { include: [{ all: true }] })
		);

		findAllStub.resolves(orderInstances);

		await request(app)
			.get('/orders')
			.set('Authorization', `Bearer ${jwt}`)
			.expect(200);

		expect(findAllStub.calledOnce).toBe(true);
	});

	it('should return 401 if user not authenticated', async () => {
		const response = await request(app).get('/orders').expect(401);

		expect(response.body.message).toBe('Unauthorized access');
	});

	it('should return 500 on internal error', async () => {
		findAllStub.rejects(new Error('Database error'));

		const response = await request(app)
			.get('/orders')
			.set('Authorization', `Bearer ${jwt}`)
			.expect(500);

		expect(response.body.message).toBe('Something went wrong!');
		expect(findAllStub.calledOnce).toBe(true);
	});
});
