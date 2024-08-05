import express from 'express';
import compression from 'compression';

import helmet from 'helmet';
import routes from './routes';
import cors from 'cors';
import { NotFoundException, errorMiddleware, logger } from '@libs/middlewares';

import { rabbitMqInit } from './events/rabbitmq.service';
import dotEnv from './config/dotEnv';

dotEnv();

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Register logger
app.use(logger('combined'));

// Initialize RabbitMQ connection
rabbitMqInit();

// Config routers
app.use('/notification', routes);

app.use((_req, _res) => {
	throw new NotFoundException('Not found', null);
});

// Register the error handler middleware
app.use(errorMiddleware);

export default app;
