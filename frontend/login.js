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
            password: passwordInput.value
        };

        try {
            const respuesta = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosLogin)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok && resultado.success) {
                window.location.href = '/src/pages/empleado-sistemas/sistemas-categorias.html'; 
            } else {
                alert(resultado.message || 'Usuario o contraseña incorrectos.');
                passwordInput.value = '';
            }

        } catch (error) {
            console.error('Error en la comunicación con el servidor:', error);
            alert('Ocurrió un error en el servidor. Inténtelo más tarde.');
        } finally {
            if (botonSubmit) {
                botonSubmit.disabled = false;
                botonSubmit.textContent = 'Ingresar';
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
