import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';

// DOCUMENTACIÓN SWAGGER
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { router as v1Categorias } from './v1/rutas/categorias.js';
import { router as v1Articulos } from './v1/rutas/articulos.js';
import { router as v1Incidencias } from './v1/rutas/incidencias.js';
import { router as v1Auth } from './v1/rutas/auth.js';

import autenticar from './middlewares/autenticar.js';

const app = express();
app.use(express.json());
app.use(cors());

const log = fs.createWriteStream('./accesos.log', { flags: 'a' });
app.use(morgan('combined', { stream: log }));
app.use(morgan('tiny'));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST INCIDENCIAS',
            version: '1.0.0',
            description: 'API REST Gestión de incidencias municipales',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Aquí el token con el formato: Bearer',
                },
            },
        },
    },
    apis: ['./v1/rutas/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.json({ 'resp': 'APP INCIDENCIAS!' });
});

// RUTA DE ACCESO PÚBLICO
app.use('/api/v1/auth', v1Auth);

// RUTAS PRIVADAS, REQUIEREN AUTENTICACIÓN
app.use('/api/v1/categorias', autenticar, v1Categorias);
app.use('/api/v1/articulos', autenticar, v1Articulos);
app.use('/api/v1/incidencias', autenticar, v1Incidencias);

export default app;
