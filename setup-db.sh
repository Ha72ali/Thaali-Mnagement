#!/bin/bash

# Thaali Management System - Database Setup Script
# Run this after deploying to Vercel to set up the database

echo "🗄️ Setting up Thaali Management Database..."
echo "=========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set!"
    echo "Please set it in your Vercel project settings or .env file"
    exit 1
fi

echo "📡 Database URL found: ${DATABASE_URL:0:30}..."

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📤 Pushing database schema..."
npx prisma db push --skip-generate

# Run migrations if they exist
echo "🚀 Running migrations..."
npx prisma migrate deploy 2>/dev/null || echo "ℹ️ No migrations to deploy (using db push)"

# Test connection
echo "🧪 Testing database connection..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Database connection successful!');
    return prisma.\$disconnect();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"

echo ""
echo "✅ Database setup complete!"
echo "🌐 Your app should now be working at the Vercel URL"
echo ""
echo "🔍 Test the health endpoint: https://your-app.vercel.app/api/health"