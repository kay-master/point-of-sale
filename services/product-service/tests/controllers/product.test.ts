import request from 'supertest';
import app from '../../src/app';
import sinon from 'sinon';
import { Product } from '../../src/db/models/product.model';
import { HTTP_STATUS_CODES, signToken } from '@libs/middlewares';

describe('Product Service', () => {
	let findAllStub: sinon.SinonStub;
	let createStub: sinon.SinonStub;
	let jwt = '';

	let findOneStub: sinon.SinonStub;
	let updateStub: sinon.SinonStub;
	let destroyStub: sinon.SinonStub;

	beforeEach(() => {
		jwt = signToken('path', { accountId: 1 });
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('Get Products', () => {
		it('should return a list of products', async () => {
			const products = [
				{
					productId: 7,
					name: '2L Coke',
					sku: 'SKU-2LC-20670',
					price: 26.99,
					quantity: 43,
					description: '2l Coke',
				},
			];

			findAllStub = sinon
				.stub(Product, 'findAll')
				.resolves(products as any);

			const response = await request(app)
				.get('/products/list')
				.expect(HTTP_STATUS_CODES.OK);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe(
				'Products retrieved successfully'
			);

			expect(response.body.data).toEqual(products);
			expect(findAllStub.calledOnce).toBe(true);
		});

		it('should return a list of specific products', async () => {
			const expectedProducts = [
				{
					productId: 4,
					name: 'Pilchard',
					sku: 'SKU-PIL-52178',
					price: 10.99,
					quantity: 10,
					description: '500ml can of fresh Pilchard',
					createdAt: new Date('2024-07-28T20:47:05.000Z'),
				},
				{
					productId: 2,
					name: '2L Coke',
					sku: 'SKU-2LC-20670',
					price: 26.99,
					quantity: 43,
					description: '2l Coke',
					createdAt: new Date('2024-07-28T23:47:05.000Z'),
				},
			];

			const products = [
				...expectedProducts,
				{
					productId: 5,
					name: 'Rice',
					sku: 'SKU-RIC-05032',
					price: 190.5,
					quantity: 50,
					description: '10Kg rice',
					createdAt: new Date('2024-07-27T23:47:05.000Z'),
				},
			];

			findAllStub = sinon
				.stub(Product, 'findAll')
				.resolves(products as any);

			const response = await request(app)
				.get('/products/list?products=[4,2]')
				.expect(HTTP_STATUS_CODES.OK);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe(
				'Products retrieved successfully'
			);

			// Ensure both arrays have the same length
			expect(response.body.data.length).toBe(expectedProducts.length);

			expectedProducts.forEach((expectedProduct, index) => {
				expect(response.body.data[index].productId).toEqual(
					expectedProduct.productId
				);
			});

			expect(findAllStub.calledOnce).toBe(true);
		});
	});

	describe('Create Product', () => {
		it('should create a product successfully', async () => {
			const product = {
				productId: 15,
				name: 'Akukhonto Uzakuyenza',
				sku: 'SKU-AKU-20670',
				price: 14.99,
				quantity: 100,
				description: 'Akukhonto Uzakuyenza',
			};

			createStub = sinon.stub(Product, 'create').resolves(product as any);

			const response = await request(app)
				.post('/products')
				.send(product)
				.set('Authorization', `Bearer ${jwt}`)
				.expect(HTTP_STATUS_CODES.CREATED);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Product created successfully');
			expect(response.body.data).toEqual(product);
			expect(createStub.calledOnce).toBe(true);
		});
	});

	describe('Update Product', () => {
		it('should update a product successfully', async () => {
			const productData = {
				productId: 7,
				userId: 1,
				name: 'Updated 2L Coke',
				sku: 'SKU-2LC-20670',
				price: 26.99,
				quantity: 43,
				description: '2l Coke',
			};

			const productInstance = Product.build(productData);

			findOneStub = sinon
				.stub(Product, 'findOne')
				.resolves(productInstance);

			updateStub = sinon
				.stub(productInstance, 'update')
				.callsFake((updatedData) => {
					Object.assign(productInstance, updatedData);
					return Promise.resolve(productInstance);
				});

			const response = await request(app)
				.put(`/products/${productData.productId}`)
				.send({ name: 'New Coke' })
				.set('Authorization', `Bearer ${jwt}`)
				.expect(HTTP_STATUS_CODES.OK);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Product updated successfully');
			expect(response.body.data.name).toEqual('New Coke');
			expect(findOneStub.calledOnce).toBe(true);
			expect(updateStub.calledOnce).toBe(true);
		});
	});

	describe('Delete Product', () => {
		it('should delete a product successfully', async () => {
			const product = {
				productId: 7,
				userId: 1,
				name: 'To delete 2L Coke',
				sku: 'SKU-2LC-20670',
				price: 26.99,
				quantity: 43,
				description: '2l Coke',
				upsellProducts: [],
			};

			const productInstance = Product.build(product, {
				include: [{ all: true }],
			});

			findOneStub = sinon
				.stub(Product, 'scope')
				.withArgs('withUpsells')
				.returns({
					findOne: sinon.stub().resolves(productInstance),
				} as any);

			destroyStub = sinon.stub(productInstance, 'destroy').resolves();

			const response = await request(app)
				.delete(`/products/${product.productId}`)
				.set('Authorization', `Bearer ${jwt}`)
				.expect(HTTP_STATUS_CODES.OK);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Product deleted successfully');

			// Check deleted product is returned
			expect(response.body.data.name).toBe(product.name);

			expect(findOneStub.calledOnce).toBe(true);
			expect(destroyStub.calledOnce).toBe(true);
		});

		it('should return an error if the product has upsell products', async () => {
			const productData = {
				productId: 7,
				userId: 1,
				name: 'delete this 2L Coke',
				sku: 'SKU-2LC-20670',
				price: 26.99,
				quantity: 43,
				description: '2l Coke',
				upsellProducts: [
					{
						upsellProductId: 1,
						productId: 7,
						upsellId: 2,
						createdAt: new Date(),
					},
				],
			};

			const productInstance = Product.build(productData, {
				include: [{ all: true }],
			});

			findOneStub = sinon
				.stub(Product, 'scope')
				.withArgs('withUpsells')
				.returns({
					findOne: sinon.stub().resolves(productInstance),
				} as any);

			const response = await request(app)
				.delete(`/products/${productData.productId}`)
				.set('Authorization', `Bearer ${jwt}`)
				.expect(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe(
				'Product has upsell products, delete upsell products first'
			);
			expect(findOneStub.calledOnce).toBe(true);
		});
	});
});
