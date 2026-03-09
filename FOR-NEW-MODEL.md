# Quick Start Guide for New Model

## Who Am I?
- **Name:** Clawdia
- **Creature:** AI assistant
- **User:** John (GitHub: valettavamps)
- **Project:** DiamondChain Baseball Game (crypto baseball sim)

## Project Overview
- Baseball crypto game on Solana (inspired by PhotoFinish.live / Goal Line Blitz)
- **DERBY token:** stablecoin (100 = $1)
- **CROWN token:** governance/staking
- Hybrid model: 90% casual stakers, 10% hardcore owners
- Tiered leagues with promotion/relegation (5 tiers: Diamond → Bronze)

## What's Built (60% MVP)

### ✅ Frontend (React + TypeScript)
- `src/pages/` - HomePage, PlayersPage, SeasonPage, CreatePlayerPage, AuthPage, MyOffersPage
- `src/components/` - Header, Sidebar, MobileMenu, PlayerCard, LiveGamesFeed, SeasonControl
- `src/engine/` - GameSimulator, SeasonManager, AIManager, MockDataGenerator, MultiLeagueSeasonManager
- Mobile responsive with hamburger menu

### ✅ Player Creation (5-step wizard)
- Name → Position → Attributes (randomized, free) → Physical → Confirm
- Letter grades (A+ to F)
- Contract offers system with flashing alerts

### ✅ Auth (mock)
- Email/password signup + login
- 2FA with Google Authenticator (QR codes)
- Protected pages

### ✅ Game Engine
- Full stats-based simulation
- 100 teams across 5 tiers
- Promotion/relegation logic
- Revenue multipliers

### ✅ Backend (just written, needs deployment)
- `src/server/server.ts` - Express API
- `src/server/dataStore.ts` - In-memory data store
- `src/services/api.ts` - Frontend API client
- Routes for: auth, players, teams, seasons, stakes, contracts

## What's NOT Built (40% remaining)
- Real backend (currently just files, not running)
- Database (PostgreSQL)
- Real auth (bcrypt + JWT)
- Staking UI
- Team auctions
- Owner dashboard
- Trade marketplace

## Current Issues
- **Backend not running** - VPS has approval issues for running node processes
- Dependencies installed locally, just need to start server

## Files of Note
- `PROGRESS.md` - Full progress tracker
- `COMPLETION-CHECKLIST.md` - Design vs reality comparison
- `BACKEND-SETUP.md` - How to run backend
- `gameplay-design.md` - Original design doc

## To Run Backend Locally
```bash
cd baseball-game
npm install
npm run dev  # Runs on port 3001
```

## To Deploy to Cloud (Recommended)
Use Render.com free tier - connect GitHub repo, set build command to `npm install`, start command to `npm start`

## John's Preferences
- Wants fun gameplay first, economics second
- Likes letter grades over numbers
- Mobile-first design
- Free player creation (premium bonus points later)

---

**Last updated:** 2026-03-09 21:18 UTC
