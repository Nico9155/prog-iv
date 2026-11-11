import express from 'express';
import AuthControlador from '../../controladores/auth.js';
import { validarCampos } from '../../middlewares/validarCampos.js';
import { check } from 'express-validator';

const router = express.Router();
const authControlador = new AuthControlador();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - contrasenia
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: carper@correo.com
 *               contrasenia:
 *                 type: string
 *                 example: carper
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       401:
 *         description: Usuario o contraseña incorrectos
 */
router.post('/login',
    [
        check('usuario')
            .notEmpty().withMessage('El usuario es obligatorio.')
            .isEmail().withMessage('Revisar el formato del dato.'),
        check('contrasenia')
            .notEmpty().withMessage('La contraseña es obligatoria.'),
        validarCampos
    ],
    authControlador.login
);

export { router };
