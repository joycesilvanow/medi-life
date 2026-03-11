const express = require('express');
const PermissaoController = require('../controllers/permissaoController');

const router = express.Router();

router.get('/', (req, res) => PermissaoController.listar(req, res));
router.get('/perfil/:perfilId', (req, res) => PermissaoController.listarPorPerfil(req, res));
router.get('/:id', (req, res) => PermissaoController.buscarPorId(req, res));
router.post('/', (req, res) => PermissaoController.criar(req, res));
router.put('/:id', (req, res) => PermissaoController.atualizar(req, res));
router.delete('/:id', (req, res) => PermissaoController.excluir(req, res));

module.exports = router;
