const express = require('express');
const PerfilController = require('../controllers/perfilController');

const router = express.Router();

router.get('/', (req, res) => PerfilController.listar(req, res));
router.get('/:id', (req, res) => PerfilController.buscarPorId(req, res));
router.post('/', (req, res) => PerfilController.criar(req, res));
router.put('/:id', (req, res) => PerfilController.atualizar(req, res));
router.delete('/:id', (req, res) => PerfilController.excluir(req, res));

module.exports = router;
