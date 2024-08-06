import request from 'supertest';
import app from '../../src/app';
import sinon from 'sinon';
import bcrypt from 'bcrypt';

import { User } from '../../src/db/models/user.model';

describe('Account Management', () => {
	let findOneStub: sinon.SinonStub;
	let createStub: sinon.SinonStub;

	afterEach(() => {
		sinon.restore();
	});

	it('should register a new user', async () => {
		const userData = {
			firstName: 'Asus',
			lastName: 'Doe',
			email: 'tester@gmail.com',
			password: 'password123',
		};

		// Mock User.create to return the expected response
		createStub = sinon.stub(User, 'create').resolves({
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			createdAt: new Date().toISOString(),
			password: userData.password,
		} as any);

		const response = await request(app)
			.post('/auth/register')
			.send(userData)
			.expect(201);

		expect(response.status).toBe(201);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe('Registered successfully');
		expect(response.body.data).toHaveProperty(
			'firstName',
			userData.firstName
		);
		expect(response.body.data).toHaveProperty(
			'lastName',
			userData.lastName
		);
		expect(response.body.data).toHaveProperty('email', userData.email);
		expect(response.body.data).toHaveProperty('createdAt');

		// Ensure the createStub was called once with the correct parameters
		expect(createStub.calledOnce).toBe(true);

		const createUserCallArgs = createStub.getCall(0).args[0] as any;

		expect(createUserCallArgs.firstName).toBe(userData.firstName);
		expect(createUserCallArgs.lastName).toBe(userData.lastName);
		expect(createUserCallArgs.email).toBe(userData.email);
	});

	it('should register an existing account', async () => {
		const userData = {
			firstName: 'Asus',
			lastName: 'Doe',
			email: 'tester2@gmail.com',
			password: 'password123',
			createdAt: new Date('2024-07-28T23:47:05.000Z'),
		};

		// Mock User.findOne to return an existing user
		findOneStub = sinon.stub(User, 'findOne').resolves(userData as any);

		// Attempt to register with the same email
		const registerData = {
			email: userData.email,
			password: userData.password,
			firstName: userData.firstName,
			lastName: userData.lastName,
		};

		const response = await request(app)
			.post('/auth/register')
			.send(registerData)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Email already in use');

		expect(findOneStub.calledOnce).toBe(true);
	});

	it('should login an existing user', async () => {
		const userData = {
			firstName: 'Asus',
			lastName: 'Doe',
			email: 'tester@gmail.com',
			password: 'password123',
			createdAt: new Date('2024-07-28T23:47:05.000Z'),
		};

		// Hash the password for the mock user
		const hashedPassword = await bcrypt.hash(userData.password, 10);

		// Mock User.findOne
		const findOneStub = sinon.stub(User, 'findOne').resolves({
			id: 1,
			...userData,
			password: hashedPassword,
			validatePassword: (password: string) =>
				bcrypt.compare(password, hashedPassword),
		} as any);

		const response = await request(app)
			.post('/auth/login')
			.send(userData)
			.expect(200);

		expect(response.body.data).toHaveProperty('token');
		expect(response.body.data).toHaveProperty('account');

		const { account, token } = response.body.data;

		expect(token).toBeTruthy();
		expect(account).toHaveProperty('firstName', userData.firstName);
		expect(account).toHaveProperty('lastName', userData.lastName);
		expect(account).toHaveProperty('email', userData.email);
		expect(account).toHaveProperty(
			'createdAt',
			userData.createdAt.toISOString()
		);

		expect(findOneStub.calledOnce).toBe(true);
	});

	it('should fail login with incorrect password', async () => {
		const userData = {
			email: 'tester@gmail.com',
			password: 'wrongpassword',
		};

		const hashedPassword = await bcrypt.hash(userData.password, 10);

		// Mock User.findOne
		sinon.stub(User, 'findOne').resolves({
			id: 1,
			email: 'tester@gmail.com',
			password: hashedPassword,
			validatePassword: (password: string) =>
				bcrypt.compare(password, hashedPassword),
		} as any);

		sinon.stub(bcrypt, 'compare').resolves(false);

		const response = await request(app)
			.post('/auth/login')
			.send(userData)
			.expect(400);

		expect(response.body.message).toBe('Invalid credentials');
	});

	it('should fail login with non-existing user', async () => {
		const userData = {
			email: 'nonexisting@gmail.com',
			password: 'password123',
		};

		// Mock User.findOne
		sinon.stub(User, 'findOne').resolves(null);

		const response = await request(app)
			.post('/auth/login')
			.send(userData)
			.expect(400);

		expect(response.body.message).toBe('Invalid credentials');
	});
});
