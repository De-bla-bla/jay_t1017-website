# Deployment Guide for JayT1017 Website

## Quick Start

Your website is now ready for deployment! Here's how to deploy it:

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account (for version control)
- Hosting account (see options below)

## Option 1: Deploy on Railway (Recommended - Free)

### Frontend (Netlify)
1. Push your code to GitHub
2. Go to https://netlify.com
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build command: `cd client && npm run build`
6. Publish directory: `client/dist`
7. Add environment variable:
   - `VITE_API_URL` = your backend API URL

### Backend (Railway)
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your repo
5. Set start command: `node server/index.js`
6. Add environment variables:
   ```
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=your_host
   DB_PORT=5432
   DB_NAME=jayt1017
   ```

## Option 2: Deploy on Vercel (Frontend)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod` in your client folder
3. Follow prompts to connect your GitHub

## Option 3: Deploy on Render (Backend)

1. Go to https://render.com
2. Click "New Web Service"
3. Connect your GitHub
4. Build command: `npm install`
5. Start command: `node server/index.js`
6. Add environment variables

## Database Setup

### Option A: PostgreSQL on Railway
- Railway automatically provisions PostgreSQL
- Use the connection string in your .env

### Option B: PostgreSQL Cloud (Supabase)
1. Go to https://supabase.com
2. Create new project
3. Copy connection string to DATABASE_URL

### Option C: Local PostgreSQL
```bash
# On Windows
# Install PostgreSQL from https://www.postgresql.org/download/windows/

# Create database
createdb jayt1017

# Run initialization
psql jayt1017 < server/config/init.sql
```

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=https://your-backend.com
VITE_ADMIN_USERNAME=JayT1017
VITE_ADMIN_PASSWORD=Ametepe1920@
```

### Backend (.env)
```
PORT=5000
NODE_ENV=production
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=5432
DB_NAME=jayt1017
ADMIN_USERNAME=JayT1017
ADMIN_PASSWORD=Ametepe1920@
API_URL=https://your-backend.com
CLIENT_URL=https://your-frontend.com
```

## Build Commands

```bash
# Install dependencies
npm install
cd client && npm install

# Build frontend
cd client && npm run build

# Run backend locally
node server/index.js

# Run frontend locally
cd client && npm run dev
```

## Deployment Checklist

- [ ] Update `.env` files with production values
- [ ] Set up database and run migrations
- [ ] Change default admin password
- [ ] Update social media links in constants
- [ ] Add real product images to `/assets/merch/`
- [ ] Test login credentials in production
- [ ] Set up CORS properly for your domain
- [ ] Enable HTTPS everywhere
- [ ] Set up backups for database
- [ ] Monitor errors with error tracking service

## Domain Setup

1. Buy domain from: GoDaddy, Namecheap, or Hostinger
2. Point DNS to your hosting provider
3. Set up SSL certificate (automatic on Netlify/Vercel)

## After Deployment

1. Update `VITE_API_URL` in frontend to point to live API
2. Test all functionality:
   - Admin login
   - Add/edit/delete merch
   - Shopping cart
   - WhatsApp integration
3. Monitor performance and logs

## Support

For issues:
- Check server logs: `railway logs` or hosting provider logs
- Check browser console for frontend errors
- Verify API connectivity: visit `https://your-api.com/api/health`

## Security Notes

- Never commit `.env` files with secrets
- Use strong passwords for admin
- Enable 2FA on hosting accounts
- Regular security updates for dependencies
- Monitor unauthorized access attempts
