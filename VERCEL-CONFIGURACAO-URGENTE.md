# 🚨 VERCEL - CONFIGURAÇÃO URGENTE DAS VARIÁVEIS

## 🎯 **PROBLEMA ATUAL:**
```
"Database connection failed" 
```

## 🔗 **LINK DIRETO:**
https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api/settings/environment-variables

---

## 📋 **CHECKLIST - SIGA EXATAMENTE:**

### **✅ 1. FAZER LOGIN NO VERCEL**
- Acesse o link acima
- Faça login com GitHub/Google/Email

### **✅ 2. OBTER BD_URL ATUALIZADA**

#### **ACESSE NEON.TECH:**
1. https://console.neon.tech/
2. Login → Selecione projeto `criminal-minds-game`
3. **Dashboard** → **Connection Details**
4. **Copie** a connection string que deve ser algo como:
```
postgresql://user:password@ep-xxxxx.us-west-2.aws.neon.tech/neondb?sslmode=require
```

### **✅ 3. CONFIGURAR VARIÁVEIS NO VERCEL**

#### **BD_URL:**
- **Nome:** `BD_URL`
- **Valor:** Cole a string do Neon.tech
- **Environment:** `Production, Preview, Development`

#### **JWT_SECRET:**
- **Nome:** `JWT_SECRET` 
- **Valor:** `criminal_minds_jwt_secret_2024_secure`
- **Environment:** `Production, Preview, Development`

#### **NODE_ENV:**
- **Nome:** `NODE_ENV`
- **Valor:** `production`
- **Environment:** `Production`

### **✅ 4. REDEPLOY OBRIGATÓRIO**
1. **Vá para:** `Deployments` tab
2. **Último deploy** → clique nos `...`
3. **Selecione:** `Redeploy`
4. **Aguarde:** 2-3 minutos

---

## 🧪 **TESTE FINAL**

Após redeploy, teste:
```bash
curl https://criminal-minds-game-api.vercel.app/api/health
```

**Esperado:**
```json
{
  "success": true,
  "status": "healthy", 
  "database": "connected"
}
```

---

## 📞 **SE DER ERRO:**

### **Verificar no Neon.tech:**
- Database está **Active**?
- Connection string está **correta**?
- **Não há** caracteres especiais mal escaped?

### **Verificar no Vercel:**
- Todas as 3 variáveis foram **salvas**?
- **Redeploy** foi feito após salvar?
- **Logs** mostram algum erro?

---

## 🎯 **RESULTADO ESPERADO:**

✅ **API Health:** "database": "connected"  
✅ **Login/Cadastro:** Funcionando  
✅ **Dados persistem:** No PostgreSQL Neon  

**🚀 Assim que configurar, teste imediatamente!**