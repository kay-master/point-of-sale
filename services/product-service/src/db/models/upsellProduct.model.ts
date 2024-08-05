import {
	AfterDestroy,
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { Product } from './product.model';

export interface UpsellProductCreationAttributes {
	productId: number;
	upsellProductId: number;
}

@Table({ timestamps: false, tableName: 'upsell_products' })
export class UpsellProduct extends Model<
	UpsellProduct,
	UpsellProductCreationAttributes
> {
	@AutoIncrement
	@PrimaryKey
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'id',
	})
	upsellId!: number;

	@ForeignKey(() => Product)
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'product_id',
	})
	productId!: number;

	@ForeignKey(() => Product)
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'upsell_product_id',
	})
	upsellProductId!: number;

	@CreatedAt
	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		field: 'created_at',
	})
	createdAt!: Date;

	@BelongsTo(() => Product, 'productId')
	product!: Product;

	@BelongsTo(() => Product, {
		as: 'upsellProductDetail',
		foreignKey: 'upsellProductId',
	})
	upsellProduct!: Product;

	@AfterDestroy
	static logAfterDestroy(instance: UpsellProduct) {
		console.log('Upsell product removed successfully', instance.upsellId);
	}
}
