#!/usr/bin/env node

const https = require('https');

const API_URL = 'https://criminal-minds-game-api.vercel.app/api';

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script/1.0'
      }
    };

    if (data && method !== 'GET') {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  log('\n🔍 TESTANDO API CRIMINAL MINDS...', 'cyan');
  log('=' * 50, 'blue');
  
  try {
    // Test 1: Health Check
    log('\n1️⃣ TESTE: Health Check', 'yellow');
    const healthResponse = await makeRequest('/health');
    
    if (healthResponse.status === 200) {
      log('✅ Health Check: SUCESSO', 'green');
      log(`📊 Status: ${healthResponse.data.status}`, 'blue');
      
      if (healthResponse.data.success && healthResponse.data.status === 'healthy') {
        log('🎉 DATABASE: CONECTADO!', 'green');
      } else {
        log('❌ DATABASE: FALHOU', 'red');
        log(`💬 Erro: ${healthResponse.data.error || 'N/A'}`, 'red');
      }
    } else {
      log(`❌ Health Check falhou: ${healthResponse.status}`, 'red');
    }
    
    // Test 2: Register endpoint
    log('\n2️⃣ TESTE: Endpoint Register', 'yellow');
    const testUser = {
      username: `teste_${Date.now()}`,
      email: `teste${Date.now()}@example.com`,
      password: 'teste123'
    };
    
    try {
      const registerResponse = await makeRequest('/auth/register', 'POST', testUser);
      
      if (registerResponse.status === 201) {
        log('✅ Register: FUNCIONANDO', 'green');
        log(`👤 Usuário criado: ${testUser.username}`, 'blue');
      } else if (registerResponse.status === 409) {
        log('⚠️ Register: Usuário já existe (OK)', 'yellow');
      } else {
        log(`❌ Register falhou: ${registerResponse.status}`, 'red');
        log(`💬 Resposta: ${JSON.stringify(registerResponse.data)}`, 'red');
      }
    } catch (regError) {
      log(`❌ Erro no register: ${regError.message}`, 'red');
    }
    
    // Test 3: Login endpoint  
    log('\n3️⃣ TESTE: Endpoint Login', 'yellow');
    try {
      const loginResponse = await makeRequest('/auth/login', 'POST', {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.status === 200) {
        log('✅ Login: FUNCIONANDO', 'green');
        log('🔐 JWT Token recebido!', 'blue');
      } else {
        log(`❌ Login falhou: ${loginResponse.status}`, 'red');
        log(`💬 Resposta: ${JSON.stringify(loginResponse.data)}`, 'red');
      }
    } catch (loginError) {
      log(`❌ Erro no login: ${loginError.message}`, 'red');
    }

  } catch (error) {
    log(`\n💥 ERRO GERAL: ${error.message}`, 'red');
  }

  log('\n' + '=' * 50, 'blue');
  log('🏁 TESTE CONCLUÍDO', 'cyan');
}

// Executar teste
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI, makeRequest };