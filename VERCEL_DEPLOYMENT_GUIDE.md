# Vercel Deployment Guide for Thaali Management System

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Choose one of the following cloud databases:
   - **Vercel Postgres** (recommended) - Free tier available
   - **Neon** - Free tier available
   - **PlanetScale** - Free tier available
   - **Railway** - Free tier available

## Step 1: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database" → "Postgres"
4. Choose your database name (e.g., `thaali-db`)
5. Copy the `DATABASE_URL` from the connection details

### Option B: Neon (Alternative)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string

### Option C: PlanetScale

1. Go to [planetscale.com](https://planetscale.com)
2. Create a free account
3. Create a new database
4. Get the connection string

## Step 2: Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `Ha72ali/Thaali-Mnagement`

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `thaali-mvp` (if your project is in a subfolder)
   - **Build Command**: `prisma generate && next build`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   Add the following environment variables in Vercel:
   ```
   DATABASE_URL=your_postgresql_connection_string_here
   ```

4. **Deploy**: Click "Deploy"

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd thaali-mvp
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   # Enter your PostgreSQL connection string
   ```

## Step 3: Database Migration

After deployment, run the database migration:

1. **Using Vercel CLI**:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Or via Vercel Dashboard**:
   - Go to your project dashboard
   - Navigate to "Functions" tab
   - Run a function with command: `npx prisma migrate deploy`

## Step 4: Verify Deployment

1. **Check your deployed app**: The URL will be shown in Vercel dashboard
2. **Test the application**:
   - Visit the dashboard
   - Try adding a family
   - Create a menu
   - Test deliveries

## Troubleshooting

### Build Errors

If you encounter build errors:

1. **Prisma Issues**: Make sure `DATABASE_URL` is set correctly
2. **Node Version**: Vercel uses Node 18+ by default
3. **Dependencies**: Check that all dependencies are compatible

### Database Connection Issues

1. **SSL Mode**: Add `?sslmode=require` to your PostgreSQL URL
2. **Connection Limits**: Some free tiers have connection limits
3. **Connection Pooling**: Consider using Prisma Accelerate for better performance

### Environment Variables

Make sure all environment variables are set in Vercel:
- `DATABASE_URL` - Your PostgreSQL connection string

## Production Optimizations

1. **Enable Analytics**: In Vercel dashboard → Analytics
2. **Set up Monitoring**: Use Vercel's built-in monitoring
3. **Custom Domain**: Add your custom domain if needed
4. **Edge Functions**: Consider using Vercel Edge Functions for better performance

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify database connectivity
3. Ensure all environment variables are set
4. Check Prisma schema compatibility

## Cost Estimation

- **Vercel**: Free tier covers most small applications
- **Database**: Free tiers available from Vercel Postgres, Neon, or PlanetScale
- **Domain**: Optional, custom domains cost ~$12/year