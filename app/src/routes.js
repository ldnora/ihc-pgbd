const express = require('express');
const router = express.Router();

// controllers 
const eventoController = require('./controller/evento.js');
const usuarioController = require('./controller/usuario');
const path = require('path');

router.get('/', (req, res) => {
    res.send('API rodando');
})

// rotas da API par ao usuário
router.post('/usuario/criar', usuarioController.criar_usuario);
router.delete('usuario/deletar', usuarioController.deletar_usuario);

// rotas da API para os eventos
router.post('/evento/criar', eventoController.criar_evento);
router.get('/evento/get_eventos_semanais', eventoController.get_eventos_semanais);

// rotas da API para as categorias
// TODO

module.exports = router;