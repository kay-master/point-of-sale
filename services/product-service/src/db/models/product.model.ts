import {
	AutoIncrement,
	Column,
	CreatedAt,
	DataType,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from 'sequelize-typescript';

export interface ProductCreationAttributes {
	name: string;
	price: number;
	quantity: number;
	description: string;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttributes> {
	@AutoIncrement
	@PrimaryKey
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
	})
	id!: number;

	@Column({
		allowNull: false,
	})
	name!: string;

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
}
