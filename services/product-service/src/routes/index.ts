import { Request, Response, Router } from 'express';
// import { login, register } from '../controllers/auth.controller';
import { errorHandler, validateData } from '@libs/middlewares';
import {
	createProduct,
	getProducts,
	updateProduct,
} from '../controllers/product.controller';
import {
	ProductCreationSchema,
	ProductUpdateSchema,
} from '../schema/product.schema';
// import { LoginSchema, RegisterSchema } from '../schema/auth.schema';

const router = Router();

// Health check endpoint
router.get(
	'/health',
	errorHandler((_req: Request, res: Response) => {
		res.send('Service is up and running!');
	})
);

router.get('/', errorHandler(getProducts));

router.post(
	'/',
	validateData(ProductCreationSchema),
	errorHandler(createProduct)
);
router.put(
	'/:id',
	validateData(ProductUpdateSchema),
	errorHandler(updateProduct)
);

export default router;
