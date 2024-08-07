import { Sequelize } from 'sequelize-typescript';
import dbConfig from '../config/config';

const env = process.env.NODE_ENV || 'development';

// @ts-ignore
const configs = dbConfig[env];

const DB = new Sequelize({
	...configs,
	models: [__dirname + '/models/**/*.model.ts'],
	modelMatch: (filename, member) => {
		return (
			filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
			member.toLowerCase()
		);
	},
});

DB.authenticate()
	.then(() => {
		console.log('Connected to the database');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

export default DB;
