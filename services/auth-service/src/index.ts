import { serviceDiscovery } from '@libs/service-register';
import app from './app';

const { PORT, NODE_ENV } = process.env;

const port = parseInt(PORT || '4000', 10);
const env = NODE_ENV || 'development';

const server = app.listen(port, async () => {
	console.log('App is running at http://localhost:%d in %s mode', port, env);
	console.log('Press CTRL-C to stop\n');

	await serviceDiscovery();
});

export default server;
