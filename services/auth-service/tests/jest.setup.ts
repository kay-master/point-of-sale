import sequelize from '../src/db';
import sinon from 'sinon';
import { execSync } from 'child_process';

beforeAll(async () => {
	await sequelize.sync({ force: true });
	execSync('npm run seed:test');
});

beforeEach(() => {
	sinon.restore();
});
