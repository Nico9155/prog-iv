import { redirigirSegunRol } from './src/js/sesion.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('#formulario-login');

    if (!formulario) return;

    configurarAlternarContrasenia();

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuarioInput = document.getElementById('usuario');
        const passwordInput = document.getElementById('password');
        const botonSubmit = formulario.querySelector('button[type="submit"]');

        if (botonSubmit) {
            botonSubmit.disabled = true;
            botonSubmit.textContent = 'Verificando...';
        }

        const datosLogin = {
            usuario: usuarioInput.value.trim(),
            contrasenia: passwordInput.value
        };

        try {
            const respuesta = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosLogin)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok && resultado.token) {
                sessionStorage.setItem('token', resultado.token);
                sessionStorage.setItem('usuario', JSON.stringify(resultado.usuario));
                redirigirSegunRol(Number(resultado.usuario.rol));
            } else {
                alert(resultado.mensaje || 'Usuario o contraseña incorrectos.');
                passwordInput.value = '';
            }

        } catch (error) {
            console.error('Error en la comunicación con el servidor:', error);
            alert('Ocurrió un error en el servidor. Inténtelo más tarde.');
        } finally {
            if (botonSubmit) {
                botonSubmit.disabled = false;
                botonSubmit.textContent = 'Iniciar sesión';
            }
        }
    });
});

function configurarAlternarContrasenia() {
    const btnPassword = document.getElementById('btn-toggle-password');
    const passwordInput = document.getElementById('password');

    if (!btnPassword || !passwordInput) return;

    btnPassword.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });
}
