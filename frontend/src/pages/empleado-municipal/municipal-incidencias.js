import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_INCIDENCIAS = 'http://localhost:3000/api/v1/incidencias';
const API_ARTICULOS = 'http://localhost:3000/api/v1/articulos';

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

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = inicializarSesion([3]);
    if (!usuario) return;

    await cargarSelectArticulos();
    await cargarMisIncidencias();

    const formNueva = document.getElementById('formNuevaIncidencia');
    if (formNueva) {
        formNueva.addEventListener('submit', crearIncidencia);
    }
});

async function cargarSelectArticulos() {
    try {
        const resp = await fetch(API_ARTICULOS, { headers: obtenerHeadersAuth() });
        if (!resp.ok) return;
        const data = await resp.json();
        const articulos = data.articulos || [];

        const select = document.getElementById('incidencia-articulo-id');
        if (!select) return;
        select.innerHTML = '<option value="" disabled selected>Selecciona un artículo</option>';

        articulos.forEach(art => {
            const opt = document.createElement('option');
            opt.value = art.id_articulo;
            opt.textContent = `#${art.id_articulo} - ${art.descripcion} (${art.categoria || ''})`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Error al cargar artículos en el select:', error);
    }
}

async function cargarMisIncidencias() {
    try {
        const resp = await fetch(`${API_INCIDENCIAS}/mis-incidencias`, {
            headers: obtenerHeadersAuth()
        });
        if (!resp.ok) throw new Error('Error al obtener incidencias');
        const data = await resp.json();
        renderizarTablaMisIncidencias(data.incidencias || []);
    } catch (error) {
        console.error('Error al cargar incidencias:', error);
        alert('No se pudieron cargar tus incidencias.');
    }
}

function renderizarTablaMisIncidencias(incidencias) {
    const tbody = document.getElementById('tabla-incidencias');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!incidencias || incidencias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No tenés incidencias registradas.</td></tr>';
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

        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';

        if (Number(inc.id_estado) === 1) {
            btnCancelar.className = 'btn btn-sm btn-outline-danger';
            btnCancelar.addEventListener('click', () => cancelarIncidencia(inc.id_incidencia));
        } else {
            btnCancelar.className = 'btn btn-sm btn-secondary disabled';
            btnCancelar.disabled = true;
        }

        tdAcciones.appendChild(btnCancelar);
        row.appendChild(tdAcciones);

        tbody.appendChild(row);
    });
}

async function crearIncidencia(event) {
    event.preventDefault();
    const id_articulo = Number(document.getElementById('incidencia-articulo-id').value);
    const descripcion_pedido = document.getElementById('incidencia-detalle').value.trim();
    const prioridad = Number(document.getElementById('incidencia-prioridad').value);

    try {
        const resp = await fetch(API_INCIDENCIAS, {
            method: 'POST',
            headers: obtenerHeadersAuth(),
            body: JSON.stringify({ id_articulo, descripcion_pedido, prioridad })
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.error || resData.mensaje || 'No se pudo crear la incidencia.');
        }

        document.getElementById('formNuevaIncidencia').reset();
        const btnCerrar = document.querySelector('#modalNuevaIncidencia .btn-secondary');
        if (btnCerrar) btnCerrar.click();

        alert('Incidencia registrada con éxito.');
        cargarMisIncidencias();
    } catch (error) {
        alert(`Error al crear incidencia: ${error.message}`);
    }
}

async function cancelarIncidencia(id_incidencia) {
    if (!confirm(`¿Está seguro de que desea cancelar la incidencia #${id_incidencia}?`)) return;

    try {
        const resp = await fetch(`${API_INCIDENCIAS}/${id_incidencia}/cancelar`, {
            method: 'PUT',
            headers: obtenerHeadersAuth()
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.mensaje || resData.error || 'No se pudo cancelar la incidencia.');
        }

        alert('Incidencia cancelada correctamente.');
        cargarMisIncidencias();
    } catch (error) {
        alert(`Error al cancelar: ${error.message}`);
    }
}
