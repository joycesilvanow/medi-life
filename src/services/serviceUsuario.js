const UsuarioRepository = require('../repositories/UsuarioRepository');
const bcrypt = require('bcryptjs');

class UsuarioService {

  async validarCamposObrigatorios(dados) {
    if (!dados || typeof dados !== 'object') {
      throw new Error('Dados inválidos para cadastro');
    }

    const obrigatorios = ['consultorio', 'nome', 'email', 'senha', 'perfil', 'criado_por'];
    const faltantes = obrigatorios.filter((campo) => !dados[campo]);

    if (faltantes.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${faltantes.join(', ')}`);
    }

    if (String(dados.senha).length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }
  }

  normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
  }
  
  async cadastrar(dados) {
    await this.validarCamposObrigatorios(dados);

    const email = this.normalizarEmail(dados.email);
    const existente = await UsuarioRepository.findByEmail(email);

    if (existente) {
      throw new Error('Email já cadastrado');
    }
    
    const payload = {
      ...dados,
      email,
      senha: await bcrypt.hash(String(dados.senha), 10),
    };
    
    return await UsuarioRepository.create(payload);
  }

  async listarAtivos() {
    return await UsuarioRepository.findAllAtivos();
  }

  async buscarPorId(id) {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }

  async atualizar(id, dadosAtualizacao) {
    if (!dadosAtualizacao || Object.keys(dadosAtualizacao).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    if (dadosAtualizacao.email) {
      const emailNormalizado = this.normalizarEmail(dadosAtualizacao.email);
      const existente = await UsuarioRepository.findByEmail(emailNormalizado);

      if (existente && existente.id !== id) {
        throw new Error('Email já cadastrado para outro usuário');
      }

      dadosAtualizacao.email = emailNormalizado;
    }

    const atualizado = await UsuarioRepository.update(id, dadosAtualizacao);

    if (!atualizado) {
      throw new Error('Usuário não encontrado ou dados inválidos para atualização');
    }

    return atualizado;
  }

  async suspender(id, motivo) {
    if (!motivo || !String(motivo).trim()) {
      throw new Error('Motivo da suspensão é obrigatório');
    }

    const usuario = await UsuarioRepository.suspender(id, String(motivo).trim());

    if (!usuario) {
      throw new Error('Usuário não encontrado para suspensão');
    }

    return usuario;
  }

  async excluir(id, motivo = null) {
    const usuario = await UsuarioRepository.softDelete(id, motivo);

    if (!usuario) {
      throw new Error('Usuário não encontrado para exclusão');
    }

    return usuario;
  }
}

module.exports = new UsuarioService();