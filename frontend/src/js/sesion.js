const NOMBRES_ROLES = {
    1: 'Director área de Sistemas',
    2: 'Empleado área de Sistemas',
    3: 'Empleado Municipal'
};

export function obtenerToken() {
    return sessionStorage.getItem('token');
}

export function obtenerUsuarioActual() {
    const guardado = sessionStorage.getItem('usuario');
    if (!guardado) return null;
    return JSON.parse(guardado);
}

export function obtenerHeadersAuth() {
    const token = obtenerToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

export function cerrarSesion() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    window.location.href = '/index.html';
}

export function redirigirSegunRol(rol) {
    if (rol === 1) {
        window.location.href = '/src/pages/director/director-dashboard.html';
    } else if (rol === 2) {
        window.location.href = '/src/pages/empleado-sistemas/sistemas-categorias.html';
    } else if (rol === 3) {
        window.location.href = '/src/pages/empleado-municipal/municipal-incidencias.html';
    } else {
        window.location.href = '/index.html';
    }
}

export function inicializarSesion(rolesPermitidos = []) {
    const token = obtenerToken();
    const usuario = obtenerUsuarioActual();

    if (!token || !usuario) {
        window.location.href = '/index.html';
        return null;
    }

    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(Number(usuario.rol))) {
        redirigirSegunRol(Number(usuario.rol));
        return null;
    }

    renderizarPerfilNavbar(usuario);
    return usuario;
}

function renderizarPerfilNavbar(usuario) {
    const spanNombre = document.getElementById('navbar-nombre-usuario');
    const pRol = document.getElementById('navbar-rol-usuario');
    const btnSalir = document.getElementById('btn-cerrar-sesion');

    if (spanNombre) {
        spanNombre.textContent = `${usuario.nombres} ${usuario.apellidos}`;
    }

    if (pRol) {
        pRol.textContent = NOMBRES_ROLES[usuario.rol] || 'Usuario';
    }

    if (btnSalir) {
        btnSalir.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
}
