import IncidenciasServicio from '../servicios/incidencias.js';

export default class IncidenciasControlador {

    constructor() {
        this.incidencias = new IncidenciasServicio();
    }

    crear = async (req, res) => {
        try {
            const incidencia = {
                id_articulo: req.body.id_articulo,
                creado_por: req.usuario.id_usuario,
                descripcion_pedido: req.body.descripcion_pedido,
                prioridad: req.body.prioridad
            };

            const rows = await this.incidencias.crear(incidencia);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Incidencia no creada.' });
            }

            return res.status(201).json({
                mensaje: 'Incidencia creada.',
                incidencia: rows
            });

        } catch (error) {
            console.error('Error al crear Incidencia:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    buscarPorIdUsuario = async (req, res) => {
        try {
            let rows = [];

            // ES EMPLEADO MUNICIPAL
            if (req.usuario.rol === 3) {
                rows = await this.incidencias.creadasPorId(req.usuario.id_usuario);
            }

            // ES EMPLEADO ÁREA SISTEMAS
            if (req.usuario.rol === 2) {
                rows = await this.incidencias.asignadasAId(req.usuario.id_usuario);
            }

            if (rows === null) {
                return res.status(200).json({ incidencias: [] });
            }

            return res.status(200).json({
                incidencias: rows
            });

        } catch (error) {
            console.error('Error al obtener incidencias:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    buscarTodas = async (req, res) => {
        try {
            const rows = await this.incidencias.todas();

            if (rows === null) {
                return res.status(200).json({ incidencias: [] });
            }

            return res.status(200).json({
                incidencias: rows
            });

        } catch (error) {
            console.error('Error al obtener todas las incidencias:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    buscarEmpleadosSistemas = async (req, res) => {
        try {
            const rows = await this.incidencias.buscarEmpleadosSistemas();
            return res.status(200).json({ usuarios: rows });
        } catch (error) {
            console.error('Error al obtener empleados de sistemas:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    asignarA = async (req, res) => {
        try {
            const incidencia = {
                id_incidencia: req.params.id_incidencia,
                asignado_a: req.body.asignado_a
            };

            const rows = await this.incidencias.asignarA(incidencia);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Incidencia no asignada.' });
            }

            return res.status(200).json({
                mensaje: 'Incidencia asignada a empleado del área.',
                incidencia: rows
            });

        } catch (error) {
            console.error('Error al asignar Incidencia:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    finalizarIncidencia = async (req, res) => {
        try {
            const incidencia = {
                id_incidencia: req.params.id_incidencia,
                resolucion: req.body.resolucion
            };

            const rows = await this.incidencias.finalizarIncidencia(incidencia);

            if (rows === null) {
                return res.status(404).json({ mensaje: 'Incidencia no finalizada.' });
            }

            return res.status(200).json({
                mensaje: 'Incidencia finalizada.',
                incidencia: rows
            });

        } catch (error) {
            console.error('Error al finalizar Incidencia:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    cancelar = async (req, res) => {
        try {
            const id_incidencia = req.params.id_incidencia;
            const rows = await this.incidencias.cancelarIncidencia(id_incidencia, req.usuario);

            if (rows === null) {
                return res.status(400).json({ mensaje: 'Incidencia no cancelada.' });
            }

            return res.status(200).json({
                mensaje: 'Incidencia cancelada.',
                incidencia: rows
            });

        } catch (error) {
            console.error('Error al cancelar Incidencia:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    generarInforme = async (req, res) => {
        try {
            const { buffer, headers } = await this.incidencias.generarInforme();
            res.set(headers);
            return res.status(200).end(buffer);

        } catch (error) {
            console.error('Error al generar informe de Incidencia:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };

    datosDashboard = async (req, res) => {
        try {
            const rows = await this.incidencias.datosDashboard();

            if (rows === null) {
                return res.status(200).json({ mensaje: 'Sin datos para el dashboard.' });
            }

            return res.status(200).json({
                dashboard: rows
            });

        } catch (error) {
            console.error('Error al obtener datos dashboard:', error.message);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };
}
