# XcT x Team Bot Factory - Render Deployment Guide

## Quick Start

### 1. Prerequisites
- Render Account (https://render.com)
- GitHub Account with repository access
- Render API Token: `rnd_6MG2NJFOgwAxFtJagqDISXFRuPJ3`

### 2. Create New Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository"**
4. Connect your GitHub repository containing this project
5. Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `bot-factory-pro` |
| **Environment** | `Node` |
| **Region** | `Frankfurt` (or your preferred region) |
| **Branch** | `main` |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `pnpm start` |
| **Plan** | `Free` (or upgrade as needed) |

### 3. Configure Environment Variables

Add the following environment variables in the Render dashboard:

```
NODE_ENV=production
VITE_APP_TITLE=XcT x Team Bot Factory
VITE_APP_LOGO=https://via.placeholder.com/40
```

**Note**: Other environment variables (JWT_SECRET, OAUTH_SERVER_URL, etc.) are automatically injected by Manus platform.

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your application
3. Once deployment is complete, your app will be available at:
   - `https://bot-factory-pro.onrender.com` (or your custom domain)

### 5. Verify Deployment

Visit your deployed URL and verify:
- ✅ Login page loads
- ✅ Owner login works with credentials: `xCTx_AyOuB` / `owner_password`
- ✅ Dashboard displays correctly
- ✅ All features are accessible

## Troubleshooting

### Build Fails
- Check that `pnpm` is installed: `npm install -g pnpm`
- Verify all dependencies: `pnpm install`
- Check build output in Render logs

### App Won't Start
- Verify `pnpm start` command works locally
- Check that port is not hardcoded (should use `process.env.PORT`)
- Review server logs in Render dashboard

### Environment Variables Not Working
- Ensure variables are set in Render dashboard (not in `.env` file)
- Restart the service after updating variables
- Check that variable names match exactly

## Production Checklist

- [ ] All environment variables configured
- [ ] Database connection tested (if applicable)
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place

## Support

For issues or questions:
1. Check Render logs: Dashboard → Your Service → Logs
2. Review application logs: `.manus-logs/devserver.log`
3. Test locally: `pnpm dev`

---

**Last Updated**: May 23, 2026
**Version**: 1.0
