const { sql, query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class UsuarioRepository {
  async findAllAtivos() {
    const result = await query(`
      SELECT u.id, u.nome, u.email, u.status, u.criacao,
             p.nome as perfil_nome, c.fantasia as consultorio_nome
      FROM usuario u
      JOIN perfil p ON u.perfil = p.id
      JOIN consultorio c ON u.consultorio = c.id
      WHERE u.excluido = 0 AND u.suspensao IS NULL
      ORDER BY u.criacao DESC
    `);
    return result.recordset;
  }

  async findById(id) {
    const result = await query(`
      SELECT u.*, p.nome as perfil_nome
      FROM usuario u
      JOIN perfil p ON u.perfil = p.id
      WHERE u.id = @param0 AND u.excluido = 0
    `, [id]);
    return result.recordset[0] || null;
  }

  async findByIdAny(id) {
    const result = await query(`
      SELECT u.*, p.nome as perfil_nome
      FROM usuario u
      JOIN perfil p ON u.perfil = p.id
      WHERE u.id = @param0
    `, [id]);
    return result.recordset[0] || null;
  }

  async findByEmail(email) {
    const result = await query(`
      SELECT u.*, p.nome as perfil_nome
      FROM usuario u
      JOIN perfil p ON u.perfil = p.id
      WHERE u.email = @param0 AND u.excluido = 0
    `, [email]);
    return result.recordset[0] || null;
  }

  async create(usuarioData) {
    const { consultorio, nome, email, senha, perfil, criado_por, cro, telefone } = usuarioData;

    return transaction(async (t) => {
      const id = uuidv4();
      const request = t.request();

      request.input('id', sql.VarChar(36), id);
      request.input('consultorio', sql.VarChar(36), consultorio);
      request.input('nome', sql.NVarChar(100), nome);
      request.input('email', sql.VarChar(100), email);
      request.input('senha', sql.VarChar(255), senha);
      request.input('perfil', sql.VarChar(36), perfil);
      request.input('criado_por', sql.VarChar(36), criado_por);
      request.input('cro', sql.VarChar(6), cro || null);
      request.input('telefone', sql.VarChar(20), telefone || null);

      await request.query(`
        INSERT INTO usuario (id, consultorio, nome, email, senha, perfil, criado_por, cro, telefone, primeiro_acesso)
        VALUES (@id, @consultorio, @nome, @email, @senha, @perfil, @criado_por, @cro, @telefone, 1)
      `);

      const selectResult = await t.request()
        .input('id', sql.VarChar(36), id)
        .query(`
          SELECT u.*, p.nome as perfil_nome
          FROM usuario u
          JOIN perfil p ON u.perfil = p.id
          WHERE u.id = @id
        `);

      return selectResult.recordset[0] || null;
    });
  }

  async update(id, updateData) {
    const camposPermitidos = ['nome', 'email', 'telefone', 'status', 'cro', 'avatar', 'configuracoes'];
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

    const queryString = `
      UPDATE usuario
      SET ${updates.join(', ')}, atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `;

    await query(queryString, params);
    return this.findById(id);
  }

  async softDelete(id, motivo = null) {
    await query(`
      UPDATE usuario
      SET excluido = 1,
          exclusao = GETDATE(),
          status = 'EXCLUIDO',
          suspensao_motivo = ISNULL(@param1, suspensao_motivo)
      WHERE id = @param0
    `, [id, motivo]);

    return this.findByIdAny(id);
  }

  async suspender(id, motivo) {
    await query(`
      UPDATE usuario
      SET suspensao = GETDATE(),
          suspensao_motivo = @param1,
          status = 'SUSPENSO'
      WHERE id = @param0 AND excluido = 0
    `, [id, motivo]);

    return this.findById(id);
  }
}

module.exports = new UsuarioRepository();
