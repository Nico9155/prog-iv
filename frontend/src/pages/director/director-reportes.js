// Traer la fecha de la primer incidencia y que este sea el mínimo

// Control de fecha en director-reportes
document.addEventListener("DOMContentLoaded", () => {
    try {
        const fechaDesde = document.getElementById("fecha-desde");
        const fechaHasta = document.getElementById("fecha-hasta");

        controlarFechas(fechaDesde, fechaHasta);
    } catch (error) {
        console.log("Ha ocurrido un error al procesar la página: \n" + error)
    }
});

function controlarFechas(fechaDesde, fechaHasta) {
    // Fecha de hoy (YYYY-MM-DD)
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaHoyFormateada = `${año}-${mes}-${dia}`;

    // Bloquear fechas futuras para ambos campos
    fechaDesde.max = fechaHoyFormateada;
    fechaHasta.max = fechaHoyFormateada;

    // Al cambiar "Fecha desde", actualiza el mínimo permitido en "Fecha hasta"
    fechaDesde.addEventListener("change", () => {
        fechaHasta.min = fechaDesde.value;
    });

    // Al cambiar "Fecha hasta", actualiza el máximo permitido en "Fecha desde"
    fechaDesde.addEventListener("change", () => {
        if (fechaDesde.value) {
            fechaHasta.min = fechaDesde.value;
        }
    });

    fechaHasta.addEventListener("change", () => {
        if (fechaHasta.value) {
            fechaDesde.max = fechaHasta.value;
        } else {
            // Si limpian "Fecha hasta", el tope vuelve a ser el día de hoy
            fechaDesde.max = fechaHoyFormateada;
        }
    });
}