import sequelize from '../src/db';
import sinon from 'sinon';

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

beforeEach(() => {
	sinon.restore();
});
