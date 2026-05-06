# 🍱 Thaali Management System

A comprehensive web application for managing daily food thaali distribution, family records, menus, and delivery tracking.

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** April 14, 2026

---

## ⚡ Quick Start

### 30-Second Setup

```powershell
# 1. Navigate to project
cd "C:\Users\ahati\Desktop\Thaali Management system\thaali-mvp"

# 2. Install dependencies
npm install

# 3. Setup database
npx prisma migrate deploy

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

**That's it! You're ready to go.** 🚀

---

## 🚀 Deployment

### Vercel (Recommended)

1. **One-Click Deploy**:
   - Click the button below to deploy instantly
   - Set up your PostgreSQL database
   - Your app will be live in minutes!

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ha72ali/Thaali-Mnagement)

2. **Manual Deployment**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   npm run vercel-deploy
   ```

3. **Database Setup**:
   - Use Vercel Postgres (free tier available)
   - Or any PostgreSQL provider (Neon, PlanetScale, etc.)
   - Set `DATABASE_URL` environment variable

📖 **[Complete Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)**

---

## ✨ Features

### 📊 Dashboard
- Real-time delivery metrics and daily statistics
- Family count tracking and completed deliveries  
- Pending deliveries count
- Date selector for any historical data
- Auto-refresh every 15 seconds
- Custom background image support

### 👨‍👩‍👧‍👦 Family Management
- Add new families with name, address, phone, member count
- Edit and delete family records
- View all registered families
- Complete CRUD operations

### 🍲 Menu Management
- Create menus for specific dates
- Add multiple food items (tested with 100+ use cases)
- Flexible input: comma, bullet, or newline separated
- Live preview of parsed items
- Update existing menus
- Search and filter by date

### 📦 Delivery Tracking
- Track deliveries per family per day
- Mark status: Pending, Delivered, Not Delivered
- Reset functionality
- Date-based filtering
- Complete delivery history

### 🎨 UI/UX Features
- Fully responsive design
- Dark mode support
- Clean, modern Tailwind CSS styling
- Loading states and error handling
- Professional navigation
- Accessibility features

---

## Architecture decisions

- **Next.js (App Router) + TypeScript** — one codebase for UI and HTTP API routes, simple deployment story, good fit for an MVP admin app.
- **Prisma + SQLite** — schema-first data layer, no separate DB server for local/demo use; `DATABASE_URL=file:./dev.db` (file lives under `prisma/`).
- **REST-style route handlers** under `src/app/api/*` — small, explicit contracts; easy to test with the browser or `fetch`.
- **Calendar days as `YYYY-MM-DD` strings** — avoids timezone surprises when comparing “today” with stored menu/delivery rows (day is interpreted in the server’s local timezone for “today” in stats).

**Data model (high level)**

- `Family` — registered household.
- `Menu` — one row per date, `items` stored as JSON array of dish names.
- `DailyDelivery` — optional row per `(familyId, date)` with status `PENDING` | `DELIVERED` | `NOT_DELIVERED` (upserted when the admin updates status).

**Dashboard math**

- **Total families** — count of all families.
- **Deliveries completed** — deliveries for that date with status `DELIVERED`.
- **Pending deliveries** — `max(0, totalFamilies - completed)` so it matches “remaining successful deliveries” for the day.

---

## AI usage report

*(Neotech assignment: document collaboration with AI tools.)*

- **Tools used:** Cursor (agent/chat) for scaffolding, implementation, and iteration; assignment spec was provided as a PDF in the workspace context.
- **Example prompts / directions:** “Build the Thaali MVP per Neotech PDF: families, menus, delivery tracking, dashboard; Next.js + Prisma + SQLite; keep scope minimal.”
- **Where AI helped most:** Fast boilerplate (Next.js layout, API route structure), Prisma schema design, consistent Tailwind UI patterns, and wiring client forms to APIs.
- **Where AI was wrong or risky:** Initial Prisma **7.x** CLI rejected `url` in `schema.prisma`; fix was to **pin Prisma 6.x**, which matches common Next.js tutorials and keeps SQLite configuration simple. Always verify generated migrations and run `npm run build` locally.
- **Verification:** Ran `npx prisma migrate dev`, `npm run build`, and manual UI flows (add family → menu → mark deliveries → dashboard counts).

---

## Development reflection

- **Challenges:** Balancing “real-time dashboard” vs MVP scope — implemented lightweight polling (15s) instead of WebSockets.
- **Tradeoffs:** Single admin surface (no auth) to stay within MVP time; SQLite is not ideal for multi-server production without moving to PostgreSQL.
- **Next with more time:** Family login/read-only “today’s menu” view, export CSV for the day, auth/roles, and PostgreSQL for hosted deploy.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18.17+
- npm 9+

### Quick Install
```powershell
npm install
npx prisma migrate deploy
npm run dev
```

Open: http://localhost:3000

---

## 🔌 API Endpoints

- `GET /api/menus` - List all menus
- `GET /api/menus?date=YYYY-MM-DD` - Get menu for date
- `POST /api/menus` - Create/update menu
- `GET /api/families` - List families
- `POST /api/families` - Add family
- `GET /api/deliveries` - List deliveries
- `POST /api/deliveries` - Create delivery
- `GET /api/stats?date=YYYY-MM-DD` - Get daily stats

---

## 📁 Project Structure

```
thaali-mvp/
├── src/app/api/          # API routes
├── src/app/dashboard/    # Dashboard
├── src/app/families/     # Families
├── src/app/menus/        # Menus
├── src/app/deliveries/   # Deliveries
├── prisma/               # Database
└── public/               # Static files
```

---

## 📝 Scripts

```powershell
npm run dev           # Development server
npm run build        # Production build
npm start            # Production server
npx prisma studio   # Database GUI
```

---

## 📖 Documentation

- [NGROK_DEPLOYMENT_GUIDE.md](./NGROK_DEPLOYMENT_GUIDE.md) - Deploy with ngrok
- [MENU_ADMIN_GUIDE.md](./MENU_ADMIN_GUIDE.md) - Menu feature guide
- [MENU_TEST_CASES.md](./MENU_TEST_CASES.md) - Test documentation

---

## 🚀 Deployment

Deploy with ngrok:
```powershell
npm run build
npm start
# In another terminal:
ngrok http 3000
```

---

## 🎯 Quick Links

| Feature | URL |
|---------|-----|
| Dashboard | http://localhost:3000/dashboard |
| Families | http://localhost:3000/families |
| Menus | http://localhost:3000/menus |
| Deliveries | http://localhost:3000/deliveries |
| Database | http://localhost:5555 |

---

## ✅ Feature Checklist

- [x] Family management
- [x] Menu creation and management
- [x] Delivery tracking
- [x] Dashboard with real-time stats
- [x] Responsive design
- [x] Dark mode support
- [x] REST API endpoints
- [x] Database persistence
- [x] Production build
- [x] Deployment ready

---

## 🎉 You're Ready!

Your Thaali Management System is ready to use!

**Visit:** http://localhost:3000 🚀
