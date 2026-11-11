import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_INFORME = 'http://localhost:3000/api/v1/incidencias/informe';

document.addEventListener("DOMContentLoaded", () => {
    const usuario = inicializarSesion([1]);
    if (!usuario) return;

    const btnGenerar = document.getElementById("btnGenerarReporte");
    if (btnGenerar) {
        btnGenerar.addEventListener("click", generarReportePdf);
    }
});

async function generarReportePdf() {
    try {
        const resp = await fetch(API_INFORME, {
            method: "GET",
            headers: obtenerHeadersAuth()
        });

        if (!resp.ok) {
            throw new Error("No se pudo generar el reporte PDF.");
        }

        const blob = await resp.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
    } catch (error) {
        console.error("Error al generar reporte PDF:", error);
        alert("Ocurrió un error al generar el reporte PDF.");
    }
}
