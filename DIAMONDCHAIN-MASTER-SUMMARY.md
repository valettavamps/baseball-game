# DiamondChain ⚾ — Master Project Summary

> **Last updated:** 2026-03-09 22:09 UTC
> **Author:** Clawdia 🦞 | **Human:** John (@valettavamps)
> **Repo:** https://github.com/valettavamps/baseball-game
> **Live preview:** https://valettavamps.github.io/baseball-game/

---

## 🎯 What Is DiamondChain?

A **crypto baseball simulation game** on Solana, inspired by PhotoFinish.live (PFL) and Goal Line Blitz (GLB). Players create baseball players, stake on teams, and compete across tiered leagues with real economic stakes.

**Hybrid model:** 90% casual stakers (watch & earn), 10% hardcore team owners (daily management).

---

## 💰 Token System

| Token | Purpose | Peg |
|-------|---------|-----|
| **BALLS** (formerly DERBY) | In-game currency, bought via Coinflow | 100 = $1 USD |
| **CROWN** | Governance/staking, team owners stake for profits | Market-driven |

---

## 🏗️ Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Frontend** | React 18.3 + TypeScript 4.9 | ✅ Built |
| **Styling** | Custom CSS, PFL-inspired dark theme | ✅ Built |
| **Blockchain** | Solana Web3.js, Wallet Adapters | ⏳ Wired, not integrated |
| **Backend** | Node.js + Express (in-memory store) | ⚠️ Code exists, not running |
| **Database** | PostgreSQL (planned) | ❌ Not started |
| **AI** | OpenRouter API (narrative, coaching) | ⏳ Key available |
| **Hosting** | Vercel (frontend), Render.com (backend planned) | ⚠️ Vercel deploys failing |

---

## ✅ MILESTONES REACHED (60% of MVP)

### Milestone 1: Game Simulation Engine — COMPLETE ✅
- **GameSimulator.ts** — Full stats-based game sim (contact, power, discipline vs velocity, control)
- At-bat probability, inning-by-inning simulation, base runners, extra innings
- Revenue & attendance calculations
- Automatic highlight generation
- *Performance:* Full 162-game season (~2,430 games) in ~10-15 seconds

### Milestone 2: Season Management — COMPLETE ✅
- **SeasonManager.ts** — 162-game balanced schedule generation
- Day-by-day or fast-forward simulation (week/month/full season)
- Standings tracking (win %, streaks, home/away records)
- Season lifecycle: upcoming → active → completed
- Season-end payout calculation (70% to stakers)

### Milestone 3: AI Team Management — COMPLETE ✅
- **AIManager.ts** — Smart lineup selection (leadoff, power, etc.)
- Pitcher rotation with rest day tracking
- In-game decisions (stealing, bunting, pitching changes)
- Performance-based strategy adjustments
- Opponent scouting reports

### Milestone 4: 5-Tier League System — COMPLETE ✅
- **100 teams** across 5 tiers (GLB-style promotion/relegation):
  - 💎 Diamond (10 teams, rating 85-95, 1.5x revenue)
  - 🏆 Platinum (16 teams, rating 75-85, 1.3x revenue)
  - 🥇 Gold (20 teams, rating 65-75, 1.1x revenue)
  - 🥈 Silver (24 teams, rating 55-65, 1.0x revenue)
  - 🥉 Bronze (30 teams, rating 45-55, 0.8x revenue)
- Promotion/relegation at season end (top teams up, bottom teams down)
- Tier history tracking per team

### Milestone 5: Frontend UI — COMPLETE ✅ (95%)
- PFL-inspired dark theme (cyan/purple accents)
- Sidebar navigation + header with live indicator
- Season dashboard: tier tabs, live games feed, league standings, season controls
- Home page with hero section and stats
- **Mobile responsive:** hamburger menu, bottom nav, 44px+ touch targets, single-column layouts
- All animations working (hover effects, transitions, loading states)

