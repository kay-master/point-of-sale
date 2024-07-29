import {
	AutoIncrement,
	BeforeCreate,
	BeforeUpdate,
	Column,
	CreatedAt,
	DataType,
	IsEmail,
	Model,
	PrimaryKey,
	Table,
	Unique,
	UpdatedAt,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

export interface UserCreationAttributes {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
	@AutoIncrement
	@PrimaryKey
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
	})
	id!: number;

	@IsEmail
	@Unique
	@Column({
		allowNull: false,
	})
	email!: string;

	@Column({
		allowNull: false,
	})
	password!: string;

	@Column({
		allowNull: false,
		field: 'first_name',
	})
	firstName!: string;

	@Column({
		allowNull: false,
		field: 'last_name',
	})
	lastName!: string;

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

	@BeforeCreate
	@BeforeUpdate
	static async hashPassword(instance: User) {
		if (instance.changed('password')) {
			const salt = await bcrypt.genSalt(10);

			instance.password = await bcrypt.hash(instance.password, salt);
		}
	}

	/**
	 * Validate password
	 */
	async validatePassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}
}
