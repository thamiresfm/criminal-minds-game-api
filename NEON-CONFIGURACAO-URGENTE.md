# 🚀 CONFIGURAÇÃO URGENTE - NEON.TECH DATABASE

## 📋 **PASSOS PARA CONFIGURAR NEON.TECH:**

### **1. 🗄️ Obter Connection String no Neon.tech:**

1. **Acesse:** https://console.neon.tech
2. **Projeto:** `criminal-minds-db`
3. **Clique em:** "Connect" (card "Connect to your database")
4. **Copie:** Connection string PostgreSQL

**Formato esperado:**
```
postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### **2. 🔧 Configurar no Vercel Dashboard:**

**URL:** https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api/settings/environment-variables

**Adicionar variáveis:**
```env
BD_URL=postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=criminal_minds_jwt_secret_2024_secure
NODE_ENV=production
```

### **3. 🔄 Redeploy Obrigatório:**

Após configurar as variáveis:
1. Vá para: https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api/deployments
2. Clique em: "Redeploy" (último deployment)
3. Aguarde: Deploy completar

### **4. 🧪 Teste da API:**

```bash
# Teste rápido
curl https://criminal-minds-game-api.vercel.app/api/health

# Teste completo
node test-api-vercel.js
```

---

## 🎯 **RESULTADO ESPERADO:**

✅ **API Health:** `{"success": true, "status": "healthy"}`  
✅ **Database:** Conectado ao Neon.tech  
✅ **Frontend:** Poderá registrar/login usuários  
✅ **CORS:** Já corrigido anteriormente  

---

## 📊 **STATUS ATUAL:**

❌ **Database:** Connection failed (Retool)  
⏳ **Próximo:** Configurar Neon.tech  
✅ **CORS:** Corrigido  
✅ **API:** Deploy funcionando  

---

## 🔗 **LINKS ÚTEIS:**

- **Neon.tech Console:** https://console.neon.tech
- **Vercel Dashboard:** https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api
- **API Health:** https://criminal-minds-game-api.vercel.app/api/health
- **Frontend:** https://thamiresfm.github.io/criminal-minds-game/

---

**⏰ URGENTE:** Configure as variáveis e faça redeploy para resolver o problema de database! 