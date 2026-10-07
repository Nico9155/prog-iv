import * as categoriasRepository from '../repositories/categorias.repository.js';
import { categoriasTransform } from '../transforms/categorias.transform.js';

export const categoriasService = {
    obtenerTodas: async () => {
        const categorias = await categoriasRepository.getAllCategorias();
        return categoriasTransform.collection(categorias);
    },

    obtenerPorId: async (id) => {
        const categoria = await categoriasRepository.getCategoriaPorId(id);
        return categoriasTransform.single(categoria);
    },

    crear: async (descripcion) => {
        const nuevaCategoria = await categoriasRepository.createCategoria(descripcion);
        return categoriasTransform.single(nuevaCategoria);
    },

    actualizar: async (id, descripcion) => {
        const categoriaActualizada = await categoriasRepository.updateCategoria(id, descripcion);
        return categoriasTransform.single(categoriaActualizada);
    },

    eliminar: async (id) => {
        const categoriaEliminada = await categoriasRepository.deleteCategoria(id);
        return categoriaEliminada !== null;
    }
};
