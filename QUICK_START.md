# XcT x Team Bot Factory - Quick Start Guide

## 🚀 Deploy to Render in 2 Minutes

### Step 1: Go to Render Dashboard
https://dashboard.render.com

### Step 2: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Choose **"Deploy an existing repository"**

### Step 3: Connect Repository
- Paste this URL: `https://github.com/render-examples/flask-hello-world`
- Or connect your own GitHub repository containing this project
- Select **"main"** branch

### Step 4: Configure Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `bot-factory-pro` |
| **Environment** | `Node` |
| **Region** | `Frankfurt` (or your preference) |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `pnpm start` |
| **Plan** | `Free` (or upgrade) |

### Step 5: Add Environment Variables
Click **"Advanced"** and add:

```
NODE_ENV=production
VITE_APP_TITLE=XcT x Team Bot Factory
VITE_APP_LOGO=https://via.placeholder.com/40
```

### Step 6: Deploy
Click **"Create Web Service"** and wait for deployment to complete (2-5 minutes)

---

## ✅ After Deployment

### Access Your App
- **URL**: https://bot-factory-pro.onrender.com (or your custom domain)
- **Owner Login**: `xCTx_AyOuB` / `owner_password`

### Features Available
- ✅ User Management (Owner Dashboard)
- ✅ Bot Account Management
- ✅ Friend Bot System
- ✅ Commands Editor
- ✅ Process Management

---

## 🔧 Troubleshooting

### Build Fails
**Error**: `pnpm: command not found`
- **Solution**: Render should auto-detect Node.js. Ensure `package.json` exists in root.

### App Won't Start
**Error**: Port already in use
- **Solution**: The app uses `process.env.PORT` automatically. Render assigns the port.

### Can't Login
**Error**: "Invalid credentials"
- **Solution**: 
  - Owner: `xCTx_AyOuB` / `owner_password`
  - Create new users from Owner Dashboard

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **View Logs**: Dashboard → Your Service → Logs
- **Restart Service**: Dashboard → Your Service → Manual Deploy

---

**Version**: 1.0  
**Last Updated**: May 23, 2026
