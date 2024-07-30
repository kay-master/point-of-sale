'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'products',
			[
				{
					name: 'Product 1',
					price: 10.0,
					quantity: 2,
					description: 'Description for product 1',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					name: 'Product 2',
					price: 20.12,
					quantity: 3,
					description: 'Description for product 2',
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('products', null, {});
	},
};
