import {
	AutoIncrement,
	Column,
	CreatedAt,
	DataType,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
	HasMany,
} from 'sequelize-typescript';
import { OrderDetail } from './orderDetail.model';
import { OrderStatus } from '@libs/interfaces';

interface OrderCreationAttributes {
	totalAmount: number;
	userId: number;
	status: OrderStatus;
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, OrderCreationAttributes> {
	@AutoIncrement
	@PrimaryKey
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		field: 'id',
	})
	orderId!: number;

	@Column({
		allowNull: false,
		field: 'user_id',
	})
	userId!: number;

	@Column({
		allowNull: false,
		type: DataType.FLOAT,
		field: 'total_amount',
	})
	totalAmount!: number;

	@Column({
		type: DataType.ENUM(...Object.values(OrderStatus)),
		allowNull: false,
		defaultValue: OrderStatus.PENDING,
	})
	status!: OrderStatus;

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

	@HasMany(() => OrderDetail, 'orderId')
	details!: OrderDetail[];
}
