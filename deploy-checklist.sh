#!/bin/bash
# Pre-deployment checklist script

echo "🚀 CookBook Connect - Vercel Deployment Checklist"
echo "=================================================="

echo ""
echo "📋 Pre-deployment Requirements:"
echo "- [ ] PostgreSQL database ready (Vercel Postgres recommended)"
echo "- [ ] Gmail App Password generated"
echo "- [ ] Cloudinary account setup"
echo "- [ ] Code pushed to GitHub"
echo ""

echo "🔧 Environment Variables to set in Vercel:"
echo "- DATABASE_URL"
echo "- NEXTAUTH_URL" 
echo "- NEXTAUTH_SECRET"
echo "- EMAIL_USER"
echo "- EMAIL_PASS"
echo "- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
echo "- CLOUDINARY_API_KEY"
echo "- CLOUDINARY_API_SECRET"
echo ""

echo "⚡ Build Process:"
echo "1. prisma generate"
echo "2. prisma db push (creates tables)"
echo "3. next build"
echo ""

echo "🧪 Post-deployment Tests:"
echo "- [ ] Homepage loads"
echo "- [ ] User registration works"
echo "- [ ] Email verification received"
echo "- [ ] Login after verification"
echo "- [ ] Recipe creation"
echo "- [ ] Image upload"
echo ""

echo "✅ Ready to deploy!"
echo "Visit: https://vercel.com/new to import your GitHub repo"
