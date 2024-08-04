'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'products',
			[
				{
					name: 'Product 1',
					sku: 'SKU001',
					user_id: 1,
					price: 10.0,
					quantity: 2,
					description: 'Description for product 1',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					name: 'Product 2',
					sku: 'SKU002',
					user_id: 2,
					price: 20.12,
					quantity: 3,
					description: 'Description for product 2',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					name: 'Product 3',
					sku: 'SKU003',
					user_id: 3,
					price: 30.0,
					quantity: 300,
					description: 'Description for Product 3',
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