### Milestone 6: Authentication — COMPLETE ✅ (Mock)
- Email/password sign up + sign in
- 2FA setup with Google Authenticator (QR code generation)
- Skip option for testing (production will enforce)
- Sign out, protected pages
- Auth modal (doesn't block site browsing)
- Wallet separated: auth = email/password, wallet = optional for funds

### Milestone 7: Player Creation — COMPLETE ✅
- **5-step wizard:** Name → Position (10 choices) → Attributes (50 pts to allocate) → Physical → Review & Confirm
- Letter grades (A+ to F) instead of raw numbers
- Real-time overall rating calculation
- Position-specific attribute recommendations
- Randomized starting attributes per position
- Success screen after creation

### Milestone 8: Contract Offer System — COMPLETE ✅
- 5 teams auto-generate contract offers after player creation
- Each offer: salary (50-80K BALLS/season), duration (1-3 seasons), performance bonuses, scouting report
- Offer cards with tier badges, expiration timers
- Review modal with full contract details
- Accept/reject flow, signed confirmation screen
- **Flashing animated alerts** on player card (pulsing border, bouncing mail icon, shine effect)

### Milestone 9: Economic Design Documents — COMPLETE ✅
- **staking-leverage-math.md** — Staking formulas, ownership %, ROI, APR, collateralized borrowing, liquidation
- **team-ownership-auction.md** — English auction format, 7-day duration, anti-snipe, bid deposits, revenue split (50/30/20)
- **platform-economics.md** — Fee structure, revenue projections ($1.56M Year 1 at 10K users), founder compensation (30% = ~$469K), scaling to $15.6M at 100K users
- **gameplay-design.md** — Hybrid staker/owner model, core loops, progression path

### Milestone 10: Backend API Code — COMPLETE ✅ (Not Running)
- `src/server/server.ts` — Express API with routes for auth, players, teams, seasons, stakes, contracts
- `src/server/dataStore.ts` — In-memory data store with TypeScript types
- `src/services/api.ts` — Frontend API client
- **Not yet deployed or tested** — needs `npm install` + hosting

---

## ❌ MILESTONES AHEAD (40% remaining)

### 🔴 Phase 1: Backend & Persistence (HIGH PRIORITY — 2-3 weeks)
1. **Deploy backend** — Get Express server running (Render.com free tier recommended)
2. **Database setup** — PostgreSQL for users, players, teams, contracts, seasons, games
3. **Real authentication** — bcrypt password hashing (12 rounds), JWT tokens (24h expiry)
4. **Session persistence** — Save player progress, resume games, career stats
5. **Security hardening** — Rate limiting, input validation (Zod), CORS, CSRF, XSS protection
6. **Real 2FA** — TOTP with speakeasy, backup codes

### 🟡 Phase 2: Staking System (MEDIUM PRIORITY — 2-3 weeks)
1. **Staking UI** — Browse teams page, team detail page, staking flow, My Stakes page, projected APR calculator
2. **Smart contracts** — Solana SPL token setup (CROWN, BALLS), staking contract, season-end payout distribution
3. **Wallet integration** — Phantom, Solflare connection + transaction signing
4. **Token economics** — Initial distribution, liquidity pools, price feeds

### 🟡 Phase 3: Team Ownership & Auctions (MEDIUM PRIORITY — 2-3 weeks)
1. **Auction system** — UI + smart contracts, English auction (7-day, anti-snipe), bid deposits (10%)
2. **Owner dashboard** — Set daily lineups, make trades, sign free agents, view financials, strategy settings
3. **Trade marketplace** — List players, browse, make offers, negotiate, execute

### 🟢 Phase 4: Advanced Features (LOW PRIORITY — 3-4 weeks)
1. Collateralized loans (borrow against staked position, 60-80% LTV @ 15% APR)
2. NFT staking receipts (mint on stake, secondary market)
3. Social features (Discord integration, chat, leaderboards, achievements)
4. Analytics dashboard (performance charts, revenue projections, portfolio tracking)
5. Premium features (advanced analytics $10/mo, AI coach $15/mo, custom branding $50)

### 🟢 Phase 5: Polish & Launch (LOW PRIORITY — 2-3 weeks)
1. Performance optimization (code splitting, lazy loading, caching)
2. Testing (unit, integration, E2E, load, security audit)
3. Documentation (user guides, API docs, white paper)
4. Marketing (landing page, demo video, social assets)
5. Legal (ToS, privacy policy, GDPR, entity formation)

---

## 📊 Completion Tracker

```
Overall MVP:     [████████████░░░░░░░░] 60%

✅ Game Engine              100%
✅ Season Management        100%
✅ AI Team Management       100%
✅ Tiered Leagues (5-tier)  100%
✅ Frontend UI/UX           95%
✅ Auth System (mock)       100%
✅ Player Creation          100%
✅ Contract System          100%
✅ Economic Design Docs     100%
✅ Backend Code (written)   100%
⏳ Backend Deployed           0%
⏳ Database (PostgreSQL)      0%
⏳ Real Auth (bcrypt+JWT)     0%
⏳ Staking System             0%
⏳ Smart Contracts            0%
⏳ Team Ownership             0%
⏳ Advanced Features          0%
```

---

## 🔑 Key Decisions (Locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Gameplay model | Hybrid (90% stakers, 10% owners) | Accessible + deep |
| Blockchain | Solana | Fast, cheap, good ecosystem |
| League structure | 5 tiers, 100 teams, promotion/relegation | Creates drama & strategy |
| Sim engine | Stats-based (not physics) | Fast, scalable, cheap |
| Auth | Email/password primary, wallet optional | Lower barrier to entry |
| Staking | Season-long lock, 70% of team revenue to stakers | Commitment + reward |
| Revenue split | 30% founder / 20% ops / 25% players / 15% marketing / 10% treasury | Sustainable |
| Auction format | English, 7-day, anti-snipe extensions | Transparent, exciting |
| Fee structure | 2.5% stake in/out, 5% NFT, 10% auction, 1% loans | Industry-fair |
| Founder comp | 30% of gross revenue (no salary) | Scales with success |
| Grades | Letter grades (A+ to F) over raw numbers | John's preference |

---

## 💰 Revenue Projections

| Metric | Year 1 (10K users) | Year 2 (50K users) | Year 3 (100K users) |
|--------|-------------------|-------------------|---------------------|
| Total revenue | $1.56M | $7.8M | $15.6M |
| Founder (30%) | $469K | $2.34M | $4.68M |
| Player rewards (25%) | $391K | $1.95M | $3.9M |
| Operations (20%) | $313K | $1.56M | $3.12M |

---

## 🐛 Known Issues

| Priority | Issue |
|----------|-------|
| 🔴 Critical | No data persistence (refresh = lost) |
| 🔴 Critical | Auth is mock (not secure for real users) |
| 🔴 Critical | Backend not running (code exists but not deployed) |
| 🔴 Critical | Vercel deployments failing (both repos) |
| 🟡 Medium | Player stats don't update during games |
| 🟡 Medium | Contract offers are random (no AI logic) |
| 🟡 Medium | `baseball-game-zee1` repo doesn't exist / 404 |
| 🟢 Minor | Some mobile animations could be smoother |
| 🟢 Minor | Error handling needs improvement |
| 🟢 Minor | Accessibility (a11y) not tested |

---

## 📁 Project File Map

### Engine (core logic)
- `src/engine/GameSimulator.ts` — Game simulation
- `src/engine/SeasonManager.ts` — Season orchestration
- `src/engine/AIManager.ts` — AI team management
- `src/engine/MockDataGenerator.ts` — Test data generation
- `src/engine/MultiLeagueSeasonManager.ts` — 5-tier league manager

### Pages
- `src/pages/HomePage.tsx` — Landing page
- `src/pages/SeasonPage.tsx` / `MultiLeagueSeasonPage.tsx` — Season dashboard
- `src/pages/PlayersPage.tsx` — Player listings
- `src/pages/CreatePlayerPage.tsx` — 5-step wizard
- `src/pages/AuthPage.tsx` — Email/password + 2FA
- `src/pages/MyOffersPage.tsx` — Contract offers

### Components
- `src/components/Header.tsx`, `Sidebar.tsx`, `MobileMenu.tsx`
- `src/components/PlayerCard.tsx` — Card with animated alerts
- `src/components/LiveGamesFeed.tsx` — Game results display
- `src/components/SeasonControl.tsx` — Season control panel

### Backend (written, not deployed)
- `src/server/server.ts` — Express API
- `src/server/dataStore.ts` — In-memory data store
- `src/services/api.ts` — Frontend API client

### Design Docs
- `gameplay-design.md` — Hybrid staker/owner model
- `staking-leverage-math.md` — Economic formulas
- `team-ownership-auction.md` — Auction mechanics
- `platform-economics.md` — Revenue model
- `LEAGUE-STRUCTURE.md` — Tiered system design
- `PLAYER-JOURNEY.md` — Player flow documentation
- `SECURITY.md` — Security implementation plan
- `DECISIONS.md` — Locked design decisions

---

## 📈 Development History

| Date | Session | What Was Built | Hours |
|------|---------|---------------|-------|
| Mar 9 AM | Session 1 | Game engine, season manager, AI manager, economic docs | ~3h |
| Mar 9 PM | Session 2 | UI integration (LiveGamesFeed, SeasonControl, SeasonPage) | ~1.5h |
| Mar 9 PM | Session 3 | 5-tier leagues, promotion/relegation, mobile responsive | ~3h |
| Mar 9 PM | Session 4 | Auth system, player creation, contract offers, mobile fixes | ~3h |
| **Total** | | **60% of MVP** | **~10.5h** |

---

## 🎮 What Works Right Now

1. Browse the site (no login required)
2. Sign up / sign in (email + 2FA)
3. View all 5 league tiers (100 teams)
4. Start and simulate seasons (day/week/month)
5. Track standings with promotion/relegation zones
6. Create a player (5-step wizard)
7. Receive and sign contract offers
8. Mobile responsive with bottom nav

## ❌ What Doesn't Work Yet

1. Data doesn't persist (refresh = gone)
2. No real authentication (mock only)
3. Can't stake on teams
4. No real money/tokens
5. No team ownership
6. Player stats don't update during games
7. Backend not deployed

---

## 🎯 Target Timeline

- **Weeks 3-4:** Backend + database + real auth
- **Weeks 5-6:** Staking system + Solana contracts
- **Weeks 7-8:** Team ownership + auctions + polish
- **Target MVP launch:** ~Late April 2026

---

*This is the single source of truth for DiamondChain project status. All other docs provide detail on specific subsystems.*
