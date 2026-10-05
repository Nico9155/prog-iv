// Configuración y conexión de Base de Datos
//Este archivo lo tendriamos que cambiar al final de todo por un .env y agregarla a .gitignore
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'incidencias_db',
    password: '', //Aca cada uno tiene que poner su contraseña del pgadmin
    port: 5432,
});