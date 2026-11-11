import { pool } from '../config/db.js';

export default class ArticulosDatos {

    buscarPorId = async (id_articulo) => {
        const sql = `SELECT a.id_articulo, a.id_area, a.id_categoria, a.descripcion,
                            aa.descripcion AS area, c.descripcion AS categoria
                     FROM articulos a
                     INNER JOIN areas aa ON aa.id_area = a.id_area
                     INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                     WHERE a.activo = 1 AND a.id_articulo = $1
                     ORDER BY a.id_articulo ASC;`;

        const { rowCount, rows } = await pool.query(sql, [id_articulo]);

        if (rowCount === 0) {
            return null;
        }
        return rows[0];
    };

    buscarTodos = async () => {
        const sql = `SELECT a.id_articulo, a.id_area, a.id_categoria, a.descripcion,
                            aa.descripcion AS area, c.descripcion AS categoria
                     FROM articulos a
                     INNER JOIN areas aa ON aa.id_area = a.id_area
                     INNER JOIN categorias c ON c.id_categoria = a.id_categoria
                     WHERE a.activo = 1 
                     ORDER BY a.id_articulo ASC;`;

        const { rowCount, rows } = await pool.query(sql);

        if (rowCount === 0) {
            return [];
        }
        return rows;
    };

    buscarAreasActivas = async () => {
        const sql = `SELECT id_area, descripcion
                     FROM areas
                     WHERE activo = 1
                     ORDER BY id_area ASC;`;

        const { rowCount, rows } = await pool.query(sql);
        if (rowCount === 0) {
            return [];
        }
        return rows;
    };

    crear = async (articulo) => {
        const { id_area, id_categoria, descripcion } = articulo;

        const sql = `INSERT INTO articulos (id_area, id_categoria, descripcion, activo) 
                     VALUES ($1, $2, $3, 1)
                     RETURNING *;`;

        const result = await pool.query(sql, [id_area, id_categoria, descripcion]);

        if (result.rowCount === 0) {
            return null;
        }
        return result.rows[0];
    };

    borrar = async (id_articulo) => {
        const sql = `UPDATE articulos
                     SET activo = 0 
                     WHERE id_articulo = $1 AND activo = 1
                     RETURNING *;`;

        const result = await pool.query(sql, [id_articulo]);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    };

    editar = async (id_articulo, articulo) => {
        const { id_area, id_categoria, descripcion } = articulo;

        const sql = `UPDATE articulos 
                     SET id_area = $1, id_categoria = $2, descripcion = $3
                     WHERE id_articulo = $4 AND activo = 1
                     RETURNING *;`;

        const result = await pool.query(sql, [id_area, id_categoria, descripcion, id_articulo]);

        if (result.rowCount === 0) {
            return null;
        }
        return result.rows[0];
    };
}
