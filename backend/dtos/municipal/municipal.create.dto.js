// DTO de creación
export default class MunicipalCreateDto {
    constructor(municipal) {
        this.idArea = municipal.idArea;
        this.nombres = municipal.nombres;
        this.apellidos = municipal.apellidos;
        this.usuario = municipal.usuario;
        this.contrasenia = municipal.contrasenia;
        this.avatar = municipal.avatar;
        this.rol = municipal.rol;
        this.activo = 1; // 1 pq al crearse es activo por defecto
    }
}