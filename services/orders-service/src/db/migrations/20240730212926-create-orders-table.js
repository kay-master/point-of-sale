'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('orders', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			userId: {
				allowNull: false,
				type: Sequelize.BIGINT,
				field: 'user_id',
			},
			totalAmount: {
				allowNull: false,
				type: Sequelize.FLOAT,
				field: 'total_amount',
			},
			status: {
				type: Sequelize.ENUM('pending', 'processing', 'complete'),
				allowNull: false,
				defaultValue: 'pending',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				field: 'created_at',
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				field: 'updated_at',
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('orders');
	},
};
