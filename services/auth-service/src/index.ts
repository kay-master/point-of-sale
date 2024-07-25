import app from './app';

const { PORT, NODE_ENV } = process.env;

const port = PORT || 3001;
const env = NODE_ENV || 'development';

const server = app.listen(port, () => {
	console.log('App is running at http://localhost:%d in %s mode', port, env);
	console.log('Press CTRL-C to stop\n');
});

export default server;
