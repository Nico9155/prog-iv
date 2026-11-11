import ArticulosServicio from '../servicios/articulos.js';

export default class ArticulosControlador {

    constructor() {
        this.articulo = new ArticulosServicio();
    }

    buscarPorId = async (req, res) => {
        try {
            const { id_articulo } = req.params;
            const rows = await this.articulo.buscarPorId(id_articulo);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Artículo no encontrado.' });
            }

            return res.status(200).json({
                articulo: rows
            });

        } catch (error) {
            console.error('Error al obtener el Artículo:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    buscarTodos = async (req, res) => {
        try {
            const rows = await this.articulo.buscarTodos();

            return res.status(200).json({ articulos: rows });

        } catch (error) {
            console.error('Error al obtener todos los Artículos:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    buscarAreasActivas = async (req, res) => {
        try {
            const rows = await this.articulo.buscarAreasActivas();
            return res.status(200).json({ areas: rows });
        } catch (error) {
            console.error('Error al obtener las Áreas:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    crear = async (req, res) => {
        try {
            const articulo = {
                id_area: Number(req.body.id_area),
                id_categoria: Number(req.body.id_categoria),
                descripcion: req.body.descripcion.trim()
            };

            const rows = await this.articulo.crear(articulo);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Artículo no creado.' });
            }

            return res.status(201).json({
                mensaje: 'Artículo creado.',
                articulo: rows
            });

        } catch (error) {
            console.error('Error al crear Artículo:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    borrar = async (req, res) => {
        try {
            const { id_articulo } = req.params;
            const rows = await this.articulo.borrar(id_articulo);
            if (rows === null) {
                return res.status(404).json({ mensaje: 'Artículo no encontrado.' });
            }

            return res.status(200).json({ mensaje: 'Artículo eliminado.' });

        } catch (error) {
            console.error('Error al borrar Artículo:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    editar = async (req, res) => {
        try {
            const id_articulo = req.params.id_articulo;
            const articulo = {
                id_area: Number(req.body.id_area),
                id_categoria: Number(req.body.id_categoria),
                descripcion: req.body.descripcion.trim()
            };

            const rows = await this.articulo.editar(id_articulo, articulo);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Artículo no encontrado.' });
            }

            return res.status(200).json({
                mensaje: 'Artículo modificado.',
                articulo: rows
            });

        } catch (error) {
            console.error('Error modificar artículo:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };
}
