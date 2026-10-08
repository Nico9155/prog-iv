const API_URL = 'http://localhost:3000/api/categorias';

document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();

    const formNueva = document.getElementById('formNuevaCategoria');
    if (formNueva) {
        formNueva.addEventListener('submit', agregarCategoria);
    }

    const formEditar = document.getElementById('formEditarCategoria');
    if (formEditar) {
        formEditar.addEventListener('submit', guardarEdicionCategoria);
    }
});

async function cargarCategorias() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al conectar con la API de la municipalidad');
        
        const categorias = await respuesta.json();
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

    if (categorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay categorías activas registradas.</td></tr>';
        return;
    }

    categorias.forEach(cat => {
        const row = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = cat.idCategoria;
        row.appendChild(tdId);

        const tdDesc = document.createElement('td');
        tdDesc.textContent = cat.descripcion;
        row.appendChild(tdDesc);
        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'text-center';

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-sm btn-outline-primary me-2';
        btnEdit.innerHTML = 'Editar';
        btnEdit.setAttribute('data-bs-toggle', 'modal');
        btnEdit.setAttribute('data-bs-target', '#modalEditarCategoria');
        btnEdit.addEventListener('click', () => prepararModalEdicion(cat.idCategoria, cat.descripcion));
        tdAcciones.appendChild(btnEdit);

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-sm btn-outline-danger';
        btnDelete.innerHTML = 'Eliminar';
        btnDelete.addEventListener('click', () => eliminarCategoria(cat.idCategoria));
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion: inputDesc.value })
        });

        if (!respuesta.ok) {
            const errData = await respuesta.json();
            throw new Error(errData.error || 'Fallo en la creación.');
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion })
        });

        if (!respuesta.ok) {
            const errData = await respuesta.json();
            throw new Error(errData.error || 'Fallo al actualizar.');
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
    if (!confirm('¿Está seguro de que desea eliminar permanentemente esta categoría del sistema municipal?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            const errData = await respuesta.json();
            throw new Error(errData.error || 'Fallo en la eliminación.');
        }

        alert('Categoría dada de baja correctamente.');
        cargarCategorias();
    } catch (error) {
        alert(`Error al eliminar: ${error.message}`);
    }
}
