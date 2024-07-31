'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'orders',
			[
				{
					total_amount: 100.0,
					user_id: 1,
					status: 'pending',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					total_amount: 200.0,
					user_id: 2,
					status: 'processing',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					total_amount: 300.0,
					user_id: 3,
					status: 'complete',
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('orders', null, {});
	},
};
