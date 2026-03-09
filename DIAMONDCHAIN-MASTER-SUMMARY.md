# DiamondChain ⚾ — Master Project Summary

> **Last updated:** 2026-03-09 22:32 UTC
> **Repo:** https://github.com/valettavamps/baseball-game
> **Human:** John (@valettavamps) | **AI Dev:** Clawdia 🦞

---

## What Is This?

Crypto baseball sim on Solana. Players create baseball players, stake on teams, compete across tiered leagues. Inspired by PhotoFinish.live + Goal Line Blitz.

**Model:** 90% casual stakers (watch & earn) + 10% team owners (daily management)

## Tokens

- **BALLS** — in-game currency (100 = $1 USD, bought via Coinflow)
- **CROWN** — governance/staking token

## Tech Stack

- **Frontend:** React 18 + TypeScript → deployed on **Vercel**
- **Backend:** Express + in-memory store → `server/` dir, deploy to **Render.com** (not yet deployed)
- **Blockchain:** Solana (Phase 2, not integrated yet)
- **Persistence:** localStorage (working now), PostgreSQL (planned)

---

## ✅ What's Built (60% MVP)

| Feature | Status |
|---------|--------|
| Game simulation engine (stats-based, 162-game seasons) | ✅ Done |
| AI team management (lineups, rotation, strategy) | ✅ Done |
| 5-tier league system (100 teams, promotion/relegation) | ✅ Done |
| Frontend UI (PFL dark theme, desktop + mobile) | ✅ Done |
| Player creation (5-step wizard, letter grades) | ✅ Done |
| Contract offers (5 teams, accept/reject) | ✅ Done |
| Auth (email/password + 2FA mock) | ✅ Done |
| localStorage persistence | ✅ Done |
| Backend API code (Express) | ✅ Written, not deployed |

## ❌ What's Left (40%)

| Phase | What | Priority |
|-------|------|----------|
| **2** | Deploy backend (Render.com), PostgreSQL, real auth (bcrypt+JWT) | 🔴 High |
| **3** | Staking UI + Solana smart contracts + wallet integration | 🟡 Medium |
| **4** | Team auctions + owner dashboard + trade marketplace | 🟡 Medium |
| **5** | Social features, analytics, premium, polish, launch | 🟢 Low |

---

## 🔧 Repo Cleanup (Done 2026-03-09 22:30 UTC)

### Problem
Vercel deployments were failing because `package.json` got overwritten with backend-only config (Express/tsc) instead of React (react-scripts).

### What We Fixed
1. **Restored `package.json`** — React deps (react-scripts build), removed Express from frontend
2. **Restored `tsconfig.json`** — React-compatible (jsx, dom libs, noEmit)
3. **Moved server code** — `src/server/` → standalone `server/` directory with own `package.json`
4. **Deleted `src/server/`** — Was breaking React build (Express types in frontend)
5. **Updated `src/services/api.ts`** — Empty default URL (falls back to localStorage)
6. **Deleted 15 redundant files** — Old HTML previews, duplicate docs, demo script
7. **Consolidated docs** — Design docs moved to `docs/`, all status info here

### Current Repo Structure
```
baseball-game/
├── README.md
├── DIAMONDCHAIN-MASTER-SUMMARY.md  ← you are here
├── package.json                     ← React build config
├── tsconfig.json                    ← React TS config
├── public/index.html
├── src/                             ← React frontend
│   ├── engine/                      ← GameSimulator, SeasonManager, AIManager, MockDataGenerator
│   ├── components/                  ← Header, Sidebar, PlayerCard, LiveGamesFeed, etc.
│   ├── pages/                       ← Home, Season, Players, CreatePlayer, Auth, MyOffers
│   ├── services/                    ← api.ts + localStorage.ts
│   ├── types/                       ← index.ts, league.ts, user.ts
│   └── styles/                      ← globals.css
├── server/                          ← Express backend (separate deploy)
│   ├── server.ts, dataStore.ts, package.json, tsconfig.json
└── docs/                            ← Design documents
    ├── gameplay-design.md, platform-economics.md
    ├── staking-leverage-math.md, team-ownership-auction.md
```

### Deployment Status (Vercel - PROBLEMATIC)
- **5 pushes sent** — all failing on TypeScript errors in CreatePlayerPage.tsx
- Errors fixed so far:
  1. `generateBaseAttributes` → `generateAttributes` (line 156)
  2. Added missing `useState` hooks: `baseAttributes`, `attributePoints`
  3. Cast `generateAttributes` return to `Record<string,number>` (type mismatch)
- **5th build running** (commit e47425b) — awaiting result
- **ALTERNATIVE:** Switch to GitHub Pages instead — already configured in package.json:
  ```bash
  npm install --save-dev gh-pages
  # Add to package.json scripts: "deploy": "gh-pages -d build"
  npm run build && npm run deploy
  ```
- **baseball-game-zee1:** Unknown repo (404) — delete this Vercel project

---

## 💰 Revenue Model (Designed)

- **Year 1 (10K users):** $1.56M revenue → $469K founder (30%)
- **Year 3 (100K users):** $15.6M revenue → $4.68M founder
- **Fees:** 2.5% stake in/out, 5% NFT, 10% auction, 1% loans
- **Split:** 30% founder / 20% ops / 25% player rewards / 15% marketing / 10% treasury

## 🔑 Key Decisions (Locked)

- Hybrid model (stakers + owners)
- Solana blockchain
- 5 tiers, 100 teams, promotion/relegation
- Stats-based sim (not physics)
- Email/password auth primary, wallet optional
- Season-long staking lock, 70% revenue to stakers
- Letter grades (A+ to F) over numbers
- English auction for team ownership (7-day, anti-snipe)

## 🎯 Next Steps

1. **Confirm Vercel deployment is green** (3rd push should fix it — TS error was the blocker)
2. **Deploy backend to Render.com** free tier (server/ dir has its own package.json, ready to go)
3. **Wire frontend to backend** (update REACT_APP_API_URL env var in Vercel to point at Render URL)
4. **Delete `baseball-game-zee1`** Vercel project (stale, repo doesn't exist)

---

## Dev History

| Date | What | Hours |
|------|------|-------|
| Mar 9 AM | Game engine + AI + economic docs | ~3h |
| Mar 9 PM | UI integration + tiered leagues + mobile | ~4.5h |
| Mar 9 PM | Auth + player creation + contracts | ~3h |
| Mar 9 Night | Repo cleanup + fix Vercel build (3 pushes) | ~2h |
| **Total** | **60% MVP** | **~12.5h** |
