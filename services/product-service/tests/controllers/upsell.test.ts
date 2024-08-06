import request from 'supertest';
import app from '../../src/app';
import sinon from 'sinon';
import { HTTP_STATUS_CODES, signToken } from '@libs/middlewares';
import DB from '../../src/db';
import { UpsellProduct } from '../../src/db/models/upsellProduct.model';
import { Product } from '../../src/db/models/product.model';

describe('Upsell products', () => {
	let findAllStub: sinon.SinonStub;
	let findAndCountAllStub: sinon.SinonStub;
	let findOneStub: sinon.SinonStub;
	let createStub: sinon.SinonStub;
	let destroyStub: sinon.SinonStub;
	let transactionStub: {
		commit: sinon.SinonStub;
		rollback: sinon.SinonStub;
	};

	let jwt = '';

	beforeEach(() => {
		// Generate JWT
		jwt = signToken('path', { accountId: 1 });

		transactionStub = {
			commit: sinon.stub(),
			rollback: sinon.stub(),
		};

		// Stub the transaction methods
		sinon.stub(DB, 'transaction').resolves(transactionStub as any);
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('Retrieve UpsellProducts', () => {
		it('should retrieve upsell products for a given productId', async () => {
			const upsellProducts = [
				{
					id: 1,
					productId: 3,
					upsellProductId: 2,
					product: { id: 3, name: 'Product 1' },
					upsellProductDetail: { id: 2, name: 'Upsell Product 1' },
				},
				{
					id: 2,
					productId: 1,
					upsellProductId: 3,
					product: { id: 1, name: 'Product 1' },
					upsellProductDetail: { id: 3, name: 'Upsell Product 2' },
				},
			];

			findAllStub = sinon
				.stub(UpsellProduct, 'findAll')
				.resolves(upsellProducts as any);

			const response = await request(app)
				.get('/products/list/upsell?productId=1')
				.expect(HTTP_STATUS_CODES.OK);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe(
				'Upsell products retrieved successfully'
			);
			expect(response.body.data.length).toEqual(2);
			expect(findAllStub.calledOnce).toBe(true);
		});

		it('should return an error if no upsell product is found', async () => {
			findAllStub = sinon.stub(UpsellProduct, 'findAll').resolves([]);

			const response = await request(app)
				.get('/products/list/upsell?productId=100')
				.expect(HTTP_STATUS_CODES.NOT_FOUND);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('Product(s) not found');
			expect(findAllStub.calledOnce).toBe(true);
		});
	});

	describe('Create UpsellProduct', () => {
		it('should create an upsell product successfully', async () => {
			const product = {
				productId: 6,
				upsellProductId: 5,
			};

			const upsellProductData = [
				{
					id: 1,
					productId: 3,
					upsellProductId: 2,
					product: { id: 3, name: 'Product 1' },
					upsellProductDetail: { id: 2, name: 'Upsell Product 1' },
				},
				{
					id: 2,
					productId: 1,
					upsellProductId: 3,
					product: { id: 1, name: 'Product 1' },
					upsellProductDetail: { id: 3, name: 'Upsell Product 2' },
				},
			];

			findAndCountAllStub = sinon
				.stub(Product, 'findAndCountAll')
				.resolves({ count: 2 } as any);

			findAllStub = sinon
				.stub(UpsellProduct, 'findAll')
				.resolves(upsellProductData as any);

			findOneStub = sinon.stub(UpsellProduct, 'findOne').resolves(null);

			createStub = sinon
				.stub(UpsellProduct, 'create')
				.resolves({ id: 1 } as any);

			const response = await request(app)
				.post('/products/upsell')
				.send(product)
				.set('Authorization', `Bearer ${jwt}`)
				.expect(HTTP_STATUS_CODES.CREATED);

			expect(response.body.success).toBe(true);
			expect(findAllStub.calledOnce).toBe(true);
			expect(findOneStub.calledOnce).toBe(true);
			expect(findAndCountAllStub.calledOnce).toBe(true);
			expect(createStub.calledOnce).toBe(true);
			expect(transactionStub.commit.calledOnce).toBe(true);
			expect(transactionStub.rollback.notCalled).toBe(true);
		});

		it('should throw BadRequestException if product and upsell product are the same', async () => {
			const response = await request(app)
				.post('/products/upsell')
				.send({ productId: 1, upsellProductId: 1 })
				.set('Authorization', `Bearer ${jwt}`)
				.expect(HTTP_STATUS_CODES.BAD_REQUEST);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe(
				'Product and Upsell Product cannot be the same'
			);
		});

		it('should throw UnauthorizedException if user is not authenticated', async () => {
			const response = await request(app)
				.post('/products/upsell')
				.send({ productId: 1, upsellProductId: 2 })
				.expect(HTTP_STATUS_CODES.UNAUTHORIZED);

			expect(response.body.success).toBe(false);
		});
	});

	describe('Delete UpsellProduct', () => {
		beforeEach(() => {
			findOneStub = sinon.stub(UpsellProduct, 'findOne');
			destroyStub = sinon.stub(UpsellProduct.prototype, 'destroy');
		});

		it('should delete an upsell product successfully', async () => {
			findOneStub.resolves({
				id: 1,
				destroy: destroyStub.resolves(),
			});

			const response = await request(app)
				.delete('/products/upsell/1')
				.set('Authorization', `Bearer ${jwt}`)
				.expect(204);

			expect(response.body).toEqual({});
			expect(findOneStub.calledOnce).toBe(true);
			expect(destroyStub.calledOnce).toBe(true);
		});

		it('should return 401 if user not authenticated', async () => {
			await request(app).delete('/products/upsell/1').expect(401);
		});

		it('should return 404 if upsell product not found', async () => {
			findOneStub.resolves(null);

			const response = await request(app)
				.delete('/products/upsell/1')
				.set('Authorization', `Bearer ${jwt}`)
				.expect(404);

			expect(response.body.message).toBe(
				'Upsell Product not found or user does not own the product'
			);
			expect(findOneStub.calledOnce).toBe(true);
		});

		it('should return 500 on internal error', async () => {
			findOneStub.rejects(new Error('Database error'));

			const response = await request(app)
				.delete('/products/upsell/18')
				.set('Authorization', `Bearer ${jwt}`)
				.expect(500);

			expect(response.body.message).toBe('Something went wrong!');
			expect(findOneStub.calledOnce).toBe(true);
		});
	});
});
