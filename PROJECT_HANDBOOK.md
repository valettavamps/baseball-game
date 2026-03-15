# ⚾ DIAMONDCHAIN BASEBALL - PROJECT DOCUMENTATION

## 📋 Overview
**Project:** DiamondChain Baseball - A blockchain baseball management simulation game  
**GitHub:** https://github.com/valettavamps/baseball-game  
**Frontend:** Netlify (simforgebaseball.netlify.app)  
**Database:** Supabase (yawtkdwhvccveuttvffu.supabase.co)

---

## ✅ ACCOMPLISHED (2026-03-14)

### Teams Page (2026-03-14)
- Created `src/pages/TeamsPage.tsx` - Full teams browser
- Created `src/pages/TeamsPage.css` - Styling
- **Features:**
  - Standings tab with full league standings sorted by wins
  - All Teams tab with teams grouped by tier (Diamond/Platinum/Gold/Silver/Bronze)
  - Tier filtering - click to filter by specific tier
  - Team detail view with stats, record, run differential, streak
  - 100 teams across 5 tiers (10 Diamond, 16 Platinum, 20 Gold, 24 Silver, 30 Bronze)
- Added to App.tsx navigation (`team` page)
- Connected to Supabase via `db.ts` functions:
  - `getAllTeamsFromDb()` - Loads/generates teams
  - `getTeamByIdDb()` - Get single team
  - `updateTeamDb()` - Update team stats

### TypeScript Fixes (2026-03-14)
- Fixed Player type in `src/types/index.ts` - Added missing fields:
  - throwingHand, battingHand, height, weight, age
  - draftYear, draftRound, draftPick, draftedBy
- Fixed JSX syntax errors in `PlayerProfilePage.tsx` - Adjacent elements wrapped in fragments

---

## ✅ ACCOMPLISHED (2026-03-13)

### Season Simulator Page (2026-03-13)
- Created `src/pages/SeasonSimulatorPage.tsx` - Full React page for season simulation
- Created `src/pages/SeasonSimulatorPage.css` - Styling
- **Features:**
  - Click button → simulate 160-game season in seconds
  - Generates 2 realistic teams with 5 pitchers + 9 position players each
  - Shows season schedule with W/L results (BaseHit-style)
  - Team batting stats: G, AB, R, H, 2B, 3B, HR, RBI, BB, SO, SB, CS, AVG, OBP, SLG, OPS
  - Team pitching stats: G, W, L, IP, H, R, ER, BB, SO, HR, ERA, WHIP
  - Batting/Pitching toggle tabs
  - Click box score to see game details (innings, score, pitchers)
  - "Run Another Season" button to re-simulate
- Added to navigation (MobileMenu → Simulator)
- **Status:** Working but stats need validation

### Engine Tuning (2026-03-13)
- Tuned `GameSimulator.js` and `GameSimulator.ts` for realistic MLB stats
- Target: ~4 runs/game, ~8.5 hits, ~1.1 HR, ~23% K, ~8% BB
- Adjusted: contact rate, hit type distribution, strikeout rate

### Stress Test Script (2026-03-13)
- Created `src/scripts/stressTest.js` - CLI tool to simulate hundreds of games and compare stats to real MLB
- Created `src/engine/GameSimulator.js` - CommonJS version of the game engine for Node.js execution
- Created `.github/workflows/stress-test.yml` - GitHub Action workflow to run stress tests
- Script generates 2 teams, simulates N games, outputs:
  - Per-game averages (runs, hits, HRs, Ks, BBs, errors)
  - Rate stats (batting avg, K%, BB%, HR%)
  - Comparison to MLB targets with ✅/⚠️ ratings
- **Purpose:** Validate engine produces realistic MLB-style statistics

### Field Visual Fixes (2026-03-13)
- Created `src/engine/FieldPositions.ts` with accurate baseball field dimensions:
  - 90ft between bases
  - 60.5ft pitcher mound to home
  - 325-400ft outfield walls
  - Proper defensive position coordinates
- Added `FIELDER_POSITIONS` with multiple configurations:
  - `standard` - normal defense
  - `shiftVsLeft` - shift vs left-handed pull hitters
  - `infieldIn` - runners on third
  - `noDoubles` - protect against extra base hits
- Updated `BaseballField.tsx` to use the new position system

### Earlier Work (2026-03-12)

### 1. Supabase Integration
- Connected app to Supabase for cloud persistence
- Created tables: users, players, teams, contract_offers
- Disabled RLS for development
- Fixed UUID/text type mismatches in schema
- Users can sign up, create players → saves to Supabase

### 2. Enhanced Game Engine
Created new engine files in `src/engine/`:
- **LeagueSettings.ts** - Per-league modifiers (HR rate, K rate, etc.)
- **PlayerTypes.ts** - Hidden attributes, endurance, consumables support
- **PlateDisciplineEngine.ts** - Realistic at-bat outcomes using plate discipline model

### 3. Visual "Dot Baseball" System
Created in `src/components/`:
- **BaseballField.tsx** - Top-down field with positioned dots (fielders, runners, batter)
- **LiveGameVisualizer.tsx** - Full game UI with scoreboard, count, play-by-play
- **LiveGameVisualizer.css** - Styling

### 4. Home Page Integration
- Added live game visualizer to homepage (below banner)
- Shows sample game with real player names

