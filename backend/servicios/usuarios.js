import UsuariosDatos from '../datos/usuarios.js';

export default class UsuariosServicio {

    constructor() {
        this.usuario = new UsuariosDatos();
    }

    buscarPorUsuarioContrasenia = (usuario, contrasenia) => {
        return this.usuario.buscarPorUsuarioContrasenia(usuario, contrasenia);
    };

    buscarPorId = (id_usuario) => {
        return this.usuario.buscarPorId(id_usuario);
    };
}
