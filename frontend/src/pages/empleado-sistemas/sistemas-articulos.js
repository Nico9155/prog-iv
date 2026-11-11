import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_ARTICULOS = 'http://localhost:3000/api/v1/articulos';
const API_CATEGORIAS = 'http://localhost:3000/api/v1/categorias';

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = inicializarSesion([2]);
    if (!usuario) return;

    await cargarSelectCategorias();
    await cargarSelectAreas();
    await cargarArticulos();

    const formNuevo = document.getElementById('formNuevoArticulo');
    if (formNuevo) {
        formNuevo.addEventListener('submit', agregarArticulo);
    }

    const formEditar = document.getElementById('formEditarArticulo');
    if (formEditar) {
        formEditar.addEventListener('submit', guardarEdicionArticulo);
    }

    const formBuscar = document.getElementById('formBuscarArticulo');
    if (formBuscar) {
        formBuscar.addEventListener('submit', buscarArticulo);
    }
});

async function cargarSelectCategorias() {
    try {
        const resp = await fetch(API_CATEGORIAS, { headers: obtenerHeadersAuth() });
        if (!resp.ok) return;
        const data = await resp.json();
        const categorias = data.categoria || [];

        const selects = [
            document.getElementById('articulo-categoria-id'),
            document.getElementById('edit-articulo-categoria-id')
        ];

        selects.forEach(select => {
            if (!select) return;
            select.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
            categorias.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id_categoria;
                opt.textContent = `${cat.id_categoria} - ${cat.descripcion}`;
                select.appendChild(opt);
            });
        });
    } catch (err) {
        console.error('Error al cargar categorías para select:', err);
    }
}

async function cargarSelectAreas() {
    try {
        const resp = await fetch(`${API_ARTICULOS}/areas`, { headers: obtenerHeadersAuth() });
        if (!resp.ok) return;
        const data = await resp.json();
        const areas = data.areas || [];

        const selects = [
            document.getElementById('articulo-area'),
            document.getElementById('edit-articulo-area')
        ];

        selects.forEach(select => {
            if (!select) return;
            select.innerHTML = '<option value="" disabled selected>Selecciona un área</option>';
            areas.forEach(area => {
                const opt = document.createElement('option');
                opt.value = area.id_area;
                opt.textContent = `${area.id_area} - ${area.descripcion}`;
                select.appendChild(opt);
            });
        });
    } catch (err) {
        console.error('Error al cargar áreas para select:', err);
    }
}

async function cargarArticulos() {
    try {
        const resp = await fetch(API_ARTICULOS, { headers: obtenerHeadersAuth() });
        if (!resp.ok) throw new Error('Error al obtener artículos');
        const data = await resp.json();
        const articulos = data.articulos || [];
        renderizarTablaArticulosSistemas(articulos);
    } catch (error) {
        console.error('Error al cargar artículos:', error);
        alert('No se pudieron obtener los artículos desde el servidor.');
    }
}

