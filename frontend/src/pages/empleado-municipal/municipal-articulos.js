import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_ARTICULOS = 'http://localhost:3000/api/v1/articulos';

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = inicializarSesion([3]);
    if (!usuario) return;

    try {
        const resp = await fetch(API_ARTICULOS, {
            headers: obtenerHeadersAuth()
        });
        if (!resp.ok) throw new Error('Error al obtener artículos');
        const data = await resp.json();
        renderizarTablaArticulos(data.articulos || []);
    } catch (error) {
        console.error('Error al cargar artículos:', error);
        alert('No se pudieron cargar los artículos.');
    }
});

function renderizarTablaArticulos(articulos) {
    const tbody = document.getElementById('tabla-articulos');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!articulos || articulos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay artículos disponibles.</td></tr>';
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
        tbody.appendChild(row);
    });
}
