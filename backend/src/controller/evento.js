const { open_banco_de_dados } = require("../data/banco_de_dados");
const dayjs = require('dayjs');
const iso_week = require('dayjs/plugin/isoWeek');
dayjs.extend(iso_week);


const eventoController = {
    async criar_evento(req, res) {
        const db = await open_banco_de_dados();
        const { usuario_id, categoria_id, nome, descricao, data_inicio, data_fim } = req.body;

        // Validação básica
        if (!usuario_id || !nome || !data_inicio || !data_fim) {
            return res.status(400).send({ error: "Campos obrigatórios ausentes." });
        }

        try {
            // Insere no banco de dados
            const result = await db.run(
                `INSERT INTO Evento (usuario_id, categoria_id, nome, descricao, data_inicio, data_fim) 
             VALUES (?, ?, ?, ?, ?, ?)`,
                [usuario_id, categoria_id, nome, descricao, data_inicio, data_fim]
            );

            res.status(201).send({
                success: true,
                message: "Evento criado com sucesso",
                evento_id: result.lastID,
                usuario_id,
                categoria_id,
                nome,
                descricao,
                data_inicio,
                data_fim,
            });
        } catch (error) {
            console.error("Erro ao criar um evento:", error.message);
            res.status(500).send({ error: "Erro interno do servidor" });
        }
    },


    async get_eventos_semanais(req, res) {
        const db = await open_banco_de_dados();
        const { usuario_id, inicio, fim } = req.query;

        try {
            const events = await db.all(
                'SELECT * FROM Evento WHERE data_inicio > ? AND ? AND usuario_id = ?',
                [inicio, fim, usuario_id]
            );
            res.status(200).send(events);
        } catch (error) {
            console.error('Erro ao buscar eventos:', error.message);
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

    async get_all(req, res) {
        try {
            const db = await open_banco_de_dados();

            const eventos = await db.all('select * from Evento');

            res.status(200).json(eventos);
        } catch (error) {
            console.error('Erro ao consultar os eventos:', error.message);
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

        async deletar_evento(req, res){
    const db = await open_banco_de_dados();
    const { usuario_id, evento_id } = req.body;

    try {
        db.run('delete from Evento where usuario_id = ? and evento_id = ?', [usuario_id, evento_id]);
        res.status(200).send({ success: true, message: 'Evento exluído com sucesso ' });
    } catch (error) {
        console.error('Erro ao tentar deletar usuário:', error.message);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
},

    async atualizar_titulo_descricao_evento(req, res) {
    const db = await open_banco_de_dados();
    const { usuario_id, evento_id, new_nome, new_descricao } = req.body;

    if (!new_nome) {
        return res.status(400).send({ error: "Os campos 'new_nome' e 'new_descricao' são obrigatórios." });
    }

    try {
        db.run('update Evento set nome = ?, descricao = ? where usuario_id = ? and evento_id = ?', [new_nome, new_descricao, usuario_id, evento_id]);
        res.status(200).send({ success: true, message: 'Evento editado com sucesso ' });
    } catch (error) {
        console.error('Erro ao tentar deletar usuário:', error.message);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
},

    async atualizar_horario_evento(req, res) {
    const db = await open_banco_de_dados();
    const { usuario_id, evento_id, new_data_inicio, new_data_fim } = req.body;

    if (!evento_id || !new_data_inicio || !new_data_fim) {
        return res.status(400).json({ error: "Todos os campos obrigatórios devem ser fornecidos." });
    }
    try {
        db.run('update Evento set data_inicio = ?, data_fim = ? where usuario_id = ? and evento_id = ?', [new_data_inicio, new_data_fim, usuario_id, evento_id]);
        res.status(200).send({ success: true, message: 'Evento editado com sucesso ' });
    } catch (error) {
        console.error('Erro ao tentar deletar usuário:', error.message);
        res.status(500).send({ error: 'Erro interno do servidor' });
    }
},
};

module.exports = eventoController;