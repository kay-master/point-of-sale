import {
	AfterDestroy,
	AutoIncrement,
	Column,
	CreatedAt,
	DataType,
	HasMany,
	Model,
	PrimaryKey,
	Scopes,
	Table,
	UpdatedAt,
} from 'sequelize-typescript';
import { UpsellProduct } from './upsellProduct.model';

export interface ProductCreationAttributes {
	name: string;
	price: number;
	userId: number;
	quantity: number;
	description: string;
	sku: string;
}

@Scopes(() => ({
	withUpsells: {
		include: [
			{
				model: UpsellProduct,
				as: 'upsellProducts',
				include: [
					{
						model: Product,
						as: 'upsellProduct',
					},
				],
			},
		],
	},
}))
@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttributes> {
	@AutoIncrement
	@PrimaryKey
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'id',
	})
	productId!: number;

	@Column({
		allowNull: false,
	})
	name!: string;

	@Column({
		allowNull: false,
		unique: true,
	})
	sku!: string;

	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'user_id',
	})
	userId!: number;

	@Column({
		type: DataType.FLOAT,
		allowNull: false,
	})
	price!: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 1,
	})
	quantity!: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	description!: string;

	@CreatedAt
	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		field: 'created_at',
	})
	createdAt!: Date;

	@UpdatedAt
	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		field: 'updated_at',
	})
	updatedAt!: Date;

	@HasMany(() => UpsellProduct, 'productId')
	upsellProducts!: UpsellProduct[];

	@HasMany(() => UpsellProduct, 'upsellProductId')
	relatedToUpsellProducts!: UpsellProduct[];

	@AfterDestroy
	static logAfterDestroy(instance: Product) {
		console.log('Product deleted successfully', instance.productId);
	}
}
