import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './repositories/database.js';
import categoriasRouter from './routes/categorias.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Municipal de Incidencias',
            version: '1.0.0',
            description: 'Documentación de los endpoints del backend',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./api.js', './routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); 

app.use('/api/categorias', categoriasRouter);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: iniciar sesión en el sistema 
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: admin_municipal
 *               password:
 *                 type: string
 *                 example: Segura123
 *     responses:
 *       200:
 *         description: autenticación exitosa
 *       401:
 *         description: usuario o contraseña incorrectos
 *       500:
 *         description: error interno en el servidor
 */
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                message: "El usuario y la contraseña son obligatorios."
            });
        }

        const USUARIO_VALIDO = process.env.AUTH_USER;
        const PASSWORD_VALIDA = process.env.AUTH_PASSWORD;

        console.log(`Datos recibidos -> Usuario: [${usuario}] | Contraseña: [${password}]`);

        if (usuario === USUARIO_VALIDO && password === PASSWORD_VALIDA) {
            return res.status(200).json({
                success: true,
                message: "¡Autenticación exitosa! Bienvenido al sistema."
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Usuario o contraseña incorrectos."
            });
        }

    } catch (error) {
        console.error("Error crítico en el login:", error);
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error interno en el servidor municipal."
        });
    }
});

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: obtiene la lista completa de empleados
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: lista de usuarios obtenida con éxito
 *       500:
 *         description: error interno del servidor
 */
app.get('/api/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id_usuario, nombres, apellidos, usuario, rol, activo FROM usuarios');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Ocurrió un error en la base de datos" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor API puro escuchando en http://localhost:${PORT}`);
});
