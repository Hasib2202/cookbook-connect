# 🚀 Vercel Deployment Guide for Cookbook Connect

## Step-by-Step Deployment Instructions

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
npm i -g vercel
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### 3. Set Up Database (Vercel Postgres)

1. In your Vercel project dashboard, go to "Storage" tab
2. Click "Create Database" → "Postgres"
3. Choose the free "Hobby" plan
4. Copy the generated `DATABASE_URL`

### 4. Configure Environment Variables

In your Vercel project dashboard, go to "Settings" → "Environment Variables" and add:

```
DATABASE_URL=postgresql://your_postgres_url_here
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-long-secret-key-here
CLOUDINARY_CLOUD_NAME=dksekryws
CLOUDINARY_API_KEY=924184812939654
CLOUDINARY_API_SECRET=NLU8zzcsKFcRQciWa2mChFlPyB8
EMAIL_USER=imation337@gmail.com
EMAIL_PASS=azxjknpqbfawrjct
```

### 5. Redeploy

After adding environment variables, trigger a new deployment:

- Go to "Deployments" tab
- Click the three dots on the latest deployment
- Click "Redeploy"

## 🔧 Troubleshooting Common Issues

### Build Errors

- Make sure all environment variables are set
- Check that `prisma generate` runs successfully
- Ensure all dependencies are in `package.json`

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Make sure Vercel Postgres is properly set up
- Check that `prisma db push` completes successfully

### NextAuth Issues

- Set `NEXTAUTH_URL` to your actual Vercel domain
- Generate a secure `NEXTAUTH_SECRET` (32+ characters)
- Configure OAuth providers if used

## 📝 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Database schema updated for PostgreSQL
- [ ] Environment variables configured
- [ ] Build scripts updated
- [ ] Vercel.json configured properly

## 🎉 Success!

Your app should be live at: `https://your-app-name.vercel.app`
