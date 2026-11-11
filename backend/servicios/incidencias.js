import IncidenciasDatos from '../datos/incidencias.js';
import ReportesServicio from './reportes.js';

export default class IncidenciasServicio {

    constructor() {
        this.incidencias = new IncidenciasDatos();
        this.reportesServicio = new ReportesServicio();
    }

    crear = (incidencia) => {
        return this.incidencias.crear(incidencia);
    };

    creadasPorId = (creado_por) => {
        return this.incidencias.creadasPorId(creado_por);
    };

    asignadasAId = (asignado_a) => {
        return this.incidencias.asignadasAId(asignado_a);
    };

    todas = () => {
        return this.incidencias.todas();
    };

    buscarEmpleadosSistemas = () => {
        return this.incidencias.buscarEmpleadosSistemas();
    };

    asignarA = (incidencia) => {
        return this.incidencias.asignarA(incidencia);
    };

    finalizarIncidencia = async (incidencia) => {
        return await this.incidencias.finalizarIncidencia(incidencia);
    };

    cancelarIncidencia = async (id_incidencia, usuario) => {
        return await this.incidencias.cancelarIncidencia(id_incidencia, usuario);
    };

    generarInforme = async () => {
        const datosReporte = await this.incidencias.datosInforme();
        const pdf = await this.reportesServicio.informeIncidenciasPdf(datosReporte);

        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="incidencias.pdf"'
            }
        };
    };

    datosDashboard = () => {
        return this.incidencias.datosDashboard();
    };
}
