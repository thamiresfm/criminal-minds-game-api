# 🔧 CONFIGURAÇÃO VERCEL - VARIÁVEIS DE AMBIENTE

## 📋 **VARIÁVEIS NECESSÁRIAS:**

### **1️⃣ DATABASE_URL:**
```
postgresql://retool:npg_XgRpvi3F1TrU@ep-summer-dust-a6donxpr.us-west-2.retooldb.com/retool?sslmode=require
```
> **Nota:** O Prisma usa automaticamente `DATABASE_URL` por padrão

### **2️⃣ JWT_SECRET:**
```
criminal_minds_jwt_secret_2024_secure
```

### **3️⃣ NODE_ENV:**
```
production
```

---

## 🎯 **PASSOS NO VERCEL DASHBOARD:**

### **1. Acessar Environment Variables:**
- URL: https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api/settings/environment-variables

### **2. Adicionar Variáveis:**
1. **Clique em:** "Add New"
2. **Nome:** `DATABASE_URL`
3. **Valor:** `postgresql://retool:npg_XgRpvi3F1TrU@ep-summer-dust-a6donxpr.us-west-2.retooldb.com/retool?sslmode=require`
4. **Environment:** Production
5. **Clique:** "Save"

### **3. Repetir para outras variáveis:**
- **JWT_SECRET:** `criminal_minds_jwt_secret_2024_secure`
- **NODE_ENV:** `production`

### **4. Redeploy Obrigatório:**
1. Vá para: https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api/deployments
2. Clique em: "Redeploy" (último deployment)
3. Aguarde: Deploy completar

---

## 🧪 **TESTE APÓS CONFIGURAÇÃO:**

```bash
# Teste rápido
curl https://criminal-minds-game-api.vercel.app/api/health

# Resultado esperado:
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-08-04T..."
}
```

---

## 📊 **STATUS ESPERADO:**

✅ **API Health:** `{"success": true, "status": "healthy"}`  
✅ **Database:** Conectado ao PostgreSQL  
✅ **Frontend:** Poderá registrar/login usuários  
✅ **CORS:** Já corrigido anteriormente  

---

## 🔗 **LINKS ÚTEIS:**

- **Vercel Dashboard:** https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api
- **Environment Variables:** https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api/settings/environment-variables
- **Deployments:** https://vercel.com/thamires-projects-268579ec/criminal-minds-game-api/deployments
- **API Health:** https://criminal-minds-game-api.vercel.app/api/health

---

**⏰ URGENTE:** Configure as variáveis e faça redeploy para resolver o problema de database! 