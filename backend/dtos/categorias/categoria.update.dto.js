// DTO de actualización de Categorías
export class CategoriaUpdateDto {
    constructor(categoria) {
        this.descripcion = categoria.descripcion;
        this.activo = categoria.activo;
    }
}