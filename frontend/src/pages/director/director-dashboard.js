import { inicializarSesion, obtenerHeadersAuth } from '../../js/sesion.js';

const API_DASHBOARD = 'http://localhost:3000/api/v1/incidencias/datos-dashboard';

document.addEventListener('DOMContentLoaded', () => {
    const usuario = inicializarSesion([1]);
    if (!usuario) return;

    cargarDashboard();
});

async function cargarDashboard() {
    try {
        const resp = await fetch(API_DASHBOARD, { headers: obtenerHeadersAuth() });
        if (!resp.ok) throw new Error('Error al obtener datos del dashboard');
        const data = await resp.json();
        const dashboard = data.dashboard;

        renderizarEstados(dashboard.porEstado);
        renderizarFechas(dashboard.porFecha);
        renderizarPrioritarias(dashboard.prioritarias);
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
        alert('No se pudieron cargar las métricas del dashboard.');
    }
}

function renderizarEstados(porEstado) {
    const tbody = document.getElementById('tabla-incidencias-estados');
    if (!tbody) return;
    tbody.innerHTML = '';

    porEstado.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.estado}</td>
            <td>${item.cantidad}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderizarFechas(porFecha) {
    const tbody = document.getElementById('tabla-incidencias-fechas');
    if (!tbody) return;
    tbody.innerHTML = '';

    porFecha.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.fecha}</td>
            <td>${item.cantidad}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderizarPrioritarias(prioritarias) {
    const tbody = document.getElementById('tabla-incidencias-prioritarias');
    if (!tbody) return;
    tbody.innerHTML = '';

    prioritarias.forEach(inc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${inc.id_incidencia}</td>
            <td>${inc.articulo}</td>
            <td>${inc.descripcion_pedido}</td>
            <td>${inc.empleado}</td>
            <td>${inc.estado}</td>
        `;
        tbody.appendChild(row);
    });
}
