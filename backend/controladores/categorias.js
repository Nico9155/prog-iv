import CategoriasServicio from '../servicios/categorias.js';

export default class CategoriasControlador {

    constructor() {
        this.categoria = new CategoriasServicio();
    }

    buscarPorId = async (req, res) => {
        try {
            const { id_categoria } = req.params;
            const rows = await this.categoria.buscarPorId(id_categoria);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada.' });
            }

            return res.status(200).json({
                categoria: rows
            });

        } catch (error) {
            console.error('Error al obtener la categoría:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    buscarTodos = async (req, res) => {
        try {
            const rows = await this.categoria.buscarTodos();

            return res.status(200).json({ categoria: rows });

        } catch (error) {
            console.error('Error al obtener todas las categorías:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    crear = async (req, res) => {
        try {
            const categoria = { descripcion: req.body.descripcion.trim() };

            const rows = await this.categoria.crear(categoria);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Categoría no creada.' });
            }

            return res.status(201).json({
                mensaje: 'Categoría creada.',
                categoria: rows
            });

        } catch (error) {
            console.error('Error al crear categoría:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    borrar = async (req, res) => {
        try {
            const { id_categoria } = req.params;
            const rows = await this.categoria.borrar(id_categoria);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada.' });
            }

            return res.status(200).json({ mensaje: 'Categoría eliminada.' });

        } catch (error) {
            console.error('Error al borrar categoría:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    editar = async (req, res) => {
        try {
            const categoria = {
                id_categoria: req.params.id_categoria,
                descripcion: req.body.descripcion.trim()
            };

            const rows = await this.categoria.editar(categoria);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada.' });
            }

            return res.status(200).json({
                mensaje: 'Categoría modificada.',
                categoria: rows
            });

        } catch (error) {
            console.error('Error modificar categoría:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };
}
