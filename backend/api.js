import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaFrontend = path.resolve(__dirname, '../frontend');

app.use(express.json()); 
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.static(rutaFrontend));

app.get('/', (req, res) => {
    res.sendFile(path.join(rutaFrontend, 'index.html'));
});

app.post('/api/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                message: "El usuario y la contraseña son obligatorios."
            });
        }

        // CONSTANTES COMPLETAMENTE LIMPIAS
        const USUARIO_VALIDO = "admin_municipal";
        const PASSWORD_VALIDA = "Segura123";

        // Console.log seguro para revisar qué llega desde el formulario
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

app.listen(PORT, () => {
    console.log(`🚀 Servidor API seguro escuchando en http://localhost:${PORT}`);
});
