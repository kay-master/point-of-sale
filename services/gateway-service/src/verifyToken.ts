import { ApiService } from '@libs/api-service';
import { SessionToken } from '@libs/interfaces';
import { FastifyRequest } from 'fastify';
import NodeCache from 'node-cache';

// Token verification function
export async function verifyToken(
	req: FastifyRequest,
	tokenCache: NodeCache
): Promise<SessionToken> {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		throw new Error('Authorization header missing');
	}

	const token = authHeader.split(' ')[1];

	const cachedToken = tokenCache.get<SessionToken>(token);

	if (cachedToken) {
		return cachedToken;
	}

	// Dummy headers for the auth service
	const reqHeaders: any = {
		headers: {
			'x-account-id': 0,
			'x-user-service': 'gateway-service',
		},
	};

	const response = await ApiService.post<SessionToken>(
		'ACCOUNT_SERVICE',
		reqHeaders,
		'/internal/verify-access',
		{ token }
	);

	if (!response.success) {
		throw new Error('Token verification failed');
	}

	tokenCache.set(token, response.data);

	return response.data;
}
