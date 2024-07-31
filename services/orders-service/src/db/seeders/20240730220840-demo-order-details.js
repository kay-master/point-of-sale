'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'order_details',
			[
				{
					order_id: 1,
					product_id: 1,
					product_name: 'Product 1',
					product_price: 10.0,
					product_description: 'Description for Product 1',
					product_sku: 'SKU001',
					quantity: 2,
					total_price: 20.45,
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					order_id: 1,
					product_id: 2,
					product_name: 'Product 2',
					product_price: 20.5,
					product_description: 'Description for Product 2',
					product_sku: 'SKU002',
					quantity: 1,
					total_price: 20.5,
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					order_id: 2,
					product_id: 3,
					product_name: 'Product 3',
					product_price: 30.0,
					product_description: 'Description for Product 3',
					product_sku: 'SKU003',
					quantity: 3,
					total_price: 90.0,
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					order_id: 3,
					product_id: 1,
					product_name: 'Product 1',
					product_price: 10.0,
					product_description: 'Description for Product 1',
					product_sku: 'SKU001',
					quantity: 1,
					total_price: 10.0,
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					order_id: 3,
					product_id: 3,
					product_name: 'Product 3',
					product_price: 30.0,
					product_description: 'Description for Product 3',
					product_sku: 'SKU003',
					quantity: 2,
					total_price: 60.0,
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('order_details', null, {});
	},
};
