const PerfilRepository = require('../repositories/PerfilRepository');

class PerfilService {
  validarStatus(status) {
    const permitidos = ['ATIVO', 'INATIVO', 'SUSPENSO', 'EXCLUIDO'];
    if (status && !permitidos.includes(status)) {
      throw new Error('Status inválido. Use ATIVO, INATIVO, SUSPENSO ou EXCLUIDO');
    }
  }

  async listar() {
    return PerfilRepository.findAll();
  }

  async buscarPorId(id) {
    const perfil = await PerfilRepository.findById(id);
    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }
    return perfil;
  }

  async criar(data) {
    if (!data?.nome || !String(data.nome).trim()) {
      throw new Error('Nome do perfil é obrigatório');
    }

    this.validarStatus(data.status);

    const existente = await PerfilRepository.findByNome(String(data.nome).trim());
    if (existente) {
      throw new Error('Perfil já cadastrado');
    }

    return PerfilRepository.create({ ...data, nome: String(data.nome).trim() });
  }

  async atualizar(id, data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    if (data.status) {
      this.validarStatus(data.status);
    }

    if (data.nome) {
      const nome = String(data.nome).trim();
      const existente = await PerfilRepository.findByNome(nome);
      if (existente && existente.id !== id) {
        throw new Error('Perfil já cadastrado');
      }
      data.nome = nome;
    }

    const atualizado = await PerfilRepository.update(id, data);
    if (!atualizado) {
      throw new Error('Perfil não encontrado ou dados inválidos para atualização');
    }
    return atualizado;
  }

  async excluir(id) {
    const excluido = await PerfilRepository.softDelete(id);
    if (!excluido) {
      throw new Error('Perfil não encontrado para exclusão');
    }
    return excluido;
  }
}

module.exports = new PerfilService();
