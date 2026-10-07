import { pool } from './database.js';

// 1Browse (Listar todas las categorías activas)
export const getAllCategorias = async () => {
    const sql = `
        SELECT id_categoria, descripcion, activo 
        FROM categorias 
        WHERE activo = 1 
        ORDER BY id_categoria ASC;
    `;
    const { rows } = await pool.query(sql);
    return rows;
};

// 2 Eead (Obtener categoría por su ID)
export const getCategoriaPorId = async (id) => {
    const sql = `
        SELECT id_categoria, descripcion, activo 
        FROM categorias 
        WHERE id_categoria = $1 AND activo = 1;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
};

// 3. Add (Crear una categoría - Setea activo en 1)
export const createCategoria = async (descripcion) => {
    const sql = `
        INSERT INTO categorias (descripcion, activo) 
        VALUES ($1, 1) 
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [descripcion]);
    return rows[0] || null;
};

// 4. Edit (Actualizar una categoría existente)
export const updateCategoria = async (id, descripcion) => {
    const sql = `
        UPDATE categorias 
        SET descripcion = $1 
        WHERE id_categoria = $2 AND activo = 1
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [descripcion, id]);
    return rows[0] || null;
};

// 5. Delete (Soft Delete)
export const deleteCategoria = async (id) => {
    const sql = `
        UPDATE categorias 
        SET activo = 0 
        WHERE id_categoria = $1 AND activo = 1
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
};