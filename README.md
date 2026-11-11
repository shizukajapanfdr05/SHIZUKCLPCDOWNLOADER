# Shizuka Craftland Studio PC Downloader

Official desktop build releases and update packages for the Craftland map editor, delivered straight from the publisher's high-speed distribution network.

---

## 🚀 How to Push to GitHub & Deploy on Vercel

### Step 1: Push to GitHub
1. Create a new repository on your GitHub account (e.g. `shizuka-craftland-studio`).
2. Run the following commands in your project terminal:

```bash
git init
git add .
git commit -m "Initial commit of Shizuka Craftland Studio PC Downloader"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

### Step 2: Deploy on Vercel (1-Click)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your repository `shizuka-craftland-studio` and click **"Import"**.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.
6. Within 30 seconds, your website will be live with a free SSL `.vercel.app` domain!

---

## 🛠️ Zero-Error Guarantee on Vercel
- **Preconfigured `vercel.json`**: SPA rewrites and serverless function routing are pre-configured.
- **Serverless API Routes in `/api`**: Works natively on Vercel's Node.js runtime.
- **Client-Side Fallback Engine**: If any serverless route is bypassed, the client automatically pulls directly from Garena's global CDN or uses embedded seed data with zero downtime.
- **Zero Build Warnings**: Clean Vite 8 bundler configuration.
