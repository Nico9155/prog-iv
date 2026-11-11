import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import ArticulosControlador from '../../controladores/articulos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuario.js';

const router = express.Router();
const articulosControlador = new ArticulosControlador();

/**
 * @swagger
 * /api/v1/articulos:
 *   get:
 *     summary: Obtiene una lista de todos los artículos
 *     security:
 *       - bearerAuth: []
 *     tags: [Artículos]
 *     responses:
 *       200:
 *         description: Lista de artículos
 */
router.get('/', autorizarUsuarios([2, 3]), articulosControlador.buscarTodos);

/**
 * @swagger
 * /api/v1/articulos/areas:
 *   get:
 *     summary: Obtiene la lista de áreas activas
 *     security:
 *       - bearerAuth: []
 *     tags: [Artículos]
 *     responses:
 *       200:
 *         description: Lista de áreas
 */
router.get('/areas', autorizarUsuarios([2, 3]), articulosControlador.buscarAreasActivas);

/**
 * @swagger
 * /api/v1/articulos/{id_articulo}:
 *   get:
 *     summary: Obtiene un artículo por su ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Artículos]
 *     parameters:
 *       - in: path
 *         name: id_articulo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del artículo
 */
router.get('/:id_articulo',
    [
        param('id_articulo')
            .isInt().withMessage('El id debe ser un valor numérico'),
        validarCampos
    ],
    autorizarUsuarios([2, 3]),
    articulosControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/articulos/{id_articulo}:
 *   put:
 *     summary: Modifica un artículo por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Artículos]
 *     parameters:
 *       - in: path
 *         name: id_articulo
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - id_area
 *               - id_categoria
 *             properties:
 *               descripcion:
 *                 type: string
 *               id_area:
 *                 type: integer
 *               id_categoria:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Artículo modificado
 */
router.put('/:id_articulo',
    [
        param('id_articulo')
            .isInt().withMessage('El id debe ser un valor numérico')
            .notEmpty().withMessage('El id es necesario para la consulta'),
        check('descripcion')
            .notEmpty().withMessage('La descripción es obligatoria.'),
        check('id_area')
            .notEmpty().withMessage('El área es obligatoria.'),
        check('id_categoria')
            .notEmpty().withMessage('La categoría es obligatoria.'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    articulosControlador.editar
);

/**
 * @swagger
 * /api/v1/articulos/{id_articulo}:
 *   delete:
 *     summary: Elimina lógicamente un artículo por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Artículos]
 *     parameters:
 *       - in: path
 *         name: id_articulo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Artículo eliminado
 */
router.delete('/:id_articulo',
    [
        param('id_articulo')
            .isInt().withMessage('El id debe ser un valor numérico')
            .notEmpty().withMessage('El id es necesario para la consulta'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    articulosControlador.borrar
);

/**
 * @swagger
 * /api/v1/articulos:
 *   post:
 *     summary: Crear un nuevo artículo
 *     security:
 *       - bearerAuth: []
 *     tags: [Artículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - id_area
 *               - id_categoria
 *             properties:
 *               descripcion:
 *                 type: string
 *               id_area:
 *                 type: integer
 *               id_categoria:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Artículo creado
 */
router.post('/',
    [
        check('descripcion')
            .notEmpty().withMessage('La descripción es obligatoria.'),
        check('id_area')
            .notEmpty().withMessage('El área es obligatoria.'),
        check('id_categoria')
            .notEmpty().withMessage('La categoría es obligatoria.'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    articulosControlador.crear
);

export { router };
