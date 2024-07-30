'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('upsell_products', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			productId: {
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: 'products',
					key: 'id',
				},
				onDelete: 'CASCADE',
				field: 'product_id',
				comment: 'Product ID of the product',
			},
			upsellProductId: {
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: 'products',
					key: 'id',
				},
				onDelete: 'CASCADE',
				field: 'upsell_product_id',
				comment: 'Product ID of the upsell product',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				field: 'created_at',
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('upsell_products');
	},
};
