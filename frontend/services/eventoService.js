import api from "./api";

const EventoService = {
    usuario_id: 1,

    criarEvento: async ({ categoria_id, nome, descricao, data_inicio, data_fim }) => {
        try {
          const response = await api.post("/api/evento/criar", {
            usuario_id: EventoService.usuario_id,
            categoria_id,
            nome,
            descricao,
            data_inicio,
            data_fim,
          });
    
          return response; // Retorna o resultado do backend
        } catch (error) {
          throw new Error(error);
        }
    },

    getEventosSemanais: async(data_inicio, data_fim) => {
        try {
            const response = await api.get('/api/evento/get_eventos_semanais', { usuario_id: EventoService.usuario_id, data_inicio, data_fim });

            return response;
        } catch (error) {
            throw new Error(error);
        }
    },

    getAllEventos: async () => {
        try {
          const response = await api.get('/api/evento/get_all'); 
          return response.data; 
        } catch (error) {
          console.error("Error fetching events:", error);
          throw error; 
        }
      },

      deletarEvento: async (evento_id) => {
        try {
          const response = await api.delete("/api/evento/deletar", {
            data: { usuario_id: EventoService.usuario_id, evento_id },
          });
          return response.data;
        } catch (error) {
          console.error("Erro ao excluir evento:", error);
          throw error;
        }
      },
      

    atualizarTituloDescricaoEvento: async(evento_id, new_nome, new_descricao) => {
        try {
            const response = await api.put('/api/evento/atualizar/titulo_descricao', { usuario_id: EventoService.usuario_id, evento_id, new_nome, new_descricao });

            return response;
        } catch (error) {
            throw new Error(error);
        }
    },

    atualizarHorarioEvento: async(evento_id, new_data_inicio, new_data_fim) => {
        try {
            const response = await api.put('/api/evento/atualizar/horario', { usuario_id: EventoService.usuario_id, evento_id, new_data_inicio, new_data_fim });

            return response;
        } catch (error) {
            throw new Error(error);
        }
    }
};

export default EventoService;