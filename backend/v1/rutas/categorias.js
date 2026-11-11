import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import CategoriasControlador from '../../controladores/categorias.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuario.js';

const router = express.Router();
const categoriasControlador = new CategoriasControlador();

/**
 * @swagger
 * /api/v1/categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     security:
 *       - bearerAuth: []
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', autorizarUsuarios([2]), categoriasControlador.buscarTodos);

/**
 * @swagger
 * /api/v1/categorias/{id_categoria}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id_categoria
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la categoría
 */
router.get('/:id_categoria',
    [
        param('id_categoria')
            .isInt().withMessage('El id debe ser un valor numérico'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    categoriasControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/categorias/{id_categoria}:
 *   put:
 *     summary: Modifica una categoría por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id_categoria
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría modificada
 */
router.put('/:id_categoria',
    [
        param('id_categoria')
            .isInt().withMessage('El id debe ser un valor numérico')
            .notEmpty().withMessage('El id es necesario para la consulta'),
        check('descripcion')
            .notEmpty().withMessage('La descripción es obligatoria para la modificación'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    categoriasControlador.editar
);

/**
 * @swagger
 * /api/v1/categorias/{id_categoria}:
 *   delete:
 *     summary: Elimina lógicamente una categoría por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id_categoria
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 */
router.delete('/:id_categoria',
    [
        param('id_categoria')
            .isInt().withMessage('El id debe ser un valor numérico')
            .notEmpty().withMessage('El id es necesario para la consulta'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    categoriasControlador.borrar
);

/**
 * @swagger
 * /api/v1/categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     security:
 *       - bearerAuth: []
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router.post('/',
    [
        check('descripcion')
            .notEmpty().withMessage('La descripción es obligatoria.')
            .isLength({ min: 3, max: 255 }).withMessage('La longitud del campo debe estar entre 3 y 255 caracteres.'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    categoriasControlador.crear
);

export { router };
