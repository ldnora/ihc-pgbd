import exp from 'constants';
import api from './api';

const UsuarioService = {
    criarUsuario: async() => {
        try {
            const response = await api.post('/api/usuario/criar', {nome, email, senha});

            return response;
        } catch (error) {
            throw new Error(error);
        }
    },

    deletarUsuario: async() => {
        try {
            const response = await api.delete('/api/usuario/deletar', {nome});

            return response;
        } catch (error) {
            throw new Error(error);
        }
    },

    getAllUsuarios: async() => {
        try {
            const response = await api.get('/api/usuario/get_all');

            return response;
        } catch (error) {
            throw new Error(error);
        }
    }
};

export default UsuarioService;