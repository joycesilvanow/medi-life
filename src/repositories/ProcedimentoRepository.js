const { sql, query, transaction } = require('../config/database');

class ProcedimentoRepository {
  async findAll() {
    const result = await query(`
      SELECT *
      FROM procedimentos
      WHERE excluido = 0
      ORDER BY nome ASC
    `);
    return result.recordset;
  }

  async findById(id) {
    const result = await query(`
      SELECT *
      FROM procedimentos
      WHERE id = @param0 AND excluido = 0
    `, [id]);
    return result.recordset[0] || null;
  }

  async findByNome(nome) {
    const result = await query(`
      SELECT *
      FROM procedimentos
      WHERE nome = @param0 AND excluido = 0
    `, [nome]);
    return result.recordset[0] || null;
  }

  async create(data) {
    const { nome } = data;

    return transaction(async (t) => {
      const request = t.request();
      request.input('nome', sql.NVarChar(200), nome);

      const result = await request.query(`
        INSERT INTO procedimentos (id, nome)
        OUTPUT INSERTED.*
        VALUES (NEWID(), @nome)
      `);

      return result.recordset[0];
    });
  }

  async update(id, updateData) {
    const camposPermitidos = ['nome'];
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

    const result = await query(`
      UPDATE procedimentos
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @param0 AND excluido = 0
    `, params);

    return result.recordset[0] || null;
  }

  async suspender(id, motivo) {
    const result = await query(`
      UPDATE procedimentos
      SET suspensao = GETDATE(), suspensao_motivo = @param1
      OUTPUT INSERTED.*
      WHERE id = @param0 AND excluido = 0
    `, [id, motivo]);

    return result.recordset[0] || null;
  }

  async softDelete(id) {
    const result = await query(`
      UPDATE procedimentos
      SET excluido = 1, exclusao = GETDATE()
      OUTPUT INSERTED.*
      WHERE id = @param0 AND excluido = 0
    `, [id]);

    return result.recordset[0] || null;
  }
}

module.exports = new ProcedimentoRepository();
