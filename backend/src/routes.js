const express = require('express');
const router = express.Router();

// controllers 
const eventoController = require('./controller/evento');
const usuarioController = require('./controller/usuario');
const categoriaController = require('./controller/categoria');

router.get('/', (req, res) => {
    res.send('API rodando');
})

// rotas da API par ao usuário
router.post('/usuario/criar', usuarioController.criar_usuario);
router.delete('/usuario/deletar', usuarioController.deletar_usuario);
router.get('/usuario/get_all', usuarioController.get_all);

// rotas da API para os eventos
router.post('/evento/criar', eventoController.criar_evento);
router.get('/evento/get_eventos_semanais', eventoController.get_eventos_semanais);
router.get('/evento/get_all', eventoController.get_all);
router.delete('/evento/deletar', eventoController.deletar_evento);
router.put('/evento/atualizar/titulo_descricao', eventoController.atualizar_titulo_descricao_evento);
router.put('/evento/atualizar/horario', eventoController.atualizar_horario_evento);

// rotas da API para as categorias
router.post('/categoria/criar', categoriaController.criar);
router.get('/categoria/get_all', categoriaController.get_all);
router.delete('/categoria/deletar', categoriaController.deletar);

module.exports = router;