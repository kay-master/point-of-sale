import request from 'supertest';
import app from '../../src/app';
import sinon from 'sinon';
import DB from '../../src/db';
import { signToken } from '@libs/middlewares';
import { Order } from '../../src/db/models/order.model';
import { OrderDetail } from '../../src/db/models/orderDetail.model';
import { ApiService } from '@libs/api-service';
import { OrderStatus } from '@libs/interfaces';
import { OrderCreationType } from '../../src/schema/order.schema';

describe('Create order transaction ', () => {
	let transactionStub: {
		commit: sinon.SinonStub;
		rollback: sinon.SinonStub;
	};
	let createOrderStub: sinon.SinonStub;
	let bulkCreateOrderDetailStub: sinon.SinonStub;
	let saveOrderStub: sinon.SinonStub;
	let getProductsStub: sinon.SinonStub;
	let products: OrderCreationType;

	let jwt: string;

	beforeEach(() => {
		jwt = signToken('path', { accountId: 1 });

		transactionStub = {
			commit: sinon.stub(),
			rollback: sinon.stub(),
		};

		sinon.stub(DB, 'transaction').resolves(transactionStub as any);

		createOrderStub = sinon.stub(Order, 'create');
		bulkCreateOrderDetailStub = sinon.stub(OrderDetail, 'bulkCreate');
		saveOrderStub = sinon.stub(Order.prototype, 'save');
		getProductsStub = sinon.stub(ApiService, 'get');

		products = {
			items: [
				{
					productId: 1,
					quantity: 2,
				},
			],
			upsellItems: [
				{
					upsellProductId: 2,
					quantity: 1,
					productId: 1,
				},
			],
		};
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should create a new order successfully', async () => {
		createOrderStub.resolves({
			orderId: 1,
			totalAmount: 0,
			userId: 1,
			status: OrderStatus.PENDING,
			save: saveOrderStub.resolves(),
		});

		getProductsStub.resolves({
			success: true,
			data: [
				{
					productId: 1,
					name: 'Product 1',
					price: 10,
					description: 'Desc 1',
					sku: 'SKU1',
					quantity: 10,
				},
				{
					productId: 2,
					name: 'Upsell Product 1',
					price: 5,
					description: 'Desc 2',
					sku: 'SKU2',
					quantity: 5,
				},
			],
		});
		bulkCreateOrderDetailStub.resolves();
		saveOrderStub.resolves();

		const response = await request(app)
			.post('/orders')
			.send(products)
			.set('Authorization', `Bearer ${jwt}`)
			.expect(201);

		expect(response.body.success).toBe(true);
		expect(createOrderStub.calledOnce).toBe(true);
		expect(bulkCreateOrderDetailStub.calledOnce).toBe(true);
		expect(saveOrderStub.calledOnce).toBe(true);
		expect(transactionStub.commit.calledOnce).toBe(true);
	});

	it('should return 401 if user not authenticated', async () => {
		const response = await request(app)
			.post('/orders')
			.send(products)
			.expect(401);

		expect(response.body.message).toBe('Unauthorized access');
	});

	it('should return 400 if no valid products found in the order', async () => {
		getProductsStub.resolves({
			success: true,
			data: [],
		});

		const response = await request(app)
			.post('/orders')
			.send({
				items: [
					{
						productId: 50,
						quantity: 1,
					},
				],
			})
			.set('Authorization', `Bearer ${jwt}`)
			.expect(400);

		expect(response.body.message).toBe(
			'No valid products found in the order'
		);
	});

	it('should return 500 on internal error', async () => {
		createOrderStub.rejects(new Error('Database error'));

		const response = await request(app)
			.post('/orders')
			.send(products)
			.set('Authorization', `Bearer ${jwt}`)
			.expect(500);

		expect(response.body.message).toBe('Failed to create order');

		expect(transactionStub.rollback.calledOnce).toBe(true);
	});
});

describe('Update an Order', () => {
	let findOneStub: sinon.SinonStub;
	let updateStub: sinon.SinonStub;

	let jwt: string;

	beforeEach(() => {
		findOneStub = sinon.stub(Order, 'findOne');
		updateStub = sinon.stub(Order.prototype, 'update');

		jwt = signToken('path', { accountId: 1 });
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should update order status successfully', async () => {
		const orderInstance = Order.build(
			{
				orderId: 1,
				status: OrderStatus.PENDING,
				totalAmount: 100,
				updatedAt: new Date(),
				createdAt: new Date(),
				details: [
					{
						productId: 1,
						productSKU: 'SKU1',
						productName: 'Product 1',
						quantity: 2,
					},
				],
				update: updateStub.resolves(),
			} as any,
			{
				include: [{ all: true }],
			}
		);

		findOneStub.resolves(orderInstance);

		updateStub.callsFake((updatedData) => {
			Object.assign(orderInstance, updatedData);
			return Promise.resolve(orderInstance);
		});

		const response = await request(app)
			.patch(`/orders/${orderInstance.orderId}/status`)
			.send({ status: OrderStatus.PROCESSING })
			.set('Authorization', `Bearer ${jwt}`)
			.expect(200);

		expect(response.body.data.status).toBe(OrderStatus.PROCESSING);
		expect(findOneStub.calledOnce).toBe(true);
		expect(updateStub.calledOnce).toBe(true);
	});

	it('should return 401 if user not authenticated', async () => {
		const response = await request(app)
			.patch('/orders/12/status')
			.send({ status: OrderStatus.CANCELLED })
			.expect(401);

		expect(response.body.message).toBe('Unauthorized access');
	});

	it('should return 400 if order not found', async () => {
		findOneStub.resolves(null);

		const response = await request(app)
			.patch('/orders/1000/status')
			.send({ status: OrderStatus.COMPLETE })
			.set('Authorization', `Bearer ${jwt}`)
			.expect(400);

		expect(response.body.message).toBe('Order with ID 1000 not found');
		expect(findOneStub.calledOnce).toBe(true);
	});

	it('should return 500 on internal error', async () => {
		findOneStub.rejects(new Error('Database error'));

		const response = await request(app)
			.patch('/orders/1/status')
			.send({ status: OrderStatus.PROCESSING })
			.set('Authorization', `Bearer ${jwt}`)
			.expect(500);

		expect(response.body.message).toBe('Something went wrong!');
		expect(findOneStub.calledOnce).toBe(true);
	});
});
