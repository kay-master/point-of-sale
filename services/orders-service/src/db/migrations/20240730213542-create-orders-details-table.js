'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('order_details', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			orderId: {
				allowNull: false,
				type: Sequelize.BIGINT,
				references: {
					model: 'orders',
					key: 'id',
				},
				onDelete: 'CASCADE',
				field: 'order_id',
			},
			productId: {
				allowNull: false,
				type: Sequelize.BIGINT,
				field: 'product_id',
			},
			productName: {
				allowNull: false,
				type: Sequelize.STRING,
				field: 'product_name',
			},
			productPrice: {
				allowNull: false,
				type: Sequelize.FLOAT,
				field: 'product_price',
			},
			productDescription: {
				allowNull: false,
				type: Sequelize.STRING,
				field: 'product_description',
			},
			productSKU: {
				allowNull: false,
				type: Sequelize.STRING,
				field: 'product_sku',
			},
			quantity: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			totalPrice: {
				allowNull: false,
				type: Sequelize.FLOAT,
				field: 'total_price',
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
		await queryInterface.dropTable('order_details');
	},
};
