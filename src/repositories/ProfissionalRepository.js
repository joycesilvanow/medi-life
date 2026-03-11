const { sql, query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ProfissionalRepository {
  async findAll() {
    const result = await query(`
      SELECT *
      FROM profissional
      WHERE excluido = 0
      ORDER BY criacao DESC
    `);
    return result.recordset;
  }

  async findByConsultorio(consultorioId) {
    const result = await query(`
      SELECT *
      FROM profissional
      WHERE consultorio = @param0 AND excluido = 0
      ORDER BY criacao DESC
    `, [consultorioId]);
    return result.recordset;
  }

  async findById(id) {
    const result = await query(`
      SELECT *
      FROM profissional
      WHERE id = @param0 AND excluido = 0
    `, [id]);
    return result.recordset[0] || null;
  }

  async findByIdAny(id) {
    const result = await query(`
      SELECT *
      FROM profissional
      WHERE id = @param0
    `, [id]);
    return result.recordset[0] || null;
  }

  async create(data) {
    const {
      consultorio,
      usuario,
      nome,
      cpf,
      cro,
      telefone,
      nascimento,
      rg,
      email,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      criado_por,
      atualizado_por,
      request_id,
    } = data;

    return transaction(async (t) => {
      const id = uuidv4();
      const request = t.request();
      request.input('id', sql.VarChar(36), id);
      request.input('consultorio', sql.VarChar(36), consultorio);
      request.input('usuario', sql.VarChar(36), usuario || null);
      request.input('nome', sql.NVarChar(100), nome);
      request.input('cpf', sql.VarChar(14), cpf || null);
      request.input('cro', sql.VarChar(6), cro || null);
      request.input('telefone', sql.VarChar(20), telefone || null);
      request.input('nascimento', sql.Date, nascimento || null);
      request.input('rg', sql.VarChar(20), rg || null);
      request.input('email', sql.VarChar(100), email || null);
      request.input('cep', sql.VarChar(9), cep || null);
      request.input('endereco', sql.NVarChar(200), endereco || null);
      request.input('numero', sql.VarChar(20), numero || null);
      request.input('complemento', sql.NVarChar(100), complemento || null);
      request.input('bairro', sql.NVarChar(100), bairro || null);
      request.input('cidade', sql.NVarChar(100), cidade || null);
      request.input('estado', sql.VarChar(2), estado || null);
      request.input('criado_por', sql.VarChar(36), criado_por || null);
      request.input('atualizado_por', sql.VarChar(36), atualizado_por || null);
      request.input('request_id', sql.VarChar(36), request_id || null);

      await request.query(`
        INSERT INTO profissional (
          id, consultorio, usuario, nome, cpf, cro, telefone, nascimento, rg, email,
          cep, endereco, numero, complemento, bairro, cidade, estado,
          criado_por, atualizado_por, request_id
        )
        VALUES (
          @id, @consultorio, @usuario, @nome, @cpf, @cro, @telefone, @nascimento, @rg, @email,
          @cep, @endereco, @numero, @complemento, @bairro, @cidade, @estado,
          @criado_por, @atualizado_por, @request_id
        )
      `);

      const selectResult = await t.request()
        .input('id', sql.VarChar(36), id)
        .query('SELECT * FROM profissional WHERE id = @id');

      return selectResult.recordset[0] || null;
    });
  }

  async update(id, updateData) {
    const camposPermitidos = [
      'usuario',
      'nome',
      'cpf',
      'cro',
      'telefone',
      'nascimento',
      'rg',
      'email',
      'cep',
      'endereco',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'atualizado_por',
      'request_id',
    ];

    const updates = [];
    const params = [id];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (camposPermitidos.includes(key) && value !== undefined) {
        updates.push(`${key} = @param${paramIndex}`);
        params.push(value);
        paramIndex += 1;
      }
    }

    if (updates.length === 0) return null;

    await query(`
      UPDATE profissional
      SET ${updates.join(', ')}, atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `, params);

    return this.findById(id);
  }

  async suspender(id, motivo) {
    await query(`
      UPDATE profissional
      SET suspensao = GETDATE(), suspensao_motivo = @param1, atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `, [id, motivo]);

    return this.findById(id);
  }

  async softDelete(id) {
    await query(`
      UPDATE profissional
      SET excluido = 1, exclusao = GETDATE(), atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `, [id]);

    return this.findByIdAny(id);
  }
}

module.exports = new ProfissionalRepository();
