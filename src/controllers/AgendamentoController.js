const AgendamentoService = require('../services/agendamentoService');

function mapErrorToStatus(message = '') {
  if (message.includes('não encontrado')) return 404;
  if (
    message.includes('obrigatório') ||
    message.includes('inválido') ||
    message.includes('ausentes') ||
    message.includes('negativos')
  ) {
    return 400;
  }
  return 500;
}

function handleError(res, error) {
  const status = mapErrorToStatus(error.message);
  return res.status(status).json({ erro: error.message });
}

class AgendamentoController {
  async listar(req, res) {
    try {
      const agendamentos = await AgendamentoService.listar();
      return res.status(200).json(agendamentos);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const agendamento = await AgendamentoService.buscarPorId(id);
      return res.status(200).json(agendamento);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async criar(req, res) {
    try {
      const agendamento = await AgendamentoService.criar(req.body);
      return res.status(201).json(agendamento);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const atualizado = await AgendamentoService.atualizarStatus(id, status);
      return res.status(200).json(atualizado);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listarPorPaciente(req, res) {
    try {
      const { pacienteId } = req.params;
      const agendamentos = await AgendamentoService.listarPorPaciente(pacienteId);
      return res.status(200).json(agendamentos);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async relatorioProfissionais(req, res) {
    try {
      const filtros = req.query;
      const relatorio = await AgendamentoService.relatorioProfissionais(filtros);
      return res.status(200).json(relatorio);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async relatorioFaturamento(req, res) {
    try {
      const filtros = req.query;
      const relatorio = await AgendamentoService.relatorioFaturamento(filtros);
      return res.status(200).json(relatorio);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new AgendamentoController();