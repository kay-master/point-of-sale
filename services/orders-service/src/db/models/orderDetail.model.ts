import {
	AutoIncrement,
	Column,
	DataType,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
	BelongsTo,
	UpdatedAt,
	CreatedAt,
} from 'sequelize-typescript';
import { Order } from './order.model';

export interface OrderDetailCreationAttributes {
	orderId: number;
	productId: number;
	productName: string;
	productPrice: number;
	productDescription: string;
	productSKU: string;
	quantity: number;
	totalPrice: number;
}

@Table({ tableName: 'order_details' })
export class OrderDetail extends Model<
	OrderDetail,
	OrderDetailCreationAttributes
> {
	@AutoIncrement
	@PrimaryKey
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'id',
	})
	detailId!: number;

	@ForeignKey(() => Order)
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'order_id',
	})
	orderId!: number;

	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'product_id',
	})
	productId!: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'product_name',
	})
	productName!: string;

	@Column({
		type: DataType.FLOAT,
		allowNull: false,
		field: 'product_price',
	})
	productPrice!: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'product_description',
	})
	productDescription!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'product_sku',
	})
	productSKU!: string;

	@Column({
		allowNull: false,
	})
	quantity!: number;

	@Column({
		allowNull: false,
		field: 'total_price',
	})
	totalPrice!: number;

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

	@BelongsTo(() => Order, 'orderId')
	order!: Order;
}
