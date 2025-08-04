// ========================================
// CRIMINAL MINDS GAME - API MELHORADA v2.0
// Servidor Express otimizado para o jogo
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
// MIDDLEWARES MELHORADOS
// ========================================

// Segurança otimizada
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// CORS otimizado para produção e desenvolvimento
app.use(cors({
  origin: [
    'https://thamiresfm.github.io',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'X-API-Version', 'X-Client']
}));

// Headers de resposta otimizados
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Criminal-Minds-API');
  res.setHeader('X-API-Version', '2.0.0');
  next();
});

