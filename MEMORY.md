# MEMORY.md - Long-Term Memory

## John (My Human)
- GitHub: **valettavamps**
- Has a full-time job
- Building DiamondChain baseball crypto game — I'm the developer
- Prefers fun gameplay first, economics second
- Likes letter grades over numbers, mobile-first
- Budget-conscious: uses free LLM model, wants cost-efficient approaches

## DiamondChain ⚾
- Baseball sim crypto game on Solana
- **BALLS token**: 100 = $1, in-game currency
- **CROWN token**: governance/staking
- **Repo:** https://github.com/valettavamps/baseball-game
- **Stack:** React + TypeScript (frontend on Vercel), Express (backend planned for Render.com)
- **Status:** 60% MVP complete. All details in `baseball-game/DIAMONDCHAIN-MASTER-SUMMARY.md`

### Recent Work (2026-03-09 through 2026-03-10)
- Built game engine, 5-tier leagues, player creation, contracts, auth, mobile UI
- **Fixed Vercel build → switched to GitHub Pages** — 8 pushes fixing TS errors in CreatePlayerPage.tsx
- Fixed path issue: changed homepage from `/baseball-game` to `/` so it works at root
- **STATUS:** Deployed to https://valettavamps.github.io/ but may need GitHub Pages to propagate

### Next Steps
1. **Set up Netlify** for reliable deployment (NOT Vercel)
2. Deploy frontend to Netlify (instead of GitHub Pages)
3. Test deployed site

## Environment Notes
- Exec approvals: Kilo won't allow `security: "full"` — every shell command needs manual approval
- npm install times out due to approval delays — workaround: push to GitHub and let Vercel build
- Web search (Brave) not configured
- Browser not available in sandbox
