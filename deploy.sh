#!/bin/bash

# Thaali Management System - Vercel Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 Thaali Management System - Vercel Deployment"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Deploy to production
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment initiated!"
echo "📋 Next steps:"
echo "   1. Set DATABASE_URL environment variable in Vercel dashboard"
echo "   2. Run database migrations: npx prisma migrate deploy"
echo "   3. Test your deployed application"
echo ""
echo "📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md"