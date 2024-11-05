// Aqui estão todas as rotas da API para os eventos

const express = require('express');
const router = express.Router();
const { banco_de_dados } = require('../database');
const {
    criar_evento,
    buscar_eventos_do_usuario
} = require('../database/functions');

router.post('/', async(req, res) => {
    try {
        const evento = await criar_evento(banco_de_dados, req.body);
        res.status(201).json(evento);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/usuario:usuario_id', async(req, res) => {
    try {
        const eventos = await buscar_eventos_do_usuario(banco_de_dados, req.params.usuario_id);
        res.json(eventos);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

