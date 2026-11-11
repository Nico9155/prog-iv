import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_INCIDENCIAS = 'http://localhost:3000/api/v1/incidencias';

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
    const usuario = inicializarSesion([2]);
    if (!usuario) return;

    cargarIncidenciasAsignadas();

    const formFinalizar = document.getElementById('formFinalizarIncidencia');
    if (formFinalizar) {
        formFinalizar.addEventListener('submit', confirmarFinalizarIncidencia);
    }
});

async function cargarIncidenciasAsignadas() {
    try {
        const resp = await fetch(`${API_INCIDENCIAS}/mis-incidencias`, {
            headers: obtenerHeadersAuth()
        });
        if (!resp.ok) throw new Error('Error al obtener incidencias asignadas');
        const data = await resp.json();
        renderizarTablaAsignadas(data.incidencias || []);
    } catch (error) {
        console.error('Error al cargar incidencias asignadas:', error);
        alert('No se pudieron cargar las incidencias asignadas.');
    }
}

function renderizarTablaAsignadas(incidencias) {
    const tbody = document.getElementById('tabla-incidencias');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!incidencias || incidencias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No tenés incidencias asignadas a tu cargo.</td></tr>';
        return;
    }

    incidencias.forEach(inc => {
        const row = document.createElement('tr');
        const prioridad = textoPrioridad[inc.prioridad] || inc.prioridad;
        const estado = badgesEstado[inc.id_estado] || inc.estado;

        row.innerHTML = `
            <td>${inc.id_incidencia}</td>
            <td>${inc.creado}</td>
            <td>${inc.articulo_descripcion}</td>
            <td>${inc.descripcion_pedido}</td>
            <td>${prioridad}</td>
            <td>${estado}</td>
        `;

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'text-center';

        const btnFinalizar = document.createElement('button');
        btnFinalizar.textContent = 'Finalizar';

        if (Number(inc.id_estado) <= 2) {
            btnFinalizar.className = 'btn btn-sm btn-success';
            btnFinalizar.setAttribute('data-bs-toggle', 'modal');
            btnFinalizar.setAttribute('data-bs-target', '#modalFinalizarIncidencia');
            btnFinalizar.addEventListener('click', () => {
                document.getElementById('finalizar-incidencia-id').value = inc.id_incidencia;
                document.getElementById('finalizar-resolucion').value = '';
            });
        } else {
            btnFinalizar.className = 'btn btn-sm btn-secondary disabled';
            btnFinalizar.disabled = true;
        }

        tdAcciones.appendChild(btnFinalizar);
        row.appendChild(tdAcciones);

        tbody.appendChild(row);
    });
}

async function confirmarFinalizarIncidencia(event) {
    event.preventDefault();
    const id_incidencia = document.getElementById('finalizar-incidencia-id').value;
    const resolucion = document.getElementById('finalizar-resolucion').value.trim();

    try {
        const resp = await fetch(`${API_INCIDENCIAS}/${id_incidencia}/finalizar`, {
            method: 'PUT',
            headers: obtenerHeadersAuth(),
            body: JSON.stringify({ resolucion })
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.mensaje || resData.error || 'No se pudo finalizar la incidencia.');
        }

        const btnCancelar = document.querySelector('#modalFinalizarIncidencia .btn-secondary');
        if (btnCancelar) btnCancelar.click();

        alert('Incidencia finalizada con éxito.');
        cargarIncidenciasAsignadas();
    } catch (error) {
        alert(`Error al finalizar incidencia: ${error.message}`);
    }
}
