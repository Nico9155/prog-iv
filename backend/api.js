import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './repositories/database.js';
import categoriasRouter from './routes/categorias.routes.js'; // Tus nuevas rutas por capas

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/api/categorias', categoriasRouter);

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
