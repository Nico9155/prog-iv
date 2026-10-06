import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const app = express();
const PORT = process.env.PORT ;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

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

app.get('/api/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id_usuario, nombres, apellidos, usuario, rol, activo FROM usuarios');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Ocurrió un error en la base de datos" });
    }
});


//Bread de categoria para la primera entrega!!

// Browse: Listar todas las categorias activas
app.get('/api/categorias', async (req, res) => {
    try {
        const sql = `
            SELECT id_categoria, descripcion, activo 
            FROM categorias 
            WHERE activo = 1 
            ORDER BY id_categoria ASC;
        `;
        const { rows } = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener categorias' });
    }
});

// Read: categoria por ID
app.get('/api/categorias/:id', async (req, res) => {
    try {
        const sql = `
            SELECT id_categoria, descripcion, activo 
            FROM categorias 
            WHERE id_categoria = $1 AND activo = 1;
        `;
        const { rows } = await pool.query(sql, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener categoria' });
    }
});

// Add: Crear nueva categoria
app.post('/api/categorias', async (req, res) => {
    try {
        const sql = `
            INSERT INTO categorias (descripcion, activo) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const { rows } = await pool.query(sql, [req.body.descripcion, 1]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear categoria' });
    }
});

// Edit: Actualizar categoria existente
app.put('/api/categorias/:id', async (req, res) => {
    try {
        const sql = `
            UPDATE categorias 
            SET descripcion = $1 
            WHERE id_categoria = $2 
            RETURNING *;
        `;
        const { rows } = await pool.query(sql, [req.body.descripcion, req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar categoria' });
    }
});

// Delete: Baja logica (activo = 0)
app.delete('/api/categorias/:id', async (req, res) => {
    try {
        const sql = `
            UPDATE categorias 
            SET activo = 0 
            WHERE id_categoria = $1 
            RETURNING *;
        `;
        const { rows } = await pool.query(sql, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
        res.status(200).json({ message: 'Categoria eliminada con exito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar categoria' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor API seguro escuchando en http://localhost:${PORT}`);
});