function renderizarTablaArticulosSistemas(articulos) {
    const tbody = document.getElementById('tabla-articulos');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!articulos || articulos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay artículos activos registrados.</td></tr>';
        return;
    }

    articulos.forEach(art => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${art.id_articulo}</td>
            <td>${art.area || art.id_area}</td>
            <td>${art.categoria || art.id_categoria}</td>
            <td>${art.descripcion}</td>
        `;

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'text-center';

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-sm btn-outline-primary me-2';
        btnEdit.textContent = 'Editar';
        btnEdit.setAttribute('data-bs-toggle', 'modal');
        btnEdit.setAttribute('data-bs-target', '#modalEditarArticulo');
        btnEdit.addEventListener('click', () => prepararModalEdicion(art));
        tdAcciones.appendChild(btnEdit);

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-sm btn-outline-danger';
        btnDelete.textContent = 'Eliminar';
        btnDelete.addEventListener('click', () => eliminarArticulo(art.id_articulo));
        tdAcciones.appendChild(btnDelete);

        row.appendChild(tdAcciones);
        tbody.appendChild(row);
    });
}

async function agregarArticulo(event) {
    event.preventDefault();
    const descripcion = document.getElementById('articulo-descripcion').value.trim();
    const id_categoria = Number(document.getElementById('articulo-categoria-id').value);
    const id_area = Number(document.getElementById('articulo-area').value);

    try {
        const resp = await fetch(API_ARTICULOS, {
            method: 'POST',
            headers: obtenerHeadersAuth(),
            body: JSON.stringify({ descripcion, id_categoria, id_area })
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.error || resData.mensaje || 'No se pudo crear el artículo.');
        }

        document.getElementById('formNuevoArticulo').reset();
        const btnCancelar = document.querySelector('#modalNuevoArticulo .btn-secondary');
        if (btnCancelar) btnCancelar.click();

        alert('Artículo registrado con éxito.');
        cargarArticulos();
    } catch (error) {
        alert(`Error al registrar artículo: ${error.message}`);
    }
}

function prepararModalEdicion(art) {
    document.getElementById('edit-articulo-id').value = art.id_articulo;
    document.getElementById('edit-articulo-descripcion').value = art.descripcion;
    document.getElementById('edit-articulo-categoria-id').value = art.id_categoria;
    document.getElementById('edit-articulo-area').value = art.id_area;
}

async function guardarEdicionArticulo(event) {
    event.preventDefault();
    const id = document.getElementById('edit-articulo-id').value;
    const descripcion = document.getElementById('edit-articulo-descripcion').value.trim();
    const id_categoria = Number(document.getElementById('edit-articulo-categoria-id').value);
    const id_area = Number(document.getElementById('edit-articulo-area').value);

    try {
        const resp = await fetch(`${API_ARTICULOS}/${id}`, {
            method: 'PUT',
            headers: obtenerHeadersAuth(),
            body: JSON.stringify({ descripcion, id_categoria, id_area })
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.error || resData.mensaje || 'No se pudo modificar el artículo.');
        }

        const btnCancelar = document.querySelector('#modalEditarArticulo .btn-secondary');
        if (btnCancelar) btnCancelar.click();

        alert('Artículo modificado con éxito.');
        cargarArticulos();
    } catch (error) {
        alert(`Error al modificar artículo: ${error.message}`);
    }
}

async function eliminarArticulo(id) {
    if (!confirm('¿Está seguro de que desea eliminar este artículo?')) return;

    try {
        const resp = await fetch(`${API_ARTICULOS}/${id}`, {
            method: 'DELETE',
            headers: obtenerHeadersAuth()
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.error || resData.mensaje || 'No se pudo eliminar el artículo.');
        }

        alert('Artículo eliminado con éxito.');
        cargarArticulos();
    } catch (error) {
        alert(`Error al eliminar artículo: ${error.message}`);
    }
}

async function buscarArticulo(event) {
    event.preventDefault();
    const id = document.getElementById('buscar-articulo-id').value;
    const contenedorResultado = document.getElementById('resultado-busqueda-articulo');
    const contenedorError = document.getElementById('error-busqueda-articulo');

    contenedorResultado.classList.add('d-none');
    contenedorError.classList.add('d-none');

    try {
        const resp = await fetch(`${API_ARTICULOS}/${id}`, {
            headers: obtenerHeadersAuth()
        });

        const resData = await resp.json();
        if (!resp.ok) {
            throw new Error(resData.mensaje || resData.error || 'Artículo no encontrado.');
        }

        const art = resData.articulo;
        document.getElementById('res-articulo-id').textContent = art.id_articulo;
        document.getElementById('res-articulo-area').textContent = art.area || art.id_area;
        document.getElementById('res-articulo-categoria').textContent = art.categoria || art.id_categoria;
        document.getElementById('res-articulo-descripcion').textContent = art.descripcion;

        contenedorResultado.classList.remove('d-none');
    } catch (error) {
        contenedorError.textContent = error.message;
        contenedorError.classList.remove('d-none');
    }
}
