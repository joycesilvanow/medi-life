const ProfissionalRepository = require('../repositories/ProfissionalRepository');

class ProfissionalService {
  validarCriacao(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos para cadastro de profissional');
    }

    if (!data.consultorio) {
      throw new Error('Consultório é obrigatório');
    }

    if (!data.nome || !String(data.nome).trim()) {
      throw new Error('Nome do profissional é obrigatório');
    }
  }

  async listar() {
    return ProfissionalRepository.findAll();
  }

  async listarPorConsultorio(consultorioId) {
    return ProfissionalRepository.findByConsultorio(consultorioId);
  }

  async buscarPorId(id) {
    const item = await ProfissionalRepository.findById(id);
    if (!item) {
      throw new Error('Profissional não encontrado');
    }
    return item;
  }

  async criar(data) {
    this.validarCriacao(data);
    return ProfissionalRepository.create({ ...data, nome: String(data.nome).trim() });
  }

  async atualizar(id, data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    const atualizado = await ProfissionalRepository.update(id, data);
    if (!atualizado) {
      throw new Error('Profissional não encontrado ou dados inválidos para atualização');
    }
    return atualizado;
  }

  async suspender(id, motivo) {
    if (!motivo || !String(motivo).trim()) {
      throw new Error('Motivo da suspensão é obrigatório');
    }

    const item = await ProfissionalRepository.suspender(id, String(motivo).trim());
    if (!item) {
      throw new Error('Profissional não encontrado para suspensão');
    }
    return item;
  }

  async excluir(id) {
    const item = await ProfissionalRepository.softDelete(id);
    if (!item) {
      throw new Error('Profissional não encontrado para exclusão');
    }
    return item;
  }
}

module.exports = new ProfissionalService();
