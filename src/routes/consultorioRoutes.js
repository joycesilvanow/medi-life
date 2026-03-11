const express = require('express');
const ConsultorioController = require('../controllers/consultorioController');

const router = express.Router();

router.get('/', (req, res) => ConsultorioController.listar(req, res));
router.get('/:id', (req, res) => ConsultorioController.buscarPorId(req, res));
router.post('/', (req, res) => ConsultorioController.criar(req, res));
router.put('/:id', (req, res) => ConsultorioController.atualizar(req, res));
router.delete('/:id', (req, res) => ConsultorioController.excluir(req, res));

module.exports = router;
