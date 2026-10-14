# Truehost cPanel Deployment Guide for G-Squad (g-squad.buzz)

This document provides exact instructions for deploying the **G-Squad Next.js 15 App Router** application with its persistent background trading bot worker on **Truehost cPanel Node.js Selector / Application Manager**.

---

## 1. Domain & Environment Setup
- **Domain:** `https://g-squad.buzz`
- **Node.js Version:** Recommended **Node.js 20.x** or **Node.js 22.x** (LTS)
- **Application Mode:** `Production`

### Required Environment Variables in cPanel
In your cPanel **"Setup Node.js App"** interface (or `.env` file in the application root), set the following variables:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_DERIV_APP_ID=33E1sj7WNaMsjg5MAxPyS
NEXT_PUBLIC_DERIV_APP_NAME=G-squad
NEXT_PUBLIC_DERIV_ENV=production
NEXT_PUBLIC_DERIV_OAUTH_SCOPES=trade,account_manage
NEXT_PUBLIC_DERIV_REDIRECT_URI=https://g-squad.buzz
NEXT_PUBLIC_DERIV_REFERRAL_LINK=https://t.deriv.link?t=AJAQ5SJZLES4
NEXT_PUBLIC_DERIV_SHOW_APP_NAME=true
```

> **Note on PORT:** Truehost / CloudLinux cPanel automatically injects the assigned `process.env.PORT` variable. The server (`server.ts`) is preconfigured to bind dynamically to `0.0.0.0` and `process.env.PORT || 3000`.

---

## 2. cPanel "Setup Node.js App" Settings

1. Log into your **Truehost cPanel**.
2. Click **"Setup Node.js App"** (under the **Software** section).
3. Click **"Create Application"**:
   - **Node.js version:** Select `20.x` or `22.x`.
   - **Application mode:** Select `Production`.
   - **Application root:** Enter your folder path (e.g. `g-squad` or `public_html`).
   - **Application URL:** Select `g-squad.buzz`.
   - **Application startup file:** Enter `server.ts` (or `node_modules/.bin/tsx server.ts`).
4. Click **"Create"**.

---

## 3. Install Dependencies & Build

In the cPanel Node.js interface, enter the virtual environment command provided at the top of the page (or open the cPanel Terminal) and run:

```bash
# 1. Enter application directory
cd ~/g-squad

# 2. Install all dependencies
npm install

# 3. Build Next.js 15 production assets
npm run build
```

---

## 4. Starting & Running the App

### Option A: Via cPanel Node.js Interface (Recommended)
1. In the **Setup Node.js App** dashboard, ensure **Application startup file** is set to `server.ts`.
2. Click **"Restart"**.

### Option B: Via Terminal / Process Manager (PM2 / Systemd)
If you run via terminal or PM2:

```bash
# Start directly with production server
npm start
```

Or with PM2:
```bash
npx pm2 start "npx tsx server.ts" --name "g-squad"
npx pm2 save
```

---

## 5. Persistent Background Bot Behavior
The full-stack server runs Next.js alongside the persistent background trading engine. It continues executing synthetic indices trades and monitoring risk parameters (Stake, Stop-Loss, Take-Profit, and Target Runs) even when users:
- Close their browser tab
- Lock their smartphone screen
- Switch between networks or go offline

All state syncs automatically upon reconnecting.