### 5. Research Documentation
Created `docs/BASEBALL-RESARCH.md` with:
- Field layout & positions
- Defensive positioning & shifts
- Pitcher endurance mechanics
- Plate discipline model (from open source research)
- Hidden vs visible attributes
- Team owner sliders design
- Consumables system
- Commissioner control center (per-league settings)

---

## 🔄 CURRENT STATE

### What's Working
- ✅ User signup/login → saves to Supabase
- ✅ Player creation → saves to Supabase  
- ✅ Teams page with standings & details
- ✅ Live game visualizer on homepage
- ✅ Sample game displays with mock rosters
- ✅ Season Simulator page - runs 160 games, shows schedule/stats

### Known Issues (2026-03-14)
- Stats may still be inflated (need validation against MLB)
- Box score modal may not display properly on mobile
- Sortable columns (click to sort) not implemented yet
- Pitching stats calculation needs improvement

### What's Not Connected Yet
- ❌ Game engine not connected to live visualizer (but Season Simulator works!)
- ❌ No commissioner control center UI
- ❌ No team owner sliders
- ❌ No consumables implemented

### Tech Stack
- **Frontend:** React + TypeScript + Vite/Create React App
- **Deployment:** Netlify
- **Database:** Supabase
- **Auth:** Custom (localStorage + Supabase)

---

## 📌 FUTURE STEPS (Priority Order)

### Phase 1: Core Simulation
1. ~~Connect engine to visualizer~~ - Season Simulator now runs full games!
2. ~~Run full 9-inning simulations~~ - Done via Season Simulator page
3. **Create real team/league data** - Generate teams with player rosters in Supabase
4. **Game scheduling system** - Set up games between teams, track schedule
5. **Player Rarity System** - Add epic/rare/common tiers to player generation:
   - Epic (~1%): 95-99 overall, special hidden attributes
   - Rare (~5%): 80-90 overall
   - Common (~94%): based on team tier
6. **Full Player Creation System** - Implement John's detailed creation mechanics:
   - Free first player, then 500 BALLS per player
   - Hitters: 7 attrs (power, contact, speed, fielding, arm, discipline, endurance), 280 pts
   - Pitchers: 4 attrs (velocity, control, movement, stamina), 160 pts
   - Random distribution: low 10, high 70 per attr
   - Rarity bonuses: Rare (+15/8 pts), Epic (+30/15 pts)
   - Paid creation: +30 extra distributable points
   - Hidden attrs + Potential (10-40 pts growth per attr)
   - Display as letter grades (A+, A, A-, B+, etc.)

### Phase 2: User Features
5. **Commissioner Control Center UI** - Page to adjust league settings (HR rate, K rate, etc.)
6. **"Copy from Last Season"** button for league settings
7. **Team Owner Dashboard** - View team, manage roster, set sliders

### Phase 3: Advanced Features
8. **Hidden attributes implementation** - clutch, durability, consistency
9. **Consumables system** - Buy/use items that affect stats
10. **Team owner sliders** - aggression, bunting, shift frequency

### Phase 4: Polish
11. **Real-time game watching** - Animations for pitches, hits, runs
12. **Play-by-play voice** - Text-to-speech game commentary
13. **Mobile optimization**

---

## 🛠️ KEY FILES

### Engine
- `src/engine/GameSimulator.ts` - Core simulation logic (9-inning games)
- `src/engine/GameSimulator.js` - CommonJS version for Node.js
- `src/engine/PlateDisciplineEngine.ts` - Pitch-by-pitch plate discipline model
- `src/engine/types/LeagueSettings.ts` - League configuration
- `src/engine/types/PlayerTypes.ts` - Player attributes & fatigue

### Pages
- `src/pages/TeamsPage.tsx` - **NEW!** Teams browser with standings & details
- `src/pages/SeasonSimulatorPage.tsx` - Full season sim with stats & box scores
- `src/pages/HomePage.tsx` - Homepage with visualizer
- `src/pages/LiveGamePage.tsx` - Standalone game page (demo)

### Data
- `src/services/db.ts` - Database operations (Supabase + localStorage fallback)
- `src/types/index.ts` - TypeScript types (Player, Team, etc.)

---

## 🔐 ENVIRONMENT VARIABLES

### Netlify
```
REACT_APP_SUPABASE_URL = https://yawtkdwhvccveuttvffu.supabase.co
REACT_APP_SUPABASE_ANON_KEY = [from Supabase Settings → API]
```

### Supabase Tables
- users
- players
- teams
- contract_offers

---

## 📚 RESEARCH DOCS

Full research available in: `baseball-game/docs/BASEBALL-RESEARCH.md`

Includes:
- Plate discipline model (from mcneo/ball open source)
- Pitcher fatigue calculations
- Endurance system (fastball = more fatigue)
- No-hit momentum overrides fatigue
- Hidden attributes design
- Team slider design
- Consumables design
- Commissioner control center design

---

## 🤖 FOR NEW AI MODEL

When resuming work:
1. Read this file (PROJECT_HANDBOOK.md) and MEMORY.md first
2. Check Supabase is still connected (tables exist)
3. Make changes locally, test with `npm run build` if possible
4. Push to GitHub - Netlify auto-deploys

**Build Issues?** Check `src/types/index.ts` for Player type fields - they must match what's used in components.

**Key insight:** The simulation engine works via Season Simulator. Teams page now shows standings.

---

*Last updated: 2026-03-14*
*Maintainer: valettavamps*
