import CategoriasDatos from '../datos/categorias.js';

export default class CategoriasServicio {

    constructor() {
        this.categoria = new CategoriasDatos();
    }

    buscarPorId = (id_categoria) => {
        return this.categoria.buscarPorId(id_categoria);
    };

    buscarTodos = () => {
        return this.categoria.buscarTodos();
    };

    crear = (categoria) => {
        return this.categoria.crear(categoria);
    };

    editar = (categoria) => {
        return this.categoria.editar(categoria);
    };

    borrar = (id_categoria) => {
        return this.categoria.borrar(id_categoria);
    };
}
