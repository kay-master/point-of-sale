'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const bcrypt = require('bcrypt');
		const salt = await bcrypt.genSalt(10);

		await queryInterface.bulkInsert(
			'users',
			[
				{
					email: 'john.doe@example.com',
					password: await bcrypt.hash('password123', salt),
					first_name: 'John',
					last_name: 'Doe',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					email: 'jane.doe@example.com',
					password: await bcrypt.hash('password123', salt),
					first_name: 'Jane',
					last_name: 'Doe',
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('users', null, {});
	},
};
