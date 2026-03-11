const PermissaoRepository = require('../repositories/PermissaoRepository');

class PermissaoService {
  validarStatus(status) {
    const permitidos = ['ATIVO', 'INATIVO', 'SUSPENSO', 'EXCLUIDO'];
    if (status && !permitidos.includes(status)) {
      throw new Error('Status inválido. Use ATIVO, INATIVO, SUSPENSO ou EXCLUIDO');
    }
  }

  async listar() {
    return PermissaoRepository.findAll();
  }

  async buscarPorId(id) {
    const permissao = await PermissaoRepository.findById(id);
    if (!permissao) {
      throw new Error('Permissão não encontrada');
    }
    return permissao;
  }

  async listarPorPerfil(perfilId) {
    return PermissaoRepository.findByPerfil(perfilId);
  }

  async criar(data) {
    if (!data?.nome || !String(data.nome).trim()) {
      throw new Error('Nome da permissão é obrigatório');
    }

    if (!data?.perfil) {
      throw new Error('Perfil é obrigatório para criar permissão');
    }

    this.validarStatus(data.status);

    return PermissaoRepository.create({ ...data, nome: String(data.nome).trim() });
  }

  async atualizar(id, data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    if (data.status) {
      this.validarStatus(data.status);
    }

    const atualizado = await PermissaoRepository.update(id, data);
    if (!atualizado) {
      throw new Error('Permissão não encontrada ou dados inválidos para atualização');
    }
    return atualizado;
  }

  async excluir(id) {
    const excluido = await PermissaoRepository.softDelete(id);
    if (!excluido) {
      throw new Error('Permissão não encontrada para exclusão');
    }
    return excluido;
  }
}

module.exports = new PermissaoService();
