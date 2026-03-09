# ⚾ DiamondChain Baseball - MVP

A blockchain-based baseball management game with season-long staking, AI team management, and competitive gameplay.

## 🎮 Current Features (MVP v0.2)

### ✅ Working Now
- **Full Game Simulation Engine** - Stats-based baseball games with realistic outcomes
- **Season Management** - 162-game season with day-by-day or fast-forward simulation
- **AI Team Managers** - All 30 teams managed by AI (lineup optimization, strategy)
- **Live Games Feed** - See recent game results with highlights, scores, revenue
- **League Standings** - Real-time standings with win/loss records, streaks
- **Season Dashboard** - Control panel to start season, simulate days/weeks/months

### 🚧 In Progress
- Staking system (UI + smart contracts)
- Team ownership auctions
- Collateralized loans
- NFT staking receipts

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/valettavamps/baseball-game.git
cd baseball-game

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🎯 How to Test the Game Engine

1. **Navigate to Season Dashboard** (📅 Season in sidebar)
2. **Click "Start Season"** - Initializes the 2026 season with 30 teams
3. **Simulate games:**
   - "Simulate 1 Day" - Run one day of scheduled games
   - "Simulate 1 Week" - Fast-forward 7 days
   - "Simulate 1 Month" - Fast-forward 30 days
4. **Watch the results:**
   - Live Games Feed shows recent completed games
   - Standings update in real-time
   - Click on games to see highlights

## 📁 Project Structure

```
src/
├── engine/              # Game simulation engine
│   ├── GameSimulator.ts      # Core baseball game simulation
│   ├── SeasonManager.ts      # Season orchestration & scheduling
│   ├── AIManager.ts          # AI team management
│   └── MockDataGenerator.ts  # Test data generation
├── components/          # React components
│   ├── LiveGamesFeed.tsx     # Game results display
│   ├── SeasonControl.tsx     # Season control panel
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── CryptoBanner.tsx
├── pages/              # Main pages
│   ├── SeasonPage.tsx        # Season dashboard (NEW!)
│   ├── HomePage.tsx
│   └── PlayersPage.tsx
├── types/              # TypeScript types
│   └── index.ts
└── styles/             # Global styles
    └── globals.css           # PFL-inspired dark theme
```

## 🎨 Design System

**Theme:** Dark mode with PFL-inspired aesthetics
- Primary accent: Cyan (#00d4aa)
- Secondary accent: Purple (#7c3aed)
- Dark backgrounds with gradient accents
- Monospace fonts for stats/numbers

## 📊 Game Mechanics (Implemented)

### Game Simulation
- **Stats-based probability** - Contact, power, speed, discipline vs velocity, control
- **Realistic outcomes** - Singles, doubles, triples, home runs, strikeouts, walks, errors
- **Revenue calculation** - Attendance × ticket price + concessions + win bonuses
- **Highlight generation** - Key plays and big innings automatically flagged

### AI Management
- **Optimal lineups** - Leadoff hitters (speed + contact), power in 3-4-5 slots
- **Pitcher rotation** - Rest days tracked, best available pitcher chosen
- **In-game strategy** - Stealing, bunting, pitching changes based on situation
- **Performance-based adjustments** - AI gets more aggressive when struggling

### Season Lifecycle
1. **Upcoming** - Season created, teams ready
2. **Active** - Games simulated day-by-day
3. **Completed** - Final standings, payouts calculated

## 🔜 Next Steps (Roadmap)

### Phase 1: Core Staking (2-3 weeks)
- [ ] Staking UI (browse teams, deposit tokens)
- [ ] Smart contracts (Solana SPL tokens)
- [ ] Season-end payout distribution
- [ ] User accounts & wallets

### Phase 2: Ownership (2-3 weeks)
- [ ] Team auction system
- [ ] Owner dashboard (set lineups, make trades)
- [ ] Collateralized borrowing
- [ ] NFT staking receipts

### Phase 3: Social & Polish (2-3 weeks)
- [ ] Discord integration
- [ ] Leaderboards
- [ ] Advanced analytics
- [ ] Mobile optimization

## 💰 Economic Model

### Staking
- Stake CROWN/DERBY tokens on teams at season start
- 70% of team revenue distributed to stakers
- Season-long lock (180 days)
- Returns based on team performance

### Revenue Sources
- Game attendance (ticket sales + concessions)
- Win bonuses
- Championship payouts
- Merchandise & sponsorships (future)

### Platform Fees
- 2.5% staking deposit/withdrawal
- 10% auction house take
- 5% secondary market sales
- Revenue split: 30% founder, 20% ops, 25% player rewards, 15% marketing, 10% treasury

## 🧪 Testing Notes

**Current test data:**
- 30 teams generated with unique names
- ~26 players per team (10 pitchers, 16 position players)
- Stats follow normal distribution for realism
- Season = 162 games over 180 days

**Performance:**
- Can simulate full season (~2,430 games) in ~10-15 seconds
- Real-time simulation: ~1-2 games/second
- No backend needed (all client-side for now)

## 🐛 Known Issues

- [ ] No persistent storage (refresh = new season)
- [ ] Player stats don't update during season (coming soon)
- [ ] Mobile UI needs optimization
- [ ] No authentication yet

## 📚 Documentation

See the `/docs` folder for detailed design documents:
- `staking-leverage-math.md` - Economic model & formulas
- `team-ownership-auction.md` - Auction mechanics
- `platform-economics.md` - Revenue breakdown
- `gameplay-design.md` - Hybrid staker/owner model
- `PROGRESS.md` - Development status

## 🤝 Contributing

This is currently a solo project (John + Clawdia AI assistant), but contributions welcome!

## 📝 License

TBD

## 🦞 Built with AI

Game engine and UI components built with assistance from OpenClaw AI (Clawdia).

---

**Status:** MVP Core Engine Complete ✅  
**Next:** Smart Contracts & Staking UI  
**Timeline:** 4-6 weeks to full MVP launch
