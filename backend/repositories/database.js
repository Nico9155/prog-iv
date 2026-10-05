// Configuración y conexión de Base de Datos
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'incidencias_db',
    password: 'nico2004',
    port: 5432,
});