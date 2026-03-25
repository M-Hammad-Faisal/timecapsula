# TimeCapsula

> Write a letter today. Deliver it to someone in the future.

**TimeCapsula** lets you compose a heartfelt message and schedule it for delivery at any date — from one week to fifty years from now. For parents, partners, founders, and dreamers.

🌐 **[timecapsula.website](https://timecapsula.website)**

---

## Tech Stack

| Layer     | Technology                               |
| --------- | ---------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)       |
| Auth      | Supabase Auth (magic-link, no passwords) |
| Database  | Supabase (Postgres + RLS)                |
| Email     | Resend (transactional delivery)          |
| Payments  | Stripe (one-time premium unlock)         |
| Hosting   | Vercel                                   |

---

## Local Development

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) API key

### 1. Clone & install

```bash
git clone https://github.com/M-Hammad-Faisal/timecapsula.git
cd timecapsula
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Supabase + Resend keys
```

Required env vars (see `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

### 3. Set up the database

Run these SQL files in your Supabase SQL editor in order:

```
supabase/schema.sql              ← core tables + RLS
supabase/auth-migration.sql      ← auth helpers
supabase/features-migration.sql  ← shareable links, rate limiting
supabase/waitlist-migration.sql  ← premium waitlist
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Script                 | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start development server               |
| `npm run build`        | Lint + format check + production build |
| `npm test`             | Run Jest unit tests                    |
| `npm run lint`         | ESLint                                 |
| `npm run lint:fix`     | ESLint with auto-fix                   |
| `npm run format`       | Prettier (write)                       |
| `npm run format:check` | Prettier (check only)                  |

---

## Project Structure

```
app/
  layout.js          ← Root layout, imports globals.css
  globals.css         ← Fonts, design tokens, reset, body, stars
  page.js             ← Home page
  error.jsx           ← Global error boundary
  not-found.jsx       ← 404 page
  loading.jsx         ← Global loading state
  robots.js           ← robots.txt generation
  sitemap.js          ← sitemap.xml generation
  api/
    capsules/         ← POST (create), GET (list)
    capsules/[id]/    ← GET, DELETE, PATCH
    stats/            ← Public capsule count
    waitlist/         ← Premium waitlist signup
  auth/callback/      ← Supabase magic-link callback
  capsule/[id]/       ← Public capsule preview page
  dashboard/          ← User dashboard (auth required)
  login/              ← Sign in page
  write/              ← Capsule composer (auth required)
  privacy/            ← Privacy policy
  terms/              ← Terms of service

components/
  timecapsula.jsx     ← Home page component
  WriteCapsule.jsx    ← Multi-step capsule composer
  Dashboard.jsx       ← User capsule management
  LoginPage.jsx       ← Magic-link sign in
  CapsulePreview.jsx  ← Public capsule share page
  PrivacyPage.jsx     ← Privacy policy
  TermsPage.jsx       ← Terms of service
  StepBar.jsx         ← Multi-step progress indicator
  Stars.jsx           ← Animated star background

lib/
  constants.js        ← GUEST_LIMIT, FREE_USER_LIMIT, etc.
  delivery.js         ← computeDeliveryDate() pure function
  validation.js       ← validateEmail() + EMAIL_REGEX
  templates.js        ← TEMPLATES array + FREE_IDS
  supabase/
    admin.js          ← Service-role client (server-only)
    client.js         ← Browser client
    server.js         ← SSR client
  __tests__/
    delivery.test.js
    validation.test.js

supabase/
  schema.sql
  auth-migration.sql
  features-migration.sql
  waitlist-migration.sql
  cron-setup.sql
  magic-link-email.html
  functions/deliver-capsules/  ← Supabase Edge Function
```

---

## License

MIT — see [LICENSE](LICENSE)
