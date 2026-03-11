const ConsultorioRepository = require('../repositories/ConsultorioRepository');

class ConsultorioService {
  validarCriacao(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos para cadastro de consultório');
    }

    if (!data.razao || !String(data.razao).trim()) {
      throw new Error('Razão social é obrigatória');
    }
  }

  async listar() {
    return ConsultorioRepository.findAll();
  }

  async buscarPorId(id) {
    const consultorio = await ConsultorioRepository.findById(id);
    if (!consultorio) {
      throw new Error('Consultório não encontrado');
    }
    return consultorio;
  }

  async criar(data) {
    this.validarCriacao(data);
    return ConsultorioRepository.create(data);
  }

  async atualizar(id, data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    const atualizado = await ConsultorioRepository.update(id, data);
    if (!atualizado) {
      throw new Error('Consultório não encontrado ou dados inválidos para atualização');
    }
    return atualizado;
  }

  async excluir(id) {
    const excluido = await ConsultorioRepository.softDelete(id);
    if (!excluido) {
      throw new Error('Consultório não encontrado para exclusão');
    }
    return excluido;
  }
}

module.exports = new ConsultorioService();
