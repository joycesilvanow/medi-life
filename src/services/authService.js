const UsuarioRepository = require('../repositories/UsuarioRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  async login(email, senha) {
    const emailNormalizado = this.normalizarEmail(email);
    const usuario = await UsuarioRepository.findByEmail(emailNormalizado);

    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    if (usuario.suspensao || usuario.status === 'SUSPENSO') {
      const motivo = usuario.suspensao_motivo || 'contate o administrador';
      throw new Error(`Usuário suspenso. Motivo: ${motivo}`);
    }

    if (usuario.excluido || usuario.status === 'EXCLUIDO') {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(String(senha), String(usuario.senha));

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil_nome,
        consultorio: usuario.consultorio,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil_nome,
      },
      token,
    };
  }
}

module.exports = new AuthService();
