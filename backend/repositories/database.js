// Configuración y conexión de Base de Datos
//Este archivo hace de conexion con el .env , aca depues en vez de poner las claves ponemos la conexion entre este y el .env 
//agregarla a .gitignore

import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'incidencias_db',
    password: '', //Aca cada uno tiene que poner su contraseña del pgadmin
    port: 5432,
});