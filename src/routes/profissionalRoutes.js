const express = require('express');
const ProfissionalController = require('../controllers/profissionalController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/consultorio/:consultorioId', (req, res) => ProfissionalController.listarPorConsultorio(req, res));
router.get('/', (req, res) => ProfissionalController.listar(req, res));
router.get('/:id', (req, res) => ProfissionalController.buscarPorId(req, res));
router.post('/', authenticateToken, requireAdmin, (req, res) => ProfissionalController.criar(req, res));
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => ProfissionalController.excluir(req, res));
router.put('/:id', (req, res) => ProfissionalController.atualizar(req, res));
router.patch('/:id/suspender', (req, res) => ProfissionalController.suspender(req, res));
//router.delete('/:id', (req, res) => ProfissionalController.excluir(req, res));

module.exports = router;
