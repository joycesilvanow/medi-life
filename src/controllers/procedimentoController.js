const ProcedimentoService = require('../services/procedimentoService');

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

class ProcedimentoController {
  async listar(req, res) {
    try {
      const itens = await ProcedimentoService.listar();
      return res.status(200).json(itens);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async buscarPorId(req, res) {
    try {
      const item = await ProcedimentoService.buscarPorId(req.params.id);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async criar(req, res) {
    try {
      const item = await ProcedimentoService.criar(req.body);
      return res.status(201).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async atualizar(req, res) {
    try {
      const item = await ProcedimentoService.atualizar(req.params.id, req.body);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async suspender(req, res) {
    try {
      const item = await ProcedimentoService.suspender(req.params.id, req.body?.motivo);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async excluir(req, res) {
    try {
      const item = await ProcedimentoService.excluir(req.params.id);
      return res.status(200).json(item);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new ProcedimentoController();
