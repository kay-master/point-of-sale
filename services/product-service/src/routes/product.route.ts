import { Router } from 'express';
import { errorHandler, validateData } from '@libs/middlewares';
import {
	createProduct,
	deleteProduct,
	updateProduct,
} from '../controllers/product.controller';
import {
	ProductCreationSchema,
	ProductUpdateSchema,
} from '../schema/product.schema';

const router = Router();

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
router.delete('/:id', errorHandler(deleteProduct));

export default router;
