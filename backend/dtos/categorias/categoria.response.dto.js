export class CategoriaResponseDto {
    constructor(categoria) {
        this.idCategoria = categoria.id_categoria;
        this.descripcion = categoria.descripcion;
    }
}