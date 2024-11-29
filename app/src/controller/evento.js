const { open_banco_de_dados } = require("../data/banco_de_dados");
const dayjs = require('dayjs');
const iso_week = require('dayjs/plugin/isoWeek');
dayjs.extend(iso_week);


const eventoController = {
    async criar_evento(req, res) {
        const db = await open_banco_de_dados();
        const { usuario_id, categoria_id, nome, descricao, data_inicio, data_fim } = req.body;

        try {
            await db.run('insert into Evento ( usuario_id, categoria_id, nome, descricao, data_inicio, data_fim) values (?, ?, ?, ?, ?, ?)', [ usuario_id, categoria_id, nome, descricao, data_inicio, data_fim]);

            res.status(201).send({ success: true, message: 'Evento criado com sucesso' });
        } catch (error) {
            console.error('Erro ao criar um evento:', error.message);
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

    async get_eventos_semanais(req, res) {
        try {
            const db = open_banco_de_dados();
            const { usuario_id, offset } = req.body; 
    
            // descobrir qual é o dia que começa e termina a semama, para pegar os eventos que estão nesse intervalo de tempo
            const inicio_da_semana = dayjs().add(offset, 'week').startOf('isoWeek').format('YYYY-MM-DD');
            const fim_de_semana = dayjs().add(offset, 'week').endOf('isoWeek').format('YYYY-MM-DD');
            
            const select_eventos_da_semana = `
                select * 
                from Evento
                where usuario_id = ? and 
                ((data_inicio between ? and ?) or 
                (data_fim between ? and ?))
            `;
    
            let eventos_semanais = (await db).get(select_eventos_da_semana, [usuario_id, inicio_da_semana, fim_de_semana, inicio_da_semana, fim_de_semana]);
            
            res.status(200).json({
                success: true,
                week_range: { inicio_da_semana, fim_de_semana },
                eventos_semanais
            })
        }
        catch (error) {
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
            res.status(500).send({error: 'Erro interno do servidor'});
        }
    },

    async deletar_evento(req, res){
        const db = await open_banco_de_dados();
        const { evento_id } = req.body;

        try {
            db.run('delete from Evento where evento_id = ?', [evento_id]);
            res.status(200).send({ success: true, message: 'Evento exluído com sucesso '});
        } catch (error) {
            console.error('Erro ao tentar deletar usuário:', error.message);
            res.status(500).send({ error: 'Erro interno do servidor'});
        }
    }
};

module.exports = eventoController;