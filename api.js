// ========================================
// CRIMINAL MINDS GAME - API SERVER
// Servidor Express para conectar HTMLs ao PostgreSQL Retool
// ========================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ========================================
// CONFIGURAÇÃO DO SERVIDOR
// ========================================

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'criminal_minds_jwt_secret_2024';

// Inicializar Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
  errorFormat: 'colorless'
});

// ========================================
// MIDDLEWARES
// ========================================

// Segurança
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS - permitir requisições do frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://thamiresfm.github.io',
    /https:\/\/.*\.github\.io$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por janela
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.',
    code: 'TOO_MANY_REQUESTS'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 tentativas de login por IP por janela
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'TOO_MANY_AUTH_ATTEMPTS'
  }
});

app.use(limiter);
app.use('/api/auth', authLimiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// UTILITÁRIOS
// ========================================

// Função para gerar JWT
function generateToken(userId) {
  return jwt.sign(
    { userId: userId, timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware para verificar JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token de acesso requerido' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Token inválido ou expirado' 
      });
    }
    req.user = user;
    next();
  });
}

// ========================================
// ROTAS DA API
// ========================================

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    // Testar conexão com banco
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// ========================================
// ROTAS DE AUTENTICAÇÃO
// ========================================

// Registro de usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, detectiveName, gameCode } = req.body;

    // Validações
    if (!email || !password || !fullName || !detectiveName) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Validar senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Verificar se nome de detetive já existe
    const existingDetectiveName = await prisma.user.findUnique({
      where: { detectiveName: detectiveName }
    });

    if (existingDetectiveName) {
      return res.status(409).json({
        success: false,
        error: 'Nome de detetive já em uso'
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar usuário com transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          fullName,
          detectiveName,
          gameCode: gameCode || null,
          emailVerified: false,
          isActive: true
        }
      });

      // Criar estatísticas iniciais
      await tx.gameStats.create({
        data: {
          userId: user.id,
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          totalScore: 0,
          cardsCollected: 0,
          bestTimeSeconds: 0,
          favoriteMode: 'cards',
          comboStreakRecord: 0,
          evidencesFound: 0,
          suspectsInterrogated: 0,
          locationsInvestigated: 0,
          totalPlaytimeMinutes: 0,
          achievementsUnlocked: 0,
          rankLevel: 1,
          rankPoints: 0
        }
      });

      return user;
    });

    // Gerar token JWT
    const token = generateToken(result.id);

    console.log('✅ Usuário registrado:', result.email);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user: {
        id: result.id,
        email: result.email,
        fullName: result.fullName,
        detectiveName: result.detectiveName,
        gameCode: result.gameCode
      },
      token
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Login de usuário
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        gameStats: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Conta desativada'
      });
    }

    // Verificar senha
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }

    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Gerar token JWT
    const token = generateToken(user.id);

    console.log('✅ Login realizado:', user.email);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        detectiveName: user.detectiveName,
        gameCode: user.gameCode,
        stats: user.gameStats
      },
      token
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar token (rota protegida)
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        gameStats: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        detectiveName: user.detectiveName,
        gameCode: user.gameCode,
        stats: user.gameStats
      }
    });

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ========================================
// ROTAS DE DADOS DO JOGO
// ========================================

// Atualizar dados do jogo (rota protegida)
app.post('/api/game/update', authenticateToken, async (req, res) => {
  try {
    const { action, data } = req.body;
    const userId = req.user.userId;

    // Atualizar baseado na ação
    switch (action) {
      case 'save_progress':
        // Implementar salvamento de progresso
        break;
      case 'update_stats':
        // Implementar atualização de estatísticas
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Ação inválida'
        });
    }

    res.json({
      success: true,
      message: 'Dados atualizados com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro na atualização:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ========================================
// TRATAMENTO DE ERROS
// ========================================

// 404 - Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Error handler global
app.use((error, req, res, next) => {
  console.error('❌ Erro global:', error);
  
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      details: error.message,
      stack: error.stack 
    })
  });
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================

// Função para inicializar o servidor
async function startServer() {
  try {
    // Testar conexão com banco
    await prisma.$connect();
    console.log('✅ Conexão com PostgreSQL Retool estabelecida');

    // Inicializar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 API Server rodando na porta ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📡 CORS configurado para GitHub Pages`);
      console.log(`🔐 JWT Secret configurado`);
      console.log(`🗄️ Banco PostgreSQL Retool conectado via Prisma`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🛑 Recebido SIGTERM, fechando servidor...');
      server.close(() => {
        console.log('✅ Servidor HTTP fechado');
        prisma.$disconnect().then(() => {
          console.log('✅ Conexão PostgreSQL fechada');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// Inicializar apenas se executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = app;