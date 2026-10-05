// DTO de respuesta
export default class MunicipalResponseDto {
    constructor(municipal) {
        this.idUsuario = municipal.id_usuario;
        this.idArea = municipal.id_area;
        this.nombres = municipal.nombres;
        this.apellidos = municipal.apellidos;
        this.usuario = municipal.usuario;
        this.avatar = municipal.avatar;
        this.rol = municipal.rol;
        this.activo = municipal.activo;
    }
}