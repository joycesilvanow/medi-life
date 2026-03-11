const express = require('express');
const UsuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/cadastro', (req, res) => UsuarioController.cadastrar(req, res));
router.get('/ativos', (req, res) => UsuarioController.listarAtivos(req, res));
router.get('/:id', (req, res) => UsuarioController.buscarPorId(req, res));
router.put('/:id', (req, res) => UsuarioController.atualizar(req, res));
router.patch('/:id/suspender', (req, res) => UsuarioController.suspender(req, res));
router.delete('/:id', (req, res) => UsuarioController.excluir(req, res));

module.exports = router;
