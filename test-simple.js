// ========================================
// TESTE SIMPLES - RAILWAY DIAGNÓSTICO
// API mínima para identificar problemas específicos
// ========================================

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware básico
app.use(express.json());

// Rota de teste básica (sem Prisma)
app.get('/', (req, res) => {
  res.json({
    message: "Criminal Minds API - Teste Simples",
    status: "ok",
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check básico (sem banco)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    message: "API funcionando - sem banco de dados",
    timestamp: new Date().toISOString(),
    version: "1.0.0-test"
  });
});

// Teste de variáveis de ambiente
app.get('/api/test-env', (req, res) => {
  res.json({
    success: true,
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      JWT_SECRET: process.env.JWT_SECRET ? 'definido' : 'undefined',
      BD_URL: process.env.BD_URL ? 'definido' : 'undefined',
      PORT: PORT
    }
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🧪 API Teste rodando na porta ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT_SECRET: ${process.env.JWT_SECRET ? 'OK' : 'MISSING'}`);
  console.log(`🗄️ BD_URL: ${process.env.BD_URL ? 'OK' : 'MISSING'}`);
});

module.exports = app;