// Acceso a datos Municipal
//Faltaria poner limit con OFFSET para la paginacion , 
// NULL OR ILIKE (esto es para filtro, vos no necesitas?) 

import { pool } from './database.js';
// Listar los artículos activos
export const getArticulos = async () => {
    const sql = `
        SELECT id_articulo, descripcion 
        FROM articulos 
        WHERE activo = 1 
        ORDER BY descripcion ASC;
    `;
    const { rows } = await pool.query(sql);
    return rows;
};
//Listar las incidencias creadas por el empleado
export const getIncidenciasPorEmpleado = async (idEmpleado) => {
    const sql = `
        SELECT 
            i.id_incidencia, i.id_estado, i.creado_por, i.asignado_a, i.creado, i.prioridad,
            i.id_articulo, a.descripcion AS articulo_descripcion, i.descripcion_pedido, i.descripcion_resolucion
        FROM 
            incidencias AS i
        INNER JOIN articulos a ON i.id_articulo = a.id_articulo
        WHERE i.creado_por = $1
        ORDER BY i.id_incidencia DESC;
    `;
    const { rows } = await pool.query(sql, [idEmpleado]);
    return rows;
};