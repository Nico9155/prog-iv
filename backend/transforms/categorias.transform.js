import { CategoriaResponseDto } from '../dtos/categorias/categoria.response.dto.js';

export const categoriasTransform = {
    single: (categoria) => {
        if (!categoria) return null;
        return new CategoriaResponseDto(categoria);
    },

    collection: (categoriasList) => {
        if (!Array.isArray(categoriasList)) return [];
        return categoriasList.map(categoria => new CategoriaResponseDto(categoria));
    }
};
