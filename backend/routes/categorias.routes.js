import { Router } from 'express';
import { categoriasController } from '../controllers/categorias.controller.js';
import { categoriasValidation } from '../validators/categorias.validation.js';

const router = Router();

router.get('/', categoriasController.browse);

router.get('/:id', categoriasValidation.validateId, categoriasController.read);

router.post('/', categoriasValidation.create, categoriasController.add);

router.put('/:id', categoriasValidation.update, categoriasController.edit);

router.delete('/:id', categoriasValidation.validateId, categoriasController.delete);

export default router;
