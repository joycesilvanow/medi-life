const express = require('express');
const PacienteController = require('../controllers/pacienteController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/consultorio/:consultorioId', (req, res) => PacienteController.listarPorConsultorio(req, res));
router.get('/', (req, res) => PacienteController.listar(req, res));
router.get('/:id', (req, res) => PacienteController.buscarPorId(req, res));
router.post('/', authenticateToken, requireAdmin, (req, res) => PacienteController.criar(req, res));
router.put('/:id', (req, res) => PacienteController.atualizar(req, res));
router.patch('/:id/suspender', (req, res) => PacienteController.suspender(req, res));
router.delete('/:id', (req, res) => PacienteController.excluir(req, res));

module.exports = router;
