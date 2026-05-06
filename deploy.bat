@echo off
REM Thaali Management System - Vercel Deployment Script (Windows)
REM This script helps deploy the application to Vercel

echo 🚀 Thaali Management System - Vercel Deployment
echo ==============================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing...
    npm install -g vercel
    echo.
)

REM Check if user is logged in
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel:
    vercel login
    echo.
)

REM Deploy to production
echo 📦 Deploying to Vercel...
vercel --prod

echo.
echo ✅ Deployment initiated!
echo 📋 Next steps:
echo    1. Set DATABASE_URL environment variable in Vercel dashboard
echo    2. Run database migrations: npx prisma migrate deploy
echo    3. Test your deployed application
echo.
echo 📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md
echo.

pause