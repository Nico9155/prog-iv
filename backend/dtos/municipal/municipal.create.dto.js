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
        this.activo = 1; // Aquí sí dejamos 1 fijo porque al crearse nace activo
    }
}