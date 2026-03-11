const { sql, query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ConsultorioRepository {
  async findAll() {
    const result = await query(`
      SELECT *
      FROM consultorio
      WHERE excluido = 0
      ORDER BY criacao DESC
    `);
    return result.recordset;
  }

  async findById(id) {
    const result = await query(`
      SELECT *
      FROM consultorio
      WHERE id = @param0 AND excluido = 0
    `, [id]);
    return result.recordset[0] || null;
  }

  async findByIdAny(id) {
    const result = await query(`
      SELECT *
      FROM consultorio
      WHERE id = @param0
    `, [id]);
    return result.recordset[0] || null;
  }

  async create(data) {
    const {
      razao,
      fantasia,
      cnpj,
      cro,
      telefone,
      email,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      atualizado_por,
    } = data;

    return transaction(async (t) => {
      const id = uuidv4();
      const request = t.request();
      request.input('id', sql.VarChar(36), id);
      request.input('razao', sql.NVarChar(200), razao);
      request.input('fantasia', sql.NVarChar(200), fantasia || null);
      request.input('cnpj', sql.VarChar(18), cnpj || null);
      request.input('cro', sql.VarChar(6), cro || null);
      request.input('telefone', sql.VarChar(20), telefone || null);
      request.input('email', sql.VarChar(100), email || null);
      request.input('cep', sql.VarChar(9), cep || null);
      request.input('endereco', sql.NVarChar(200), endereco || null);
      request.input('numero', sql.VarChar(20), numero || null);
      request.input('complemento', sql.NVarChar(100), complemento || null);
      request.input('bairro', sql.NVarChar(100), bairro || null);
      request.input('cidade', sql.NVarChar(100), cidade || null);
      request.input('estado', sql.VarChar(2), estado || null);
      request.input('atualizado_por', sql.VarChar(36), atualizado_por || null);

      await request.query(`
        INSERT INTO consultorio (
          id, razao, fantasia, cnpj, cro, telefone, email, cep, endereco, numero,
          complemento, bairro, cidade, estado, atualizado_por
        )
        VALUES (
          @id, @razao, @fantasia, @cnpj, @cro, @telefone, @email, @cep, @endereco, @numero,
          @complemento, @bairro, @cidade, @estado, @atualizado_por
        )
      `);

      const selectResult = await t.request()
        .input('id', sql.VarChar(36), id)
        .query('SELECT * FROM consultorio WHERE id = @id');

      return selectResult.recordset[0] || null;
    });
  }

  async update(id, updateData) {
    const camposPermitidos = [
      'razao',
      'fantasia',
      'cnpj',
      'cro',
      'telefone',
      'email',
      'cep',
      'endereco',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'atualizado_por',
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
      UPDATE consultorio
      SET ${updates.join(', ')}, atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `, params);

    return this.findById(id);
  }

  async softDelete(id) {
    await query(`
      UPDATE consultorio
      SET excluido = 1, exclusao = GETDATE(), atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `, [id]);

    return this.findByIdAny(id);
  }
}

module.exports = new ConsultorioRepository();
