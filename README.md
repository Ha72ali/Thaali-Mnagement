# Thaali Management System (MVP)

Web admin MVP for **daily Thaali delivery** operations: register families, plan menus by date, track per-family delivery status for a day, and view dashboard metrics.

## Quick start

1. **Prerequisites:** Node.js 20+ and npm.

2. **Install and database**

   ```bash
   cd thaali-mvp
   cp .env.example .env
   npm install
   npx prisma migrate dev
   ```

3. **Run**

   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) — you are redirected to the **Dashboard**.

---

## Demo checklist (required features)

| Area | Where to test |
|------|----------------|
| **Families** | `/families` — add family (name, address, phone, member count); list updates. |
| **Daily menu** | `/menus` — pick a date, enter items (comma/bullet/newline separated), save; reload to confirm. |
| **Deliveries** | `/deliveries` — pick the same day; mark each family **Delivered** or **Not delivered**; use **Reset** for pending. |
| **Dashboard** | `/dashboard` — **Total families**, **Deliveries completed**, **Pending deliveries** for the selected date; auto-refresh every 15s + **Refresh** button. |

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

## Project structure

```
thaali-mvp/
  prisma/
    schema.prisma
    migrations/
  src/
    app/
      api/           # families, menus, deliveries, stats
      dashboard/
      families/
      menus/
      deliveries/
    components/    # AppShell navigation
    lib/           # Prisma client, date helpers
```

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Run production server after build |
| `npm run db:migrate` | Create/apply migrations (`prisma migrate dev`) |

---

## License

Private assignment / internal use.
