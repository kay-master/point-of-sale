import express from 'express';
import compression from 'compression';

import helmet from 'helmet';
import routes from './routes';
import cors from 'cors';
import { NotFoundException, errorMiddleware, logger } from '@libs/middlewares';
import DB from './db';
import { rabbitMqInit } from './events/rabbitmq.service';

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
	DB.sync().catch(() => {
		console.error('Unable to connect to the database');
	});
}

// Register logger
app.use(logger('combined'));

// Initialize RabbitMQ connection
rabbitMqInit();

// Config routers
app.use('/orders', routes);

app.use((_req, _res) => {
	throw new NotFoundException('Not found', null);
});

// Register the error handler middleware
app.use(errorMiddleware);

export default app;
