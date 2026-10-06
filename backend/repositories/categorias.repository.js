// Acceso a datos de Categorías
import { pool } from './database.js';
// 1. Browse (Listar todas las categorías activas)
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

// 2. Read (Obtener categoría por su ID)
export const getCategoriaPorId = async (id) => {
    const sql = `
        SELECT id_categoria, descripcion, activo 
        FROM categorias 
        WHERE id_categoria = $1 AND activo = 1;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null; 
};

// 3. Add (Crear una categoría)
export const createCategoria = async (categoriaData) => {
    const sql = `
        INSERT INTO categorias (descripcion, activo) 
        VALUES ($1, $2) 
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [categoriaData.descripcion, categoriaData.activo]);
    return rows[0]; // Devuelve la categoría recién creada
};

// 4. Edit (Actualizar una categoría existente)
export const updateCategoria = async (id, categoriaData) => {
    const sql = `
        UPDATE categorias 
        SET descripcion = $1 
        WHERE id_categoria = $2 
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [categoriaData.descripcion, id]);
    return rows[0] || null;
};
// 5. Delete (Soft Delete)
export const deleteCategoria = async (id) => {
    const sql = `
        UPDATE categorias 
        SET activo = 0 
        WHERE id_categoria = $1 
        RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null; // 
};