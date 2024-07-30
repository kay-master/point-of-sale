const dotenv = require('dotenv');

dotenv.config();

const MYSQL_HOST = process.env.DB_HOST || 'localhost';
const MYSQL_DATABASE = process.env.DB_NAME || '';
const MYSQL_USER = process.env.DB_USERNAME || 'root';
const MYSQL_PASS = process.env.DB_PASSWORD || '';
const MYSQL_PORT = parseInt(process.env.DB_PORT || '3306');
const MYSQL_DIALECT = 'mysql';

module.exports = {
	development: {
		username: MYSQL_USER,
		password: MYSQL_PASS,
		database: MYSQL_DATABASE,
		port: MYSQL_PORT,
		host: MYSQL_HOST,
		dialect: MYSQL_DIALECT,
	},
	test: {
		username: MYSQL_USER,
		password: null,
		database: MYSQL_DATABASE,
		host: MYSQL_HOST,
		dialect: MYSQL_DIALECT,
	},
};
