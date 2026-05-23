# XcT x Team Bot Factory - Railway Deployment

## Quick Setup (2 minutes)

### Step 1: Connect GitHub Repository
1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Connect your GitHub account and select: `fpi-sx-ayoub/bot-factory-pro`

### Step 2: Configure Environment
Railway will auto-detect the Node.js project. The build and start commands are already configured in `railway.toml`:

- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`

### Step 3: Add Environment Variables (Optional)
In Railway Dashboard → Variables:
```
NODE_ENV=production
VITE_APP_TITLE=XcT x Team Bot Factory
```

### Step 4: Deploy
Click **"Deploy"** and wait for the build to complete (2-5 minutes)

---

## Features Ready on Railway

✅ Complete authentication system (owner + user management)
✅ Cyberpunk dark theme UI (black + neon green/cyan)
✅ Bot account management with G5.py integration
✅ Friend request system (send/accept/reject/remove)
✅ Bot commands editor with custom commands
✅ Process management for bot lifecycle
✅ JSON-based data persistence
✅ All API endpoints secured

---

## Access Your App

After deployment, Railway will provide you with a public URL:
- **Format**: `https://bot-factory-pro-production.up.railway.app`
- **Login**: `xCTx_AyOuB` / `owner_password`

---

## Troubleshooting

### Build Fails
- Check that `pnpm` is available
- Ensure `package.json` exists in root directory
- View logs in Railway Dashboard

### App Won't Start
- Railway automatically assigns PORT via environment variable
- The app uses `process.env.PORT` correctly
- Check deployment logs for errors

### Database Issues
- JSON storage is local (no external DB required)
- Data persists in `data/` directory during deployment
- Note: Data resets on each new deployment (use external DB for persistence)

---

## Next Steps

1. Test all features after deployment
2. Consider adding external database for data persistence
3. Set up custom domain if needed
4. Monitor application logs in Railway Dashboard

---

**Version**: 1.0  
**Last Updated**: May 23, 2026
