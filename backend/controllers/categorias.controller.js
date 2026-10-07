// Controlador de Categorías
import { categoriasService } from '../services/categorias.service.js';

export const categoriasController = {
    browse: async (req, res) => {
        try {
            const categorias = await categoriasService.obtenerTodas();
            return res.status(200).json(categorias);
        } catch (error) {
            console.error("Error en categoriasController.browse:", error);
            return res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
        }
    },

    read: async (req, res) => {
        try {
            const { id } = req.params;
            const categoria = await categoriasService.obtenerPorId(id);

            if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada o inactiva.' });
            }

            return res.status(200).json(categoria);
        } catch (error) {
            console.error("Error en categoriasController.read:", error);
            return res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
        }
    },

    add: async (req, res) => {
        try {
            const { descripcion } = req.body;
            
            const nuevaCategoria = await categoriasService.crear(descripcion);
            return res.status(201).json(nuevaCategoria);
        } catch (error) {
            console.error("Error en categoriasController.add:", error);
            return res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
        }
    },

    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const { descripcion } = req.body;

            const categoriaActualizada = await categoriasService.actualizar(id, descripcion);

            if (!categoriaActualizada) {
                return res.status(404).json({ error: 'Categoría no encontrada o inactiva.' });
            }

            return res.status(200).json(categoriaActualizada);
        } catch (error) {
            console.error("Error en categoriasController.edit:", error);
            return res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const exito = await categoriasService.eliminar(id);

            if (!exito) {
                return res.status(404).json({ error: 'Categoría no encontrada o ya eliminada.' });
            }

            return res.status(200).json({ message: 'Categoría eliminada con éxito.' });
        } catch (error) {
            console.error("Error en categoriasController.delete:", error);
            return res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
        }
    }
};
