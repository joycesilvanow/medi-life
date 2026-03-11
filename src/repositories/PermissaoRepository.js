const { sql, query, transaction } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PermissaoRepository {
  async findAll() {
    const result = await query(`
      SELECT *
      FROM permissoes
      WHERE excluido = 0
      ORDER BY criacao DESC
    `);
    return result.recordset;
  }

  async findById(id) {
    const result = await query(`
      SELECT *
      FROM permissoes
      WHERE id = @param0 AND excluido = 0
    `, [id]);
    return result.recordset[0] || null;
  }

  async findByIdAny(id) {
    const result = await query(`
      SELECT *
      FROM permissoes
      WHERE id = @param0
    `, [id]);
    return result.recordset[0] || null;
  }

  async findByPerfil(perfilId) {
    const result = await query(`
      SELECT *
      FROM permissoes
      WHERE perfil = @param0 AND excluido = 0
      ORDER BY criacao DESC
    `, [perfilId]);
    return result.recordset;
  }

  async create(data) {
    const {
      nome,
      perfil,
      criar,
      editar,
      visualizar,
      excluir,
      atualizar,
      imprimir,
      status,
      criado_por,
      atualizado_por,
      request_id,
    } = data;

    return transaction(async (t) => {
      const id = uuidv4();
      const request = t.request();
      request.input('id', sql.VarChar(36), id);
      request.input('nome', sql.NVarChar(100), nome);
      request.input('perfil', sql.VarChar(36), perfil);
      request.input('criar', sql.VarChar(50), criar || null);
      request.input('editar', sql.VarChar(50), editar || null);
      request.input('visualizar', sql.VarChar(50), visualizar || null);
      request.input('excluir', sql.VarChar(50), excluir || null);
      request.input('atualizar', sql.VarChar(50), atualizar || null);
      request.input('imprimir', sql.VarChar(50), imprimir || null);
      request.input('status', sql.VarChar(20), status || 'ATIVO');
      request.input('criado_por', sql.VarChar(36), criado_por || null);
      request.input('atualizado_por', sql.VarChar(36), atualizado_por || null);
      request.input('request_id', sql.VarChar(36), request_id || null);

      await request.query(`
        INSERT INTO permissoes (
          id, nome, perfil, criar, editar, visualizar, excluir, atualizar, imprimir,
          status, criado_por, atualizado_por, request_id
        )
        VALUES (
          @id, @nome, @perfil, @criar, @editar, @visualizar, @excluir, @atualizar, @imprimir,
          @status, @criado_por, @atualizado_por, @request_id
        )
      `);

      const selectResult = await t.request()
        .input('id', sql.VarChar(36), id)
        .query('SELECT * FROM permissoes WHERE id = @id');

      return selectResult.recordset[0] || null;
    });
  }

  async update(id, updateData) {
    const camposPermitidos = [
      'nome',
      'perfil',
      'criar',
      'editar',
      'visualizar',
      'excluir',
      'atualizar',
      'imprimir',
      'status',
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
      UPDATE permissoes
      SET ${updates.join(', ')}, atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `, params);

    return this.findById(id);
  }

  async softDelete(id) {
    await query(`
      UPDATE permissoes
      SET excluido = 1, exclusao = GETDATE(), status = 'EXCLUIDO', atualizacao = GETDATE()
      WHERE id = @param0 AND excluido = 0
    `, [id]);

    return this.findByIdAny(id);
  }
}

module.exports = new PermissaoRepository();
