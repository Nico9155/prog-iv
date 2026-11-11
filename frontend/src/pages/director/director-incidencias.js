import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_INCIDENCIAS = 'http://localhost:3000/api/v1/incidencias';
const API_TECNICOS = 'http://localhost:3000/api/v1/incidencias/tecnicos';

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
    const usuario = inicializarSesion([1]);
    if (!usuario) return;

    await cargarEmpleadosSistemas();
    await cargarTodasLasIncidencias();

    const formAsignar = document.getElementById('formAsignarIncidencia');
    if (formAsignar) {
        formAsignar.addEventListener('submit', confirmarAsignacion);
    }
});

async function cargarEmpleadosSistemas() {
    try {
        const resp = await fetch(API_TECNICOS, { headers: obtenerHeadersAuth() });
        if (!resp.ok) return;
        const data = await resp.json();
        const empleados = data.usuarios || [];

        const select = document.getElementById('select-empleado-sistemas');
        if (!select) return;
        select.innerHTML = '<option value="" disabled selected>Seleccione un técnico...</option>';

        empleados.forEach(emp => {
            const opt = document.createElement('option');
            opt.value = emp.id_usuario;
            opt.textContent = `${emp.apellidos}, ${emp.nombres} (${emp.usuario})`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Error al cargar empleados de sistemas:', error);
    }
}

async function cargarTodasLasIncidencias() {
    try {
        const resp = await fetch(API_INCIDENCIAS, { headers: obtenerHeadersAuth() });
        if (!resp.ok) throw new Error('Error al obtener incidencias');
        const data = await resp.json();
        renderizarTablaDirector(data.incidencias || []);
    } catch (error) {
        console.error('Error al cargar incidencias:', error);
        alert('No se pudieron cargar las incidencias.');
    }
}

function renderizarTablaDirector(incidencias) {
    const tbody = document.getElementById('tabla-incidencias');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!incidencias || incidencias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay incidencias registradas.</td></tr>';
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
            <td>${inc.asignado_a}</td>
            <td>${prioridad}</td>
            <td>${estado}</td>
        `;

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'text-center';

        // Botón Asignar (habilitado si no está finalizada ni cancelada)
        const btnAsignar = document.createElement('button');
        btnAsignar.textContent = 'Asignar';
        if (Number(inc.id_estado) <= 2) {
            btnAsignar.className = 'btn btn-sm btn-outline-primary me-1';
            btnAsignar.setAttribute('data-bs-toggle', 'modal');
            btnAsignar.setAttribute('data-bs-target', '#modalAsignarIncidencia');
            btnAsignar.addEventListener('click', () => {
                document.getElementById('asignar-incidencia-id').value = inc.id_incidencia;
                if (inc.id_asignado_a) {
                    document.getElementById('select-empleado-sistemas').value = inc.id_asignado_a;
                }
            });
        } else {
            btnAsignar.className = 'btn btn-sm btn-secondary disabled me-1';
            btnAsignar.disabled = true;
        }
        tdAcciones.appendChild(btnAsignar);

        // Botón Cancelar (solo habilitado si está en estado 1 = Pendiente)
        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';
        if (Number(inc.id_estado) === 1) {
            btnCancelar.className = 'btn btn-sm btn-outline-danger';
            btnCancelar.addEventListener('click', () => cancelarIncidenciaDirector(inc.id_incidencia));
        } else {
            btnCancelar.className = 'btn btn-sm btn-secondary disabled';
            btnCancelar.disabled = true;
        }
        tdAcciones.appendChild(btnCancelar);

        row.appendChild(tdAcciones);
        tbody.appendChild(row);
    });
}

async function confirmarAsignacion(event) {
    event.preventDefault();
    const id_incidencia = document.getElementById('asignar-incidencia-id').value;
    const asignado_a = Number(document.getElementById('select-empleado-sistemas').value);

    try {
        const resp = await fetch(`${API_INCIDENCIAS}/${id_incidencia}/asignar`, {
            method: 'PUT',
            headers: obtenerHeadersAuth(),
            body: JSON.stringify({ asignado_a })
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.mensaje || resData.error || 'No se pudo asignar la incidencia.');
        }

        const btnCerrar = document.querySelector('#modalAsignarIncidencia .btn-secondary');
        if (btnCerrar) btnCerrar.click();

        alert('Incidencia asignada con éxito.');
        cargarTodasLasIncidencias();
    } catch (error) {
        alert(`Error al asignar: ${error.message}`);
    }
}

async function cancelarIncidenciaDirector(id_incidencia) {
    if (!confirm(`¿Está seguro de cancelar la incidencia #${id_incidencia}?`)) return;

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
        cargarTodasLasIncidencias();
    } catch (error) {
        alert(`Error al cancelar: ${error.message}`);
    }
}
