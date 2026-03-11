const ProcedimentoRepository = require('../repositories/ProcedimentoRepository');

class ProcedimentoService {
  async listar() {
    return ProcedimentoRepository.findAll();
  }

  async buscarPorId(id) {
    const item = await ProcedimentoRepository.findById(id);
    if (!item) {
      throw new Error('Procedimento não encontrado');
    }
    return item;
  }

  async criar(data) {
    if (!data?.nome || !String(data.nome).trim()) {
      throw new Error('Nome do procedimento é obrigatório');
    }

    const nome = String(data.nome).trim();
    const existente = await ProcedimentoRepository.findByNome(nome);
    if (existente) {
      throw new Error('Procedimento já cadastrado');
    }

    return ProcedimentoRepository.create({ nome });
  }

  async atualizar(id, data) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    if (data.nome) {
      const nome = String(data.nome).trim();
      const existente = await ProcedimentoRepository.findByNome(nome);
      if (existente && existente.id !== id) {
        throw new Error('Procedimento já cadastrado');
      }
      data.nome = nome;
    }

    const atualizado = await ProcedimentoRepository.update(id, data);
    if (!atualizado) {
      throw new Error('Procedimento não encontrado ou dados inválidos para atualização');
    }
    return atualizado;
  }

  async suspender(id, motivo) {
    if (!motivo || !String(motivo).trim()) {
      throw new Error('Motivo da suspensão é obrigatório');
    }

    const item = await ProcedimentoRepository.suspender(id, String(motivo).trim());
    if (!item) {
      throw new Error('Procedimento não encontrado para suspensão');
    }
    return item;
  }

  async excluir(id) {
    const item = await ProcedimentoRepository.softDelete(id);
    if (!item) {
      throw new Error('Procedimento não encontrado para exclusão');
    }
    return item;
  }
}

module.exports = new ProcedimentoService();
