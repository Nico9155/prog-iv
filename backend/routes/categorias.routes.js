import { Router } from 'express';
import { categoriasController } from '../controllers/categorias.controller.js';
import { categoriasValidation } from '../validators/categorias.validation.js';

const router = Router();

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: obtiene todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: lista de categorías obtenida con éxito
 *       500:
 *         description: ocurrió un error interno en el servidor.
 */
router.get('/', categoriasController.browse);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: obtiene una categoría específica por su ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a buscar
 *     responses:
 *       200:
 *         description: datos de la categoría
 *       400:
 *         description: el ID proporcionado debe ser un número entero válido.
 *       404:
 *         description: categoría no encontrada o inactiva.
 *       500:
 *         description: ocurrió un error interno en el servidor.
 */
router.get('/:id', categoriasValidation.validateId, categoriasController.read);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: crea una nueva categoría
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: categoría creada con éxito
 *       400:
 *         description: la descripción es obligatoria y debe ser un texto válido.
 *       500:
 *         description: ocurrió un error interno en el servidor.
 */
router.post('/', categoriasValidation.create, categoriasController.add);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: actualiza una categoría existente por su ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *             properties:
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: categoría actualizada con éxito
 *       400:
 *         description: el ID proporcionado debe ser un número entero válido. o la descripción es obligatoria para poder actualizar la categoría.
 *       404:
 *         description: categoría no encontrada o inactiva.
 *       500:
 *         description: ocurrió un error interno en el servidor.
 */
router.put('/:id', categoriasValidation.update, categoriasController.edit);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: elimina una categoría específica por su ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a eliminar
 *     responses:
 *       200:
 *         description: categoría eliminada con éxito.
 *       400:
 *         description: el ID proporcionado debe ser un número entero válido.
 *       404:
 *         description: categoría no encontrada o ya eliminada.
 *       500:
 *         description: ocurrió un error interno en el servidor.
 */
router.delete('/:id', categoriasValidation.validateId, categoriasController.delete);

export default router;
