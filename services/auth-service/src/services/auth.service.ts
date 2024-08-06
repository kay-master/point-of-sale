import { BadRequestException, signToken } from '@libs/middlewares';
import { User } from '../db/models/user.model';
import { LoginType, RegisterType } from '../schema/auth.schema';
import { ERROR_CODE } from '@libs/interfaces';

export const registerService = async (data: RegisterType) => {
	const { email, password, firstName, lastName } = data;

	const userExists = await User.findOne({ where: { email } });

	if (userExists) {
		throw new BadRequestException('Email already in use', {
			code: ERROR_CODE.EMAIL_ALREADY_IN_USE,
		});
	}

	const user = await User.create({
		email,
		password, // Password hashing is done in the model
		firstName,
		lastName,
	});

	return {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		createdAt: user.createdAt,
	};
};

export const loginService = async (data: LoginType) => {
	const { email, password } = data;

	const user = await User.findOne({ where: { email } });

	if (!user) {
		throw new BadRequestException('Invalid credentials', null);
	}

	const isPasswordValid = await user.validatePassword(password);

	if (!isPasswordValid) {
		throw new BadRequestException('Invalid credentials', null);
	}

	// Sign JWT token
	const token = signToken(__dirname + '/../', {
		accountId: user.id,
	});

	return {
		account: {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			createdAt: user.createdAt,
		},
		token,
	};
};
