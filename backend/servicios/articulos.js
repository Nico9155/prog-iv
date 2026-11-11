import ArticulosDatos from '../datos/articulos.js';

export default class ArticulosServicio {

    constructor() {
        this.articulo = new ArticulosDatos();
    }

    buscarPorId = (id_articulo) => {
        return this.articulo.buscarPorId(id_articulo);
    };

    buscarTodos = () => {
        return this.articulo.buscarTodos();
    };

    buscarAreasActivas = () => {
        return this.articulo.buscarAreasActivas();
    };

    crear = (articulo) => {
        return this.articulo.crear(articulo);
    };

    borrar = (id_articulo) => {
        return this.articulo.borrar(id_articulo);
    };

    editar = (id_articulo, articulo) => {
        return this.articulo.editar(id_articulo, articulo);
    };
}
