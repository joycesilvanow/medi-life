const UsuarioService = require('../services/serviceUsuario');

function mapErrorToStatus(message = '') {
  if (message.includes('Credenciais inválidas')) return 401;
  if (message.includes('não encontrado')) return 404;
  if (
    message.includes('obrigatório') ||
    message.includes('inválido') ||
    message.includes('ausentes') ||
    message.includes('já cadastrado') ||
    message.includes('mínimo')
  ) {
    return 400;
  }
  return 500;
}

function handleError(res, error) {
  const status = mapErrorToStatus(error.message);
  return res.status(status).json({ erro: error.message });
}

class UsuarioController {
  async cadastrar(req, res) {
    try {
      const usuario = await UsuarioService.cadastrar(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listarAtivos(req, res) {
    try {
      const usuarios = await UsuarioService.listarAtivos();
      return res.status(200).json(usuarios);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.buscarPorId(id);
      return res.status(200).json(usuario);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.atualizar(id, req.body);
      return res.status(200).json(usuario);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async suspender(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const usuario = await UsuarioService.suspender(id, motivo);
      return res.status(200).json(usuario);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body || {};
      const usuario = await UsuarioService.excluir(id, motivo);
      return res.status(200).json(usuario);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new UsuarioController();
