const { open_banco_de_dados } = require('../data/banco_de_dados');

const categoriaController = {
    async criar(req, res) {
        const db = await open_banco_de_dados();
        const { usuario_id, nome, descricao } = req.body;

        try {
            await db.run('instert into Categoria ( usuario_id, nome, descricao ) values ( ?, ?, ?)', [usuario_id, nome, descricao]);
            res.status(201).send({ success: true, message: 'Categoria criada com sucesso' });
        } catch (error) {
            console.error('Erro ao criar uma categoria:', error.message);
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

    async deletar(req, res) {
        const db = await open_banco_de_dados();
        const { categoria_id } = req.body;

        const categoria = await db.get('select * from Categoria where nome = ?', [categoria_id]);

        if (!categoria){
            return res.status(400).send({ success: false, error: 'Categoria inexistente' });
        }

        try {
            await db.run('delete from Categoria where nome = ?', [categoria_id]);

            res.status(200).send({ success: true, message: 'Categoria excluida com sucesso' });
        } catch (error) {
            console.error('Erro ao tentar deletar uma categoria:', error.message);
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

    async get_all(req, res) {
        try {
            const db = await open_banco_de_dados();

            const categoria = await db.all('select * from Categoria');

            res.status(200).json(categoria);
        } catch (error) {
            console.error('Erro ao tentar consultar as categorias:', error.message);
            res.status(500).send({error: 'Erro interno do servdior'});
        }
    }

}

module.exports = categoriaController;