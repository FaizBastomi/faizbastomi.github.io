## Portfolio website using [Nextjs](https://nextjs.org).

Skills and Projects are stored in MongoDB and managed through a private dashboard.

### What used?

- Next.js 16 (App Router) + Vercel
- Prisma 6 + MongoDB
- Tailwind CSS 4
- Fontawesome (Icons)
- Iconify (@iconify/react, skill icons from the devicon set)
- Plus Jakarta Sans (Font)
- Catppuccin (Mocha Palette)

## Local setup

```bash
npm install
cp .env.example .env   # then fill it in
npm run db:push        # create the collections
npm run db:seed        # optional: load the starter projects and skills
npm run dev
```

MongoDB has no migrations, so `db:push` (not `migrate`) is the schema workflow.

Skill icons are derived from the skill name — `JavaScript` → `devicon:javascript` — so a name must
slugify to a real icon (lowercase alphanumerics only, one technology per entry). `React / Next.js`
renders blank because it slugifies to `reactnextjs`; the seed splits it into `React` and `Next.js`.

Order is set in the dashboard, by dragging a card or focusing its handle and pressing the arrow
keys. Both sections also collapse, and each browser remembers that separately. Rows that were
never reordered sit at `position` 0 and fall back to `id`, so the order predating this feature is
kept until you move something.

## Environment variables

| Variable             | Purpose                                                      |
| -------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`       | MongoDB connection string.                                   |
| `DASHBOARD_PATH`     | Secret path segment for the dashboard. Unset = no dashboard. |
| `DASHBOARD_PASSWORD` | Dashboard password.                                          |
| `SESSION_SECRET`     | HMAC key for session cookies (`openssl rand -hex 32`).       |

## The dashboard

The dashboard lives at `/$DASHBOARD_PATH` and is **not** linked from anywhere. Both the path and a
password are required; the session is a stateless HMAC cookie, so there is no session store.

`/dashboard` itself returns 404 — otherwise the real path would leak.

### Rotating the path

Change `DASHBOARD_PATH` in Vercel and redeploy. Because the proxy reads it at request time, the old
URL 404s immediately and the auth cookie (scoped to the old path) stops working, so everyone is
logged out. Good hygiene to do monthly:

```bash
openssl rand -hex 8
```

### Rotating the password

Change `DASHBOARD_PASSWORD` in Vercel and redeploy. Existing sessions stay valid until their 7-day
cookie expires — rotate `SESSION_SECRET` as well to log everyone out immediately.

## Deploying to Vercel

1. Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). Vercel detects
   Next.js; no build settings needed. `postinstall` runs `prisma generate`.
2. Add the four environment variables above under **Settings → Environment Variables**.
3. Run `npm run db:push` once against the production database (e.g. from a local shell with
   `DATABASE_URL` pointed at the production cluster), then `npm run db:seed` if you want the
   starter content.

## Tests

```bash
npm test
```

Covers the dashboard password check and session token signing/verification.
