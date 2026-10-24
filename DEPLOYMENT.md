# VRAM Vault: Deployment & Configuration Guide

A full-stack graphics card e-commerce platform.

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express 5, MongoDB Atlas (Mongoose), JWT, Zod
- **Media:** Cloudinary

> **Security:** never commit secrets. Real values live only in `server/.env` (git-ignored) and in your hosting dashboard. See `.env.example` for the variable names.

---

## 1. Install server dependencies (already in package.json)

```bash
cd server
npm install
```

## 2. Environment variables

Copy `.env.example` to `server/.env` and fill in your own values:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `CLOUDINARY_CLOUD_NAME` | From the Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary -> Settings -> API Keys |
| `CLOUDINARY_API_SECRET` | From the same page. Keep it private |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by the seed script to create the admin |
| `NODE_ENV` | `production` on the host |
| `CLIENT_URL` | Only for separate frontend/backend hosting |

## 3. MongoDB Atlas

1. Create a database user with a strong, unique password.
2. Under **Network Access**, allow `0.0.0.0/0` (hosting IPs change on free plans).
3. Copy the connection string and set the database name (`vramvault`).

## 4. Seed the database and upload images

Run these once, **from your own computer**, with Atlas credentials in `server/.env`:

```bash
npm run seed
npm run upload:cloudinary   # only if product images are still local paths
```

The seed script reads the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Do not publish real admin credentials in this repo.

## 5. Run locally

```bash
npm run server:dev   # API on http://localhost:5000
npm run dev          # Vite on http://localhost:5173
```

## 6. Deploy (recommended: one service on Render)

The Express server serves the built frontend from `/dist`, so one service hosts everything.

1. Push the repo to GitHub (without `.env`).
2. On Render: **New -> Web Service**, connect the repo.
3. Settings:
   - **Build command:** `npm install && npm run build && cd server && npm install`
   - **Start command:** `NODE_ENV=production node server/src/index.js`
4. Add environment variables in the dashboard: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NODE_ENV=production`.
5. Deploy and open the URL Render gives you.

> Free Render services sleep after inactivity, so the first load can take up to a minute.

### Alternative: separate frontend and backend

- **Backend (Render/Railway):** root `server`, build `npm install`, start `node src/index.js`. Set `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, and `CLIENT_URL=https://your-frontend.vercel.app`.
- **Frontend (Vercel/Netlify):** root `./`, build `npm run build`, output `dist`. Set `VITE_API_URL=https://your-backend.onrender.com/api`.

## 7. Demo access

Set `DEMO_EMAIL` and `DEMO_PASSWORD` before seeding to create a throwaway customer for reviewers. Admin credentials stay private; the admin panel is shown in README screenshots.

Payments in this project are **simulated**: no real money is charged.

## 8. Pre-launch checklist

- [ ] Cloudinary API secret rotated if it was ever exposed
- [ ] `.env` is in `.gitignore` and not in git history
- [ ] Default admin password changed on the live site
- [ ] Rate limiting enabled on `/auth/login`
- [ ] Admin routes protected by role checks on the backend
- [ ] Live link and screenshots added to the README
