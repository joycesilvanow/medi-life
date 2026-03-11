// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connect, close } = require('./src/config/database');

const app = express();
let dbConnected = false;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas (exemplo)
app.use('/api/usuarios', require('./src/routes/usuarioRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/consultorios', require('./src/routes/consultorioRoutes'));
app.use('/api/perfis', require('./src/routes/perfilRoutes'));
app.use('/api/permissoes', require('./src/routes/permissaoRoutes'));
app.use('/api/profissionais', require('./src/routes/profissionalRoutes'));
app.use('/api/pacientes', require('./src/routes/pacienteRoutes'));
app.use('/api/procedimentos', require('./src/routes/procedimentoRoutes'));
app.use('/api/agendamentos', require('./src/routes/agendamentoRoutes'));
app.use('/api/relatorios', require('./src/routes/relatorioRoutes'));

// Health check
app.get('/health', async (req, res) => {
  try {
    await connect();
    dbConnected = true;
    res.json({ status: 'OK', database: 'Conectado' });
  } catch (err) {
    dbConnected = false;
    res.status(503).json({ status: 'OK', database: `Indisponível: ${err.message}` });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, fechando conexões...');
  await close();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

// Iniciar servidor após conectar ao banco
async function start() {
  try {
    await connect();
    dbConnected = true;
    app.listen(PORT, () => {
      console.log(` Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    dbConnected = false;
    if (process.env.NODE_ENV !== 'production') {
      console.warn(' Banco indisponível no startup (modo não-produção). API iniciada sem conexão com DB.');
      console.warn(` Motivo: ${err.message}`);
      app.listen(PORT, () => {
        console.log(` Servidor rodando na porta ${PORT} (sem DB)`);
      });
      return;
    }

    console.error(' Falha ao iniciar servidor:', err);
    process.exit(1);
  }
}

start();