const AgendamentoRepository = require('../repositories/AgendamentoRepository');

class AgendamentoService {
  validarCriacao(dados) {
    if (!dados || typeof dados !== 'object') {
      throw new Error('Dados inválidos para criar agendamento');
    }

    const obrigatorios = [
      'consultorio',
      'procedimento',
      'profissional',
      'paciente',
      'valor_procedimento',
      'valor_pagar',
      'data',
    ];

    const faltantes = obrigatorios.filter((campo) => dados[campo] === undefined || dados[campo] === null || dados[campo] === '');
    if (faltantes.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${faltantes.join(', ')}`);
    }

    if (Number(dados.valor_procedimento) < 0 || Number(dados.valor_pagar) < 0) {
      throw new Error('Valores do agendamento não podem ser negativos');
    }
  }

  validarStatus(status) {
    const permitidos = ['AGENDADO', 'CANCELADO', 'REALIZADO'];
    if (!permitidos.includes(status)) {
      throw new Error('Status inválido. Use AGENDADO, CANCELADO ou REALIZADO');
    }
  }

  async listar() {
    return AgendamentoRepository.findAll();
  }

  async buscarPorId(id) {
    const agendamento = await AgendamentoRepository.findById(id);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }
    return agendamento;
  }

  async criar(dados) {
    this.validarCriacao(dados);

    const payload = {
      ...dados,
      valor_procedimento: Number(dados.valor_procedimento),
      valor_pagar: Number(dados.valor_pagar),
      limite: dados.limite !== undefined && dados.limite !== null ? Number(dados.limite) : null,
      status: dados.status || 'AGENDADO',
    };

    this.validarStatus(payload.status);

    return AgendamentoRepository.create(payload);
  }

  async atualizarStatus(id, status) {
    this.validarStatus(status);

    const atualizado = await AgendamentoRepository.updateStatus(id, status);
    if (!atualizado) {
      throw new Error('Agendamento não encontrado');
    }

    return atualizado;
  }

  async listarPorPaciente(pacienteId) {
    return AgendamentoRepository.findByPaciente(pacienteId);
  }

  async relatorioProfissionais(filtros) {
    return AgendamentoRepository.relatorioProfissionaisAtendimentos(filtros);
  }

  async relatorioFaturamento(filtros) {
    return AgendamentoRepository.relatorioFaturamento(filtros);
  }
}

module.exports = new AgendamentoService();
