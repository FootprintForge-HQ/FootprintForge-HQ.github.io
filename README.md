# Footprint Forge — Vercel Deployment

## Project Structure
```
footprintforge/
├── index.html              ← Main landing page
├── brief.html              ← Client portfolio brief form
├── command-center-v2.html  ← Your CRM (private)
├── sitemap.xml
├── robots.txt
├── logo.webp               ← Upload manually
├── og-image.jpg            ← Upload manually
├── api/
│   ├── new-lead.js         ← Email on new lead
│   └── brief-submitted.js  ← Email on brief submitted
├── vercel.json
├── package.json
└── .env.example
```

---

## Step 1 — Get Resend API Key (Free)

1. Go to **resend.com** → Sign up (free)
2. Add domain → `footprintforge.in`
3. Resend will give you DNS records → add them in Spaceship
4. Once verified → **API Keys** → Create Key → copy it

---

## Step 2 — Push to GitHub

Your repo is already at: `github.com/footprintforge-hq/footprintforge-hq.github.io`

Replace all files in the repo with the contents of this folder.
Add `logo.webp` and `og-image.jpg` to the root too.

```bash
# In your repo folder
git add .
git commit -m "Migrate to Vercel with email automation"
git push
```

---

## Step 3 — Deploy on Vercel

1. Go to **vercel.com** → Sign in with GitHub
2. **New Project** → Import `footprintforge-hq.github.io`
3. Framework: **Other**
4. Root directory: `/` (leave default)
5. Click **Deploy**

---

## Step 4 — Add Environment Variables

In Vercel dashboard → Project → **Settings** → **Environment Variables**

Add these:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` (from Resend) |
| `NOTIFY_EMAIL` | `footprintforge@gmail.com` |
| `FROM_EMAIL` | `hello@footprintforge.in` |
| `FROM_NAME` | `Footprint Forge` |

Click **Save** → **Redeploy**

---

## Step 5 — Add Custom Domain

1. Vercel → Project → **Settings** → **Domains**
2. Add `footprintforge.in`
3. Add `www.footprintforge.in`
4. Vercel shows you DNS records to add

In **Spaceship DNS**:
- Delete the old A records pointing to GitHub Pages
- Delete the old CNAME for `www`
- Add the new records Vercel gives you

---

## Step 6 — Turn Off GitHub Pages

1. GitHub repo → **Settings** → **Pages**
2. Source → **None**
3. Save

---

## What Changes After Migration

| Feature | Before | After |
|---------|--------|-------|
| Hosting | GitHub Pages | Vercel (faster) |
| SSL | GitHub | Vercel (auto-renew) |
| Email on new lead | Web3Forms | Resend via `/api/new-lead` |
| Email on brief | None | Resend via `/api/brief-submitted` |
| Firebase | Same | Same (unchanged) |
| Domain | footprintforge.in | footprintforge.in (unchanged) |

---

## Testing After Deploy

1. Submit a test lead on `footprintforge.in` → check your email
2. Open brief link → submit → check your email
3. Open `footprintforge.in/command-center-v2.html` → login → confirm data loads
