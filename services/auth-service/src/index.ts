import app from './app';

const { PORT } = process.env;

const port = parseInt(PORT || '3000', 10);

const server = async () => {
	try {
		await app.listen({ port, host: '0.0.0.0' });

		app.log.info('Press CTRL-C to stop\n');
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

server();

export default app;
