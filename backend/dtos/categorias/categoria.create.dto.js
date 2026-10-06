// DTO de creación de Categorías
export class CategoriaCreateDto {
    constructor(categoria) {
        this.descripcion = categoria.descripcion;
        this.activo = 1;
    }
}
