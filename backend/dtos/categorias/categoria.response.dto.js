// DTO de respuesta de Categorías
export class CategoriaResponseDto {
    constructor(categoria) {
        this.idCategoria = categoria.id_categoria;
        this.descripcion = categoria.descripcion;
        this.activo = categoria.activo;
    }
}