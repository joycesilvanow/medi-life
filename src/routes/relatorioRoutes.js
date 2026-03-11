const express = require('express');
const AgendamentoController = require('../controllers/AgendamentoController');

const router = express.Router();

router.get('/profissionais', (req, res) => AgendamentoController.relatorioProfissionais(req, res));
router.get('/faturamento', (req, res) => AgendamentoController.relatorioFaturamento(req, res));

module.exports = router;
