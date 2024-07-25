import fastify from 'fastify';
import 'dotenv/config';

const { NODE_ENV } = process.env;

const envToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss',
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

// Register parent error handler
server.setErrorHandler((error, _request, reply) => {
	console.error(error);

	reply
		.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
		.send(errorResponse('Something went wrong!', null));
});

export default server;
