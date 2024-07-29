import NodeCache from 'node-cache';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyHttpProxy from '@fastify/http-proxy';
import proxyRoutes from './routes.config';
import 'dotenv/config';
import { HTTP_STATUS_CODES, errorResponse } from '@libs/middlewares';
import { verifyToken } from './verifyToken';

const { NODE_ENV } = process.env;

const envToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	},
	production: true,
	test: false,
};

const environment = (NODE_ENV ?? 'development') as keyof typeof envToLogger;

const server = fastify({
	logger: envToLogger[environment] ?? true,
});

const tokenCache = new NodeCache({ stdTTL: 600 }); // Cache tokens for 10 minutes

// Register parent error handler
server.setErrorHandler((error, _request, reply) => {
	console.error(error);

	reply
		.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
		.send(errorResponse('Something went wrong!', null));
});

// Dynamically register proxy routes
proxyRoutes.forEach((route) => {
	server.register(fastifyHttpProxy, {
		upstream: route.upstream,
		prefix: route.prefix,
		preValidation: route.authenticate
			? async (req: FastifyRequest, reply: FastifyReply) => {
					try {
						const user = await verifyToken(req, tokenCache);

						req.headers['x-account-id'] = user.accountId.toString();

						// @ts-ignore
						// req.user = user;
					} catch (err) {
						console.error('PreValidation error:', err);

						return reply
							.status(HTTP_STATUS_CODES.UNAUTHORIZED)
							.send(errorResponse('Unauthorized access', null));
					}
				}
			: undefined,
	});
});

export default server;
