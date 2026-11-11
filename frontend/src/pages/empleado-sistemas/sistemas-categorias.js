import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_URL = 'http://localhost:3000/api/v1/categorias';

document.addEventListener('DOMContentLoaded', () => {
    const usuario = inicializarSesion([2]);
    if (!usuario) return;

    cargarCategorias();

    const formNueva = document.getElementById('formNuevaCategoria');
    if (formNueva) {
        formNueva.addEventListener('submit', agregarCategoria);
    }

    const formEditar = document.getElementById('formEditarCategoria');
    if (formEditar) {
        formEditar.addEventListener('submit', guardarEdicionCategoria);
    }

    const formBuscar = document.getElementById('formBuscarCategoria');
    if (formBuscar) {
        formBuscar.addEventListener('submit', buscarCategoria);
    }
});

async function cargarCategorias() {
    try {
        const respuesta = await fetch(API_URL, {
            headers: obtenerHeadersAuth()
        });
        if (!respuesta.ok) throw new Error('Error al conectar con la API de la municipalidad');

        const data = await respuesta.json();
        const categorias = data.categoria || [];
        renderizarTablaCategorias(categorias);
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        alert('No se pudieron obtener las categorías desde el servidor.');
    }
}

function renderizarTablaCategorias(categorias) {
    const tbody = document.getElementById('tabla-categorias');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!categorias || categorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay categorías activas registradas.</td></tr>';
        return;
    }

    categorias.forEach(cat => {
        const idCat = cat.id_categoria;
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${idCat}</td>
            <td>${cat.descripcion}</td>
        `;

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'text-center';

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-sm btn-outline-primary me-2';
        btnEdit.textContent = 'Editar';
        btnEdit.setAttribute('data-bs-toggle', 'modal');
        btnEdit.setAttribute('data-bs-target', '#modalEditarCategoria');
        btnEdit.addEventListener('click', () => prepararModalEdicion(idCat, cat.descripcion));
        tdAcciones.appendChild(btnEdit);

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-sm btn-outline-danger';
        btnDelete.textContent = 'Eliminar';
        btnDelete.addEventListener('click', () => eliminarCategoria(idCat));
        tdAcciones.appendChild(btnDelete);

        row.appendChild(tdAcciones);
        tbody.appendChild(row);
    });
}

async function agregarCategoria(event) {
    event.preventDefault();
    const inputDesc = document.getElementById('categoria-descripcion');
    if (!inputDesc) return;

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: obtenerHeadersAuth(),
            body: JSON.stringify({ descripcion: inputDesc.value })
        });

        const resData = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resData.error || resData.mensaje || 'Fallo en la creación.');
        }

        inputDesc.value = '';

        const btnCancelar = document.querySelector('#modalNuevaCategoria .btn-secondary');
        if (btnCancelar) btnCancelar.click();

        alert('Categoría registrada con éxito.');
        cargarCategorias();
    } catch (error) {
        alert(`Error al registrar: ${error.message}`);
    }
}

function prepararModalEdicion(id, descripcion) {
    document.getElementById('edit-categoria-id').value = id;
    document.getElementById('edit-categoria-descripcion').value = descripcion;
}

async function guardarEdicionCategoria(event) {
    event.preventDefault();
    const id = document.getElementById('edit-categoria-id').value;
    const descripcion = document.getElementById('edit-categoria-descripcion').value;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: obtenerHeadersAuth(),
            body: JSON.stringify({ descripcion })
        });

        const resData = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resData.error || resData.mensaje || 'Fallo al actualizar.');
        }

        const btnCancelar = document.querySelector('#modalEditarCategoria .btn-secondary');
        if (btnCancelar) btnCancelar.click();

        alert('Categoría modificada con éxito.');
        cargarCategorias();
    } catch (error) {
        alert(`Error al modificar: ${error.message}`);
    }
}

async function eliminarCategoria(id) {
    if (!confirm('¿Está seguro de que desea dar de baja esta categoría del sistema municipal?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: obtenerHeadersAuth()
        });

        const resData = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resData.error || resData.mensaje || 'Fallo en la eliminación.');
        }

        alert('Categoría dada de baja correctamente.');
        cargarCategorias();
    } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
    }
}

async function buscarCategoria(event) {
    event.preventDefault();
    const id = document.getElementById('buscar-categoria-id').value;
    const contenedorResultado = document.getElementById('resultado-busqueda');
    const contenedorError = document.getElementById('error-busqueda');

    contenedorResultado.classList.add('d-none');
    contenedorError.classList.add('d-none');

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            headers: obtenerHeadersAuth()
        });

        const resData = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resData.mensaje || resData.error || 'No se pudo procesar la búsqueda.');
        }

        const categoria = resData.categoria;

        document.getElementById('res-categoria-id').textContent = categoria.id_categoria;
        document.getElementById('res-categoria-descripcion').textContent = categoria.descripcion;

        contenedorResultado.classList.remove('d-none');
    } catch (error) {
        contenedorError.textContent = error.message;
        contenedorError.classList.remove('d-none');
    }
}
