# SwitchMyUtilities — Launch Guide
## switchmyutilities.com

---

## Overview of what you're deploying

```
Customer fills out form → Saved to Supabase → Redirected to Stripe → 
Payment confirmed → Confirmation email sent → You get an alert email → 
You manage everything in /ops dashboard
```

---

## Step 1 — Buy the domain

1. Go to **namecheap.com**
2. Search `switchmyutilities.com` → Add to cart → Checkout (~$12/yr)
3. Don't worry about pointing it anywhere yet — we'll do that in Step 5

---

## Step 2 — Set up Supabase (your database)

1. Go to **supabase.com** → Sign up with GitHub
2. Click **New Project** → name it `switchmyutilities` → pick a region (US East) → Create
3. Wait ~2 min for it to provision
4. Go to **SQL Editor** → **New Query** → paste this and click Run:

```sql
CREATE TABLE submissions (
  id              TEXT PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT now(),
  role            TEXT NOT NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  property_address TEXT NOT NULL,
  property_type   TEXT,
  close_date      DATE,
  forwarding_address TEXT,
  current_holder  TEXT,
  pm_direction    TEXT,
  utilities       JSONB NOT NULL,
  fee             INTEGER NOT NULL,
  status          TEXT DEFAULT 'New',
  notes           TEXT,
  stripe_session_id TEXT,
  paid            BOOLEAN DEFAULT false
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
```

5. Go to **Settings → API** and copy:
   - Project URL → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ keep this private

---

## Step 3 — Set up Stripe

1. Go to **stripe.com** → Create account
2. Complete business verification (need SSN + bank account for payouts)
3. Go to **Developers → API Keys**:
   - Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy **Secret key** → `STRIPE_SECRET_KEY`
4. You'll add the webhook secret in Step 5 (need the live URL first)

---

## Step 4 — Set up Resend (email)

1. Go to **resend.com** → Sign up
2. Go to **API Keys** → Create API Key → copy it → `RESEND_API_KEY`
3. Go to **Domains** → Add Domain → enter `switchmyutilities.com`
4. Follow the DNS instructions (you'll add records in Namecheap)
5. Once verified, your from address will be `hello@switchmyutilities.com`

---

## Step 5 — Deploy to Vercel

1. Go to **github.com** → Create new repository → name it `switchmyutilities` → Public or Private
2. Upload this project folder (drag all files into the GitHub web UI, or use Git)
3. Go to **vercel.com** → Sign up with GitHub → **Add New Project** → import your repo
4. Before deploying, click **Environment Variables** and add ALL of these:

```
NEXT_PUBLIC_SUPABASE_URL         = (from Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY    = (from Supabase)
SUPABASE_SERVICE_ROLE_KEY        = (from Supabase)
STRIPE_SECRET_KEY                = (from Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = (from Stripe)
STRIPE_WEBHOOK_SECRET            = (add after next step)
RESEND_API_KEY                   = (from Resend)
NEXT_PUBLIC_APP_URL              = https://switchmyutilities.com
ADMIN_EMAIL                      = your@email.com
FROM_EMAIL                       = hello@switchmyutilities.com
```

5. Click **Deploy** — Vercel gives you a `.vercel.app` URL first (that's fine for now)

---

## Step 6 — Set up Stripe Webhook

This is what tells your app "payment was successful."

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://switchmyutilities.com/api/webhook`
4. Events to listen for: `checkout.session.completed`
5. Click **Add endpoint** → copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`
6. Go back to Vercel → your project → **Settings → Environment Variables** → add `STRIPE_WEBHOOK_SECRET`
7. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy**

---

## Step 7 — Point your domain to Vercel

1. In Vercel → your project → **Settings → Domains** → Add `switchmyutilities.com`
2. Vercel will show you DNS records to add
3. Go to **Namecheap → Manage Domain → Advanced DNS**
4. Add the records Vercel shows you (usually an A record and CNAME)
5. Wait 10-30 min for DNS to propagate → your site is live 🎉

---

## Step 8 — Test end to end

1. Go to `switchmyutilities.com`
2. Fill out the form as a test customer
3. On the Stripe payment page, use test card: `4242 4242 4242 4242` · any future date · any CVC
4. You should get redirected back with a confirmation
5. Check your email for the admin alert
6. Go to `switchmyutilities.com/ops` — submission should appear

---

## Day-to-day operations

- **New submissions** → you get an email alert with all details
- **Manage work** → go to `switchmyutilities.com/ops`
- **Update status** → click any row → change status → Save Changes
- **View raw data** → Supabase dashboard → Table Editor → submissions

---

## Costs at launch

| Service   | Cost         |
|-----------|-------------|
| Vercel    | Free         |
| Supabase  | Free         |
| Resend    | Free (3k emails/mo) |
| Stripe    | 2.9% + 30¢ per transaction (~$2.60 on a $79 order) |
| Domain    | ~$12/year    |
| **Total** | **~$12/year + Stripe fees** |

---

## Questions?

Reply to this file and keep it somewhere safe — it has all your setup steps.
