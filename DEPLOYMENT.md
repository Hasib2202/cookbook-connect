# 🚀 Deployment Guide: CookBook Connect on Vercel

## Prerequisites
- [ ] Vercel account
- [ ] GitHub repository
- [ ] PostgreSQL database (Vercel Postgres recommended)
- [ ] Gmail account with App Password
- [ ] Cloudinary account

## Step 1: Prepare Database

### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create new project or go to your project
3. Go to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Copy the `DATABASE_URL` from the `.env.local` tab

### Option B: External PostgreSQL
Use any PostgreSQL provider (Supabase, Railway, PlanetScale, etc.)

## Step 2: Set Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```bash
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# NextAuth.js
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Email (Gmail SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## Step 3: Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 4: Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings
3. Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Use this password (not your regular Gmail password)

## Step 5: Deploy to Vercel

### Method 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Deploy!

### Method 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Step 6: Post-Deployment

1. **Verify database schema**: The build process will run `prisma db push`
2. **Test registration**: Try registering a new user
3. **Test email verification**: Check if emails are sent
4. **Test authentication**: Login with verified account

## Troubleshooting

### Build Errors
- **Prisma issues**: Make sure `DATABASE_URL` is set correctly
- **Missing dependencies**: Check all packages are in `dependencies`, not `devDependencies`

### Runtime Errors
- **Database connection**: Verify `DATABASE_URL` format
- **Email not sending**: Check Gmail app password and 2FA setup
- **Authentication issues**: Verify `NEXTAUTH_URL` matches your domain

### Performance
- Images are handled by Cloudinary (CDN)
- Database queries are optimized with Prisma
- Static files served by Vercel's CDN

## Environment Variable Checklist

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your production domain
- [ ] `NEXTAUTH_SECRET` - Random 32+ character string
- [ ] `EMAIL_USER` - Gmail address
- [ ] `EMAIL_PASS` - Gmail app password
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Domain Setup

1. **Custom Domain**: Add your domain in Vercel project settings
2. **HTTPS**: Automatically provided by Vercel
3. **CDN**: Global edge network included

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Logs**: View real-time logs in Vercel dashboard
- **Error tracking**: Check Functions tab for errors

## Scaling

- **Database**: Vercel Postgres scales automatically
- **Serverless Functions**: Auto-scaling based on demand
- **CDN**: Global distribution included

---

🎉 **Your CookBook Connect app should now be live!**

Visit your deployment URL and test all features:
- User registration & email verification
- Recipe creation & management  
- Image uploads
- Authentication flow
