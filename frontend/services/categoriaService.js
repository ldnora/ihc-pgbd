import api from "./api";

const CategoriaService = {
    criarCategoria: async() => {
        try {
            const response = await api.post('/api/categoria/criar', { usuario_id, nome, descricao });

            return response;
        } catch (error) {
            throw new Error(error);
        }
    },

    getAllCategorias: async() => {
        try {
            const response = await api.get('/api/categoria/get_all');

            return response;
        } catch (error) {
            throw new Error(error);
        }
    },

    deletarCategoria: async() => {
        try {
            const response = await api.post('/api/categoria/deletar', { categoria_id });

            return response;
        } catch (error) {
            throw new Error(error);
        }
    },
};

export default CategoriaService;