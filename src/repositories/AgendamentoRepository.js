const { sql, query, transaction } = require('../config/database');

class AgendamentoRepository {
	async findAll() {
		const result = await query(`
			SELECT a.*, p.nome AS paciente_nome, pr.nome AS profissional_nome, pd.nome AS procedimento_nome
			FROM paciente_agendamento a
			JOIN paciente p ON a.paciente = p.id
			JOIN profissional pr ON a.profissional = pr.id
			JOIN procedimentos pd ON a.procedimento = pd.id
			ORDER BY a.data DESC
		`);
		return result.recordset;
	}

	async findById(id) {
		const result = await query(`
			SELECT a.*, p.nome AS paciente_nome, pr.nome AS profissional_nome, pd.nome AS procedimento_nome
			FROM paciente_agendamento a
			JOIN paciente p ON a.paciente = p.id
			JOIN profissional pr ON a.profissional = pr.id
			JOIN procedimentos pd ON a.procedimento = pd.id
			WHERE a.id = @param0
		`, [id]);
		return result.recordset[0] || null;
	}

	async create(agendamentoData) {
		const {
			consultorio,
			procedimento,
			profissional,
			paciente,
			valor_procedimento,
			valor_pagar,
			limite,
			data,
			inicio_vigencia,
			fim_vigencia,
			status,
		} = agendamentoData;

		return transaction(async (t) => {
			const request = t.request();
			request.input('consultorio', sql.VarChar(36), consultorio);
			request.input('procedimento', sql.VarChar(36), procedimento);
			request.input('profissional', sql.VarChar(36), profissional);
			request.input('paciente', sql.VarChar(36), paciente);
			request.input('valor_procedimento', sql.Decimal(10, 2), valor_procedimento);
			request.input('valor_pagar', sql.Decimal(10, 2), valor_pagar);
			request.input('limite', sql.Decimal(10, 2), limite ?? null);
			request.input('data', sql.DateTime2, data);
			request.input('inicio_vigencia', sql.Date, inicio_vigencia ?? null);
			request.input('fim_vigencia', sql.Date, fim_vigencia ?? null);
			request.input('status', sql.VarChar(20), status || 'AGENDADO');

			const result = await request.query(`
				INSERT INTO paciente_agendamento (
					id, consultorio, procedimento, profissional, paciente,
					valor_procedimento, valor_pagar, limite, data, inicio_vigencia, fim_vigencia, status
				)
				OUTPUT INSERTED.*
				VALUES (
					NEWID(), @consultorio, @procedimento, @profissional, @paciente,
					@valor_procedimento, @valor_pagar, @limite, @data, @inicio_vigencia, @fim_vigencia, @status
				)
			`);

			return result.recordset[0];
		});
	}

	async updateStatus(id, status) {
		const result = await query(`
			UPDATE paciente_agendamento
			SET status = @param1
			OUTPUT INSERTED.*
			WHERE id = @param0
		`, [id, status]);
		return result.recordset[0] || null;
	}

	async findByPaciente(pacienteId) {
		const result = await query(`
			SELECT a.*, pr.nome AS profissional_nome, pd.nome AS procedimento_nome
			FROM paciente_agendamento a
			JOIN profissional pr ON a.profissional = pr.id
			JOIN procedimentos pd ON a.procedimento = pd.id
			WHERE a.paciente = @param0
			ORDER BY a.data DESC
		`, [pacienteId]);
		return result.recordset;
	}

	async relatorioProfissionaisAtendimentos({ dataInicio, dataFim, consultorio } = {}) {
		const result = await query(`
			SELECT
				pr.id AS profissional_id,
				pr.nome AS profissional_nome,
				COUNT(a.id) AS total_atendimentos,
				SUM(a.valor_pagar) AS total_valor
			FROM paciente_agendamento a
			JOIN profissional pr ON a.profissional = pr.id
			WHERE (@param0 IS NULL OR a.data >= @param0)
				AND (@param1 IS NULL OR a.data <= @param1)
				AND (@param2 IS NULL OR a.consultorio = @param2)
			GROUP BY pr.id, pr.nome
			ORDER BY total_atendimentos DESC
		`, [dataInicio || null, dataFim || null, consultorio || null]);

		return result.recordset;
	}

	async relatorioFaturamento({ dataInicio, dataFim, consultorio } = {}) {
		const result = await query(`
			SELECT
				CAST(a.data AS DATE) AS dia,
				COUNT(a.id) AS total_agendamentos,
				SUM(a.valor_procedimento) AS valor_bruto,
				SUM(a.valor_pagar) AS valor_liquido
			FROM paciente_agendamento a
			WHERE (@param0 IS NULL OR a.data >= @param0)
				AND (@param1 IS NULL OR a.data <= @param1)
				AND (@param2 IS NULL OR a.consultorio = @param2)
			GROUP BY CAST(a.data AS DATE)
			ORDER BY dia DESC
		`, [dataInicio || null, dataFim || null, consultorio || null]);

		return result.recordset;
	}
}

module.exports = new AgendamentoRepository();
