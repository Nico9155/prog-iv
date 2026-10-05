import { renderizarTablaIncidencias } from '../../js/incidencias';

const badgesEstado = {
    1: '<span class="badge bg-warning text-dark">Pendiente</span>',
    2: '<span class="badge bg-primary">En Proceso</span>',
    3: '<span class="badge bg-success">Resuelta</span>',
    4: '<span class="badge bg-secondary">Cancelada</span>'
};

const textoPrioridad = {
    1: 'Baja',
    2: 'Media',
    3: 'Alta'
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        reiniciarModales();
        renderizarTablaIncidencias(incidencias);
    }
    catch (error) {
        console.log("Ha ocurrido un error al procesar la página: \n" + error)
    }
});

function reiniciarModales() {
    const modalIncidencias = document.getElementById('modalNuevaIncidencia');
        const formIncidencias = document.getElementById('formNuevaIncidencia');
        const modalSeleccionarArticulo = document.getElementById('modalSeleccionarArticulo');
        const formSeleccionarArticulo = document.getElementById('incidencia-articulo')

        modalIncidencias.addEventListener('hidden.bs.modal', () => {
            formIncidencias.reset();
        });
        modalArticulo.addEventListener('show.bs.modal', () => {
            selectArticulo.value = "";
        });
}

