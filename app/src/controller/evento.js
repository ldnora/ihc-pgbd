import { open_banco_de_dados } from "../data/banco_de_dados";

const eventoController = {
    async criar_evento(req, res) {
        const db = open_banco_de_dados();
        const { evento_id, usuario_id, categoria_id, nome, descricao, data_inicio, data_fim } = req.body;

        try {
            await db.run('insert into Evento (evento_id, usuario_id, categoria_id, nome, descricao, data_inicio, data_fim) values (?, ?, ?, ?, ?, ?, ?)', [evento_id, usuario_id, categoria_id, nome, descricao, data_inicio, data_fim]);

            res.status(201).send({ success: true, message: 'Evento criado com sucesso' });
        } catch (error) {
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

    async consultar_evento_por_semana(req, res) {
        const db = open_banco_de_dados();
        const { }
    }
}


module.exports = { eventoController };