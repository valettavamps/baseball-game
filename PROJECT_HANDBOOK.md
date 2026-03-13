# ⚾ DIAMONDCHAIN BASEBALL - PROJECT DOCUMENTATION

## 📋 Overview
**Project:** DiamondChain Baseball - A blockchain baseball management simulation game  
**GitHub:** https://github.com/valettavamps/baseball-game  
**Frontend:** Netlify (simforgebaseball.netlify.app)  
**Database:** Supabase (yawtkdwhvccveuttvffu.supabase.co)

---

## ✅ ACCOMPLISHED (2026-03-12)

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
- ✅ Live game visualizer on homepage
- ✅ Sample game displays with mock rosters

### What's Not Connected Yet
- ❌ Game engine not connected to live visualizer
- ❌ No real games being simulated
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
1. **Connect engine to visualizer** - Run actual games through PlateDisciplineEngine and display results
2. **Create real team/league data** - Generate teams with player rosters in Supabase
3. **Game scheduling system** - Set up games between teams, track schedule
4. **Run full 9-inning simulations** - End-to-end game flow

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
- `src/engine/PlateDisciplineEngine.ts` - Core simulation logic
- `src/engine/types/LeagueSettings.ts` - League configuration
- `src/engine/types/PlayerTypes.ts` - Player attributes & fatigue

### Visualizer
- `src/components/LiveGameVisualizer.tsx` - Main game display
- `src/components/BaseballField.tsx` - Field rendering

### Pages
- `src/pages/HomePage.tsx` - Homepage with visualizer
- `src/pages/LiveGamePage.tsx` - Standalone game page (demo)

### Data
- `src/services/db.ts` - Database operations (Supabase + localStorage fallback)

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
1. Read this file first
2. Check Supabase is still connected (tables exist)
3. Run `npm install` if needed
4. Build with `npm run build`
5. Deploy happens automatically via Netlify/GitHub

**Key insight:** The simulation engine exists but isn't connected to the visualizer yet. Next step is wiring them together.

---

*Last updated: 2026-03-12*
*Maintainer: valettavamps*
