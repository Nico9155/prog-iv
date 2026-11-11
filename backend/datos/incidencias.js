import { pool } from '../config/db.js';

export default class IncidenciasDatos {

    todas = async () => {
        const sql = `SELECT i.id_incidencia, 
                            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creado,
                            i.descripcion_pedido, 
                            i.descripcion_resolucion, 
                            i.prioridad,
                            a.descripcion articulo_descripcion, 
                            c.descripcion categoria, 
                            concat(u.apellidos, ' ', u.nombres) asignado_a,
                            i.asignado_a id_asignado_a,
                            e.descripcion estado,
                            e.id_estado
                     FROM incidencias i 
                     INNER JOIN articulos a ON a.id_articulo = i.id_articulo 
                     INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                     INNER JOIN usuarios u ON u.id_usuario = i.asignado_a
                     INNER JOIN estados e ON e.id_estado = i.id_estado
                     ORDER BY i.id_incidencia DESC`;

        const { rowCount, rows } = await pool.query(sql);

        if (rowCount === 0) {
            return null;
        }
        return rows;
    };

    buscarEmpleadosSistemas = async () => {
        const sql = `SELECT id_usuario, nombres, apellidos, usuario
                     FROM usuarios
                     WHERE activo = 1 AND rol = 2
                     ORDER BY apellidos ASC, nombres ASC`;

        const { rowCount, rows } = await pool.query(sql);
        return rowCount === 0 ? [] : rows;
    };

    // CREAR INCIDENCIA Y REGISTRAR EL ESTADO INICIAL EN incidencias_estados
    crear = async (incidencia) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { id_articulo, creado_por, descripcion_pedido, prioridad } = incidencia;

            const sql = `INSERT INTO incidencias 
                         (id_articulo, id_estado, creado_por, asignado_a, descripcion_pedido, prioridad) 
                         VALUES ($1, 1, $2, 1, $3, $4)
                         RETURNING *;`;

            const { rowCount, rows } = await client.query(sql, [id_articulo, creado_por, descripcion_pedido, prioridad]);

            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const sql_insert = `INSERT INTO incidencias_estados (id_incidencia, id_estado)
                                VALUES ($1, 1)`;
            await client.query(sql_insert, [rows[0].id_incidencia]);

