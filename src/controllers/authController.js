const AuthService = require('../services/authService');

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

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const auth = await AuthService.login(email, senha);
      return res.status(200).json(auth);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new AuthController();
