// DTO de actualización
export default class MunicipalUpdateDto {
    constructor(municipal) {
        this.idArea = municipal.idArea;
        this.nombres = municipal.nombres;
        this.apellidos = municipal.apellidos;
        this.usuario = municipal.usuario;
        this.contrasenia = municipal.contrasenia;
        this.avatar = municipal.avatar;
        this.rol = municipal.rol;
        this.activo = municipal.activo;
    }
}