            await client.query('COMMIT');
            return rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en la transacción de creación: ', error);
            throw error;
        } finally {
            client.release();
        }
    };

    // ASIGNAR INCIDENCIA A EMPLEADO DE SISTEMAS
    asignarA = async (incidencia) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { id_incidencia, asignado_a } = incidencia;

            const sql = `UPDATE incidencias  
                         SET asignado_a = $1, id_estado = 2
                         WHERE id_incidencia = $2
                         RETURNING *;`;

            const { rowCount, rows } = await client.query(sql, [asignado_a, id_incidencia]);
            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const sql_insert = `INSERT INTO incidencias_estados (id_incidencia, id_estado)
                                VALUES ($1, 2)`;
            await client.query(sql_insert, [id_incidencia]);

            await client.query('COMMIT');

            return rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en la transacción de asignación: ', error);
            throw error;
        } finally {
            client.release();
        }
    };

    // FINALIZAR INCIDENCIA Y REGISTRAR NUEVO ESTADO EN EL HISTORIAL
    finalizarIncidencia = async (incidencia) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { id_incidencia, resolucion } = incidencia;

            const sql = `UPDATE incidencias  
                         SET id_estado = 3, descripcion_resolucion = $1
                         WHERE id_incidencia = $2
                         RETURNING *;`;

            const { rowCount, rows } = await client.query(sql, [resolucion, id_incidencia]);
            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const sql_insert = `INSERT INTO incidencias_estados (id_incidencia, id_estado)
                                VALUES ($1, 3)`;
            await client.query(sql_insert, [id_incidencia]);

            await client.query('COMMIT');

            return rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en la transacción de finalización: ', error);
            throw error;
        } finally {
            client.release();
        }
    };

    // CANCELAR INCIDENCIA Y REGISTRAR EL NUEVO ESTADO EN EL HISTORIAL
    cancelarIncidencia = async (id_incidencia, usuario) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            let sql = `UPDATE incidencias  
                       SET id_estado = 4
                       WHERE id_incidencia = $1 AND id_estado = 1
                       RETURNING *;`;
            let params = [id_incidencia];

            if (usuario && usuario.rol === 3) {
                sql = `UPDATE incidencias  
                       SET id_estado = 4
                       WHERE id_incidencia = $1 AND id_estado = 1 AND creado_por = $2
                       RETURNING *;`;
                params = [id_incidencia, usuario.id_usuario];
            }

            const { rowCount, rows } = await client.query(sql, params);
            if (rowCount === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const sql_insert = `INSERT INTO incidencias_estados (id_incidencia, id_estado)
                                VALUES ($1, 4)`;
            await client.query(sql_insert, [id_incidencia]);

            await client.query('COMMIT');

            return rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en la transacción de cancelación: ', error);
            throw error;
        } finally {
            client.release();
        }
    };

    // INCIDENCIAS CREADAS POR UN EMPLEADO MUNICIPAL
    creadasPorId = async (creado_por) => {
        const sql = `SELECT i.id_incidencia, 
                            i.descripcion_pedido, 
                            i.descripcion_resolucion, 
                            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creado,
                            a.descripcion articulo_descripcion, 
                            i.prioridad, 
                            c.descripcion categoria, 
                            concat(u.apellidos, ' ', u.nombres) asignado_a, 
                            e.descripcion estado,
                            i.id_estado 
                     FROM incidencias i 
                     INNER JOIN articulos a ON a.id_articulo = i.id_articulo 
                     INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                     INNER JOIN usuarios u ON u.id_usuario = i.creado_por 
                     INNER JOIN estados e ON e.id_estado = i.id_estado 
                     WHERE i.creado_por = $1
                     ORDER BY i.id_incidencia DESC`;

        const { rowCount, rows } = await pool.query(sql, [creado_por]);

        if (rowCount === 0) {
            return null;
        }
        return rows;
    };

    // INCIDENCIAS ASIGNADAS A UN EMPLEADO ÁREA SISTEMAS
    asignadasAId = async (asignado_a) => {
        const sql = `SELECT i.id_incidencia,
                            i.descripcion_pedido,
                            i.descripcion_resolucion,
                            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creado,
                            a.descripcion articulo_descripcion,
                            i.prioridad,
                            c.descripcion categoria,
                            concat(u.apellidos, ' ', u.nombres) asignado_a, 
                            e.descripcion estado,
                            i.id_estado 
                     FROM incidencias i 
                     INNER JOIN articulos a ON a.id_articulo = i.id_articulo 
                     INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                     INNER JOIN usuarios u ON u.id_usuario = i.asignado_a 
                     INNER JOIN estados e ON e.id_estado = i.id_estado 
                     WHERE i.asignado_a = $1
                     ORDER BY i.id_incidencia DESC`;

        const { rowCount, rows } = await pool.query(sql, [asignado_a]);

        if (rowCount === 0) {
            return null;
        }
        return rows;
    };

    datosInforme = async () => {
        const sql = `SELECT i.id_incidencia, 
                            to_char(i.creado, 'DD-MM-YYYY HH24:MI') creada,
                            a.descripcion articulo,
                            i.descripcion_pedido,
                            concat(u.apellidos, ' ', u.nombres) asignada_a, 
                            e.descripcion estado
                     FROM incidencias i 
                     INNER JOIN articulos a ON a.id_articulo = i.id_articulo 
                     INNER JOIN usuarios u ON u.id_usuario = i.asignado_a
                     INNER JOIN estados e ON e.id_estado = i.id_estado
                     ORDER BY i.id_incidencia DESC`;

        const { rowCount, rows } = await pool.query(sql);

        if (rowCount === 0) {
            return null;
        }
        return rows;
    };

    datosDashboard = async () => {
        const sqlEstados = `SELECT e.descripcion AS estado, COUNT(i.id_incidencia) AS cantidad
                            FROM estados e
                            LEFT JOIN incidencias i ON i.id_estado = e.id_estado
                            WHERE e.activo = 1
                            GROUP BY e.id_estado, e.descripcion
                            ORDER BY e.id_estado ASC;`;

        const sqlFechas = `SELECT to_char(i.creado, 'DD-MM-YYYY') AS fecha, COUNT(*) AS cantidad
                           FROM incidencias i
                           GROUP BY to_char(i.creado, 'DD-MM-YYYY')
                           ORDER BY MIN(i.creado) DESC;`;

        const sqlPrioritarias = `SELECT i.id_incidencia,
                                        i.descripcion_pedido,
                                        a.descripcion AS articulo,
                                        concat(u.apellidos, ' ', u.nombres) AS empleado,
                                        e.descripcion AS estado
                                 FROM incidencias i
                                 INNER JOIN articulos a ON a.id_articulo = i.id_articulo
                                 INNER JOIN usuarios u ON u.id_usuario = i.asignado_a
                                 INNER JOIN estados e ON e.id_estado = i.id_estado
                                 WHERE i.prioridad = 3 OR i.id_estado = 1
                                 ORDER BY i.prioridad DESC;`;

        const resEstados = await pool.query(sqlEstados);
        const resFechas = await pool.query(sqlFechas);
        const resPrioritarias = await pool.query(sqlPrioritarias);

        return {
            porEstado: resEstados.rows,
            porFecha: resFechas.rows,
            prioritarias: resPrioritarias.rows
        };
    };
}
