const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/AgendamentoController');

// Listar agendamentos por paciente
router.get('/paciente/:pacienteId', AgendamentoController.listarPorPaciente);

// Listar todos os agendamentos
router.get('/', AgendamentoController.listar);

// Buscar agendamento por ID
router.get('/:id', AgendamentoController.buscarPorId);

// Criar novo agendamento
router.post('/', AgendamentoController.criar);

// Atualizar status do agendamento
router.patch('/:id/status', AgendamentoController.atualizarStatus);

module.exports = router;