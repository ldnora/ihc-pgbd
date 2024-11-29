const { json } = require('express');
const { open_banco_de_dados } = require('../data/banco_de_dados');

const usuarioController = {
    async criar_usuario(req, res) {
        const {nome, email, senha} = req.body;
        const db = await open_banco_de_dados();

        const usuario = await db.get('select * from Usuario where nome = ?', [nome]);

        if(usuario) {
            return res.status(400).send({ success: false, error: 'Usuário já existe' });
        }

        try {
            await db.run('insert into Usuario (nome, email, senha) values (?, ?, ?)', [nome, email, senha]);

            res.status(201).send({ success: true, message: 'Usuário criado com sucesso' });
        } catch (error) {
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

    async deletar_usuario(req, res) {
        const {nome} = req.body;
        const db = await open_banco_de_dados();

        const usuario = db.get('select * from Usuario where nome = ?', [nome]);

        if(!usuario) {
            return res.status(400).send({ success: false, error: 'Usuário inexistente' });
        }

        try {
            await db.run('delete from Usuario where nome = ?', [nome]);

            res.status(200).send({ success: true, message: 'Usuário excluido com sucesso' });
        } catch (error) {
            console.error('Erro ao tentar deletar usuário:', error.message);
            res.status(500).send({ error: 'Erro interno do servidor' });
        }
    },

    async get_all_usuarios(req, res) {
        try {
            const db = await open_banco_de_dados();

            const usuarios = await db.all('select * from Usuario');

            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).send({error: 'Erro interno do sertior'});
        }
    }
};

module.exports = usuarioController;