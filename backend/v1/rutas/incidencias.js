import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import IncidenciasControlador from '../../controladores/incidencias.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuario.js';

const router = express.Router();
const incidenciasControlador = new IncidenciasControlador();

/**
 * @swagger
 * /api/v1/incidencias:
 *   post:
 *     summary: Crear una nueva incidencia
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_articulo
 *               - descripcion_pedido
 *               - prioridad
 *             properties:
 *               id_articulo:
 *                 type: integer
 *               descripcion_pedido:
 *                 type: string
 *               prioridad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Incidencia creada
 */
router.post('/',
    [
        check('id_articulo')
            .notEmpty().withMessage('El artículo es obligatorio.'),
        check('descripcion_pedido')
            .notEmpty().withMessage('La descripción del pedido es obligatoria.'),
        check('prioridad')
            .notEmpty().withMessage('La prioridad del pedido es obligatoria.'),
        validarCampos
    ],
    autorizarUsuarios([3]),
    incidenciasControlador.crear
);

/**
 * @swagger
 * /api/v1/incidencias/mis-incidencias:
 *   get:
 *     summary: Obtiene las incidencias del usuario logueado
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: Lista de incidencias
 */
router.get('/mis-incidencias', autorizarUsuarios([2, 3]), incidenciasControlador.buscarPorIdUsuario);

/**
 * @swagger
 * /api/v1/incidencias:
 *   get:
 *     summary: Obtiene todas las incidencias (Director)
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: Lista de todas las incidencias
 */
router.get('/', autorizarUsuarios([1]), incidenciasControlador.buscarTodas);

/**
 * @swagger
 * /api/v1/incidencias/tecnicos:
 *   get:
 *     summary: Obtiene la lista de técnicos de sistemas para asignar
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: Lista de técnicos
 */
router.get('/tecnicos', autorizarUsuarios([1]), incidenciasControlador.buscarEmpleadosSistemas);

/**
 * @swagger
 * /api/v1/incidencias/{id_incidencia}/asignar:
 *   put:
 *     summary: Asigna una incidencia a un empleado de Sistemas
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id_incidencia
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
 *               - asignado_a
 *             properties:
 *               asignado_a:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Incidencia asignada
 */
router.put('/:id_incidencia/asignar',
    [
        param('id_incidencia')
            .notEmpty().withMessage('La incidencia es necesaria.')
            .isInt().withMessage('La incidencia debe ser un valor entero'),
        check('asignado_a')
            .notEmpty().withMessage('El id del empleado es necesario.')
            .isInt().withMessage('El id del empleado debe ser un valor entero'),
        validarCampos
    ],
    autorizarUsuarios([1]),
    incidenciasControlador.asignarA
);

/**
 * @swagger
 * /api/v1/incidencias/{id_incidencia}/finalizar:
 *   put:
 *     summary: Finaliza una incidencia
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id_incidencia
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
 *               - resolucion
 *             properties:
 *               resolucion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Incidencia finalizada
 */
router.put('/:id_incidencia/finalizar',
    [
        param('id_incidencia')
            .notEmpty().withMessage('La incidencia es necesaria.')
            .isInt().withMessage('La incidencia debe ser un valor entero'),
        check('resolucion')
            .notEmpty().withMessage('La descripción es necesaria.'),
        validarCampos
    ],
    autorizarUsuarios([2]),
    incidenciasControlador.finalizarIncidencia
);

/**
 * @swagger
 * /api/v1/incidencias/{id_incidencia}/cancelar:
 *   put:
 *     summary: Cancela una incidencia pendiente
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id_incidencia
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Incidencia cancelada
 */
router.put('/:id_incidencia/cancelar',
    [
        param('id_incidencia')
            .notEmpty().withMessage('La incidencia es necesaria.')
            .isInt().withMessage('La incidencia debe ser un valor entero'),
        validarCampos
    ],
    autorizarUsuarios([1, 3]),
    incidenciasControlador.cancelar
);

/**
 * @swagger
 * /api/v1/incidencias/informe:
 *   get:
 *     summary: Genera el reporte PDF de incidencias
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: PDF generado
 */
router.get('/informe', autorizarUsuarios([1]), incidenciasControlador.generarInforme);

/**
 * @swagger
 * /api/v1/incidencias/datos-dashboard:
 *   get:
 *     summary: Obtiene los datos estadísticos del Dashboard
 *     security:
 *       - bearerAuth: []
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: Datos del dashboard
 */
router.get('/datos-dashboard', autorizarUsuarios([1]), incidenciasControlador.datosDashboard);

export { router };
