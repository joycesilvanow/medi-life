const PacienteRepository = require('../repositories/PacienteRepository');

class PacienteService {
  validarCriacao(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos para cadastro de paciente');
    }

    if (!data.consultorio) {
      throw new Error('Consultório é obrigatório');
    }

    if (!data.nome || !String(data.nome).trim()) {
      throw new Error('Nome do paciente é obrigatório');
    }
  }

  async listar() {
    return PacienteRepository.findAll();
  }

  async listarPorConsultorio(consultorioId) {
    return PacienteRepository.findByConsultorio(consultorioId);
  }

  async buscarPorId(id) {
    const item = await PacienteRepository.findById(id);
    if (!item) {
      throw new Error('Paciente não encontrado');
    }
    return item;
  }

  async criar(data) {
    this.validarCriacao(data);
    return PacienteRepository.create({ ...data, nome: String(data.nome).trim() });
  }

  async atualizar(id, data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    const atualizado = await PacienteRepository.update(id, data);
    if (!atualizado) {
      throw new Error('Paciente não encontrado ou dados inválidos para atualização');
    }
    return atualizado;
  }

  async suspender(id, motivo) {
    if (!motivo || !String(motivo).trim()) {
      throw new Error('Motivo da suspensão é obrigatório');
    }

    const item = await PacienteRepository.suspender(id, String(motivo).trim());
    if (!item) {
      throw new Error('Paciente não encontrado para suspensão');
    }
    return item;
  }

  async excluir(id) {
    const item = await PacienteRepository.softDelete(id);
    if (!item) {
      throw new Error('Paciente não encontrado para exclusão');
    }
    return item;
  }
}

module.exports = new PacienteService();
