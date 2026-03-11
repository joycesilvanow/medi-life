const PacienteService = require('../services/pacienteService');

function mapErrorToStatus(message = '') {
  if (message.includes('não encontrado')) return 404;
  if (
    message.includes('obrigatório') ||
    message.includes('inválido') ||
    message.includes('já cadastrado') ||
    message.includes('Nenhum dado')
  ) {
    return 400;
  }
  return 500;
}

function handleError(res, error) {
  const status = mapErrorToStatus(error.message);
  return res.status(status).json({ erro: error.message });
}

class PacienteController {
  async listar(req, res) {
    try {
      const itens = await PacienteService.listar();
      return res.status(200).json(itens);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listarPorConsultorio(req, res) {
    try {
      const itens = await PacienteService.listarPorConsultorio(req.params.consultorioId);
      return res.status(200).json(itens);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async buscarPorId(req, res) {
    try {
      const item = await PacienteService.buscarPorId(req.params.id);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async criar(req, res) {
    try {
      const item = await PacienteService.criar(req.body);
      return res.status(201).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async atualizar(req, res) {
    try {
      const item = await PacienteService.atualizar(req.params.id, req.body);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async suspender(req, res) {
    try {
      const item = await PacienteService.suspender(req.params.id, req.body?.motivo);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async excluir(req, res) {
    try {
      const item = await PacienteService.excluir(req.params.id);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new PacienteController();
