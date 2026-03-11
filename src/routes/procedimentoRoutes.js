const express = require('express');
const ProcedimentoController = require('../controllers/procedimentoController');

const router = express.Router();

router.get('/', (req, res) => ProcedimentoController.listar(req, res));
router.get('/:id', (req, res) => ProcedimentoController.buscarPorId(req, res));
router.post('/', (req, res) => ProcedimentoController.criar(req, res));
router.put('/:id', (req, res) => ProcedimentoController.atualizar(req, res));
router.patch('/:id/suspender', (req, res) => ProcedimentoController.suspender(req, res));
router.delete('/:id', (req, res) => ProcedimentoController.excluir(req, res));

module.exports = router;
