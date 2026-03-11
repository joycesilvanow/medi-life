// src/config/database.js
const sql = require('mssql');

const rawServer = process.env.DB_SERVER || 'localhost';
const serverParts = rawServer.split('\\');
const serverName = serverParts[0];
const instanceName = process.env.DB_INSTANCE || (serverParts.length > 1 ? serverParts[1] : undefined);
const parsedPort = Number.parseInt(process.env.DB_PORT, 10);

const config = {
  server: serverName,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
    enableArithAbort: true,
    ...(instanceName ? { instanceName } : {}),
    },
  pool: {
    max: Number.parseInt(process.env.DB_POOL_MAX, 10) || 20,
    min: Number.parseInt(process.env.DB_POOL_MIN, 10) || 2,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
  ...(!instanceName && Number.isInteger(parsedPort) ? { port: parsedPort } : {}),
};

let pool = null;

async function connect() {
  if (pool) return pool;
  pool = await new sql.ConnectionPool(config).connect();
  const destino = instanceName ? `${serverName}\\${instanceName}` : `${serverName}:${config.port || 1433}`;
  console.log(`[MSSQL] Conectado ao SQL Server - ${destino}`);
  pool.on('error', (err) => {
    console.error('[MSSQL] Erro no pool:', err.message);
    pool = null;
  });
  return pool;
}

async function getConnection() {
  if (!pool) await connect();
  return pool;
}

async function close() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('[MSSQL] Conexão fechada');
  }
}

async function query(queryString, params = []) {
  const conn = await getConnection();
  const request = conn.request();
  params.forEach((param, index) => request.input(`param${index}`, param));
  return request.query(queryString);
}

async function transaction(callback) {
  const conn = await getConnection();
  const tx = new sql.Transaction(conn);
  try {
    await tx.begin();
    const result = await callback(tx);
    await tx.commit();
    return result;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

module.exports = { sql, connect, getConnection, close, query, transaction };