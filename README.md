# ⚾ DiamondChain Baseball

Crypto baseball simulation game on Solana. Create players, stake on teams, compete across tiered leagues.

**Live:** [Vercel Deploy](https://baseball-game-valettavamps.vercel.app) · [GitHub Pages](https://valettavamps.github.io/baseball-game/)

## Quick Start

```bash
npm install
npm start        # http://localhost:3000
```

## What Works Now (MVP 60%)

- **Game Engine** — Full stats-based simulation (162-game seasons)
- **5-Tier Leagues** — Diamond → Bronze with promotion/relegation (100 teams)
- **Player Creation** — 5-step wizard with letter grades
- **Contract System** — Receive & sign team offers
- **Auth** — Email/password + 2FA (mock for testing)
- **Mobile** — Fully responsive with bottom nav
- **Local Persistence** — Data saved in localStorage

## Project Structure

```
src/
├── engine/          # Game simulation (GameSimulator, SeasonManager, AIManager)
├── components/      # React UI components
├── pages/           # App pages (Home, Season, Players, CreatePlayer, Auth, Offers)
├── services/        # API client + localStorage persistence
├── types/           # TypeScript type definitions
└── styles/          # Global CSS

server/              # Express backend (separate deploy to Render.com)
├── server.ts
├── dataStore.ts
└── package.json

docs/                # Design documents
├── gameplay-design.md
├── platform-economics.md
├── staking-leverage-math.md
└── team-ownership-auction.md
```

## Stack

- **Frontend:** React 18 + TypeScript
- **Backend:** Express (planned: Render.com free tier)
- **Blockchain:** Solana (Phase 2)
- **Tokens:** BALLS (in-game currency) + CROWN (governance/staking)

## Roadmap

| Phase | What | Status |
|-------|------|--------|
| 1 | Game engine + UI + player journey | ✅ Done |
| 2 | Backend API + database + real auth | ⏳ Next |
| 3 | Staking system + Solana contracts | ⏳ Planned |
| 4 | Team ownership + auctions | ⏳ Planned |
| 5 | Social features + polish + launch | ⏳ Planned |

See `DIAMONDCHAIN-MASTER-SUMMARY.md` for full project status.

## License

TBD

---

Built by John (@valettavamps) + Clawdia 🦞
