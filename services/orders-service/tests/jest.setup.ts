import sequelize from '../src/db';

// Set Jest timeout to 30 seconds
jest.setTimeout(30000);

beforeAll(async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync({ force: true });
		console.log('Database connection established and synced');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		process.exit(1);
	}
});

afterAll(async () => {
	try {
		await sequelize.close();
		console.log('Database connection closed');
	} catch (error) {
		console.error('Unable to close the database connection:', error);
	}
});
