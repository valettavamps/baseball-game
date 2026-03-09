# Baseball Game: Staking & Leverage System - Mathematical Model

## Overview
Season-long commitment staking where users stake on teams at the beginning of the season. Returns are distributed at season end based on team performance. Owners can leverage their staked positions through collateralized borrowing and tradable staking receipts.

---

## 1. Core Staking Mechanics

### 1.1 Initial Stake
At the beginning of season `s`, user `u` stakes amount `S_u` on team `t`:

```
S_u,t,s = amount staked by user u on team t in season s
```

### 1.2 Total Pool per Team
```
P_t,s = Σ S_u,t,s   (sum of all stakes on team t in season s)
```

### 1.3 User's Ownership Share
```
O_u,t,s = S_u,t,s / P_t,s   (user's % of team's staking pool)
```

**Example:**
- Team A has 3 stakers:
  - Alice stakes $10,000
  - Bob stakes $5,000
  - Carol stakes $5,000
- Total pool: $20,000
- Alice's share: 10,000 / 20,000 = 50%
- Bob & Carol: 25% each

---

## 2. Performance-Based Returns

### 2.1 Team Revenue Generation
Team revenue `R_t,s` comes from:
- Game wins: `W_t,s × win_value`
- Championship bonuses: `C_t,s`
- Stadium operations: `SO_t,s`
- Merchandise/sponsorships: `M_t,s`

```
R_t,s = (W_t,s × win_value) + C_t,s + SO_t,s + M_t,s
```

### 2.2 Reward Pool Distribution
A portion of team revenue goes to stakers (e.g., 70%):

```
Reward_Pool_t,s = R_t,s × staker_cut   (where staker_cut = 0.7)
```

Remaining 30% = team operations, league treasury, etc.

### 2.3 User Payout at Season End
```
Payout_u,t,s = S_u,t,s + (Reward_Pool_t,s × O_u,t,s)
```

**Return on Investment:**
```
ROI_u,t,s = (Payout_u,t,s - S_u,t,s) / S_u,t,s × 100%
```

**Effective APR:**
```
APR_u,t,s = ROI_u,t,s × (365 / season_days)
```

**Example:**
- Alice staked $10,000 on Team A (50% ownership)
- Team A generates $30,000 revenue
- Reward pool = $30,000 × 0.7 = $21,000
- Alice's share = $21,000 × 0.5 = $10,500
- Alice's total payout = $10,000 (principal) + $10,500 (returns) = $20,500
- ROI = ($10,500 / $10,000) × 100% = 105%
- If season = 180 days, APR = 105% × (365/180) = 212.9%

---

## 3. Collateralized Borrowing System

### 3.1 Loan-to-Value (LTV) Ratio
Owner can borrow against their staked position:

```
Max_Loan_u,t,s = S_u,t,s × LTV_ratio   (where LTV_ratio = 0.60 to 0.80)
```

**Conservative:** LTV = 0.60 (borrow up to 60% of stake)  
**Aggressive:** LTV = 0.80 (borrow up to 80% of stake)

### 3.2 Loan Terms
```
L_u,t,s = amount borrowed by user u
I = annual interest rate (e.g., 12-20%)
D = duration in days
```

**Interest Accrued:**
```
Interest_u,s = L_u,t,s × I × (D / 365)
```

### 3.3 Loan Repayment Options

**Option A: Repay Early**
User repays anytime during season:
```
Repayment_Amount = L_u,t,s + Interest_u,s
```
Frees up collateral immediately.

**Option B: Deduct at Season End**
Loan + interest deducted from final payout:
```
Net_Payout_u,t,s = Payout_u,t,s - (L_u,t,s + Interest_u,s)
```

### 3.4 Liquidation Protection
If projected payout falls below loan value (risky scenario):

```
If: (S_u,t,s + Projected_Returns_u,t,s) < (L_u,t,s + Interest_u,s) × 1.1
Then: Warning issued, owner must repay or accept loss
```

1.1 = 10% safety buffer

**Example:**
- Alice staked $10,000 on Team A
- Takes out loan: $10,000 × 0.70 = $7,000 (70% LTV)
- Interest rate: 15% APR
- Season duration: 180 days
- Interest accrued: $7,000 × 0.15 × (180/365) = $517.81
- Total owed: $7,000 + $517.81 = $7,517.81

**Scenario A:** Team does well
- Alice's payout = $20,500 (from earlier example)
- After loan repayment = $20,500 - $7,517.81 = $12,982.19
- Net ROI = ($12,982.19 - $10,000) / $10,000 = 29.82%
- But Alice had $7,000 liquidity during season!

**Scenario B:** Team does poorly
- Team generates only $5,000 revenue
- Reward pool = $5,000 × 0.7 = $3,500
- Alice's share = $3,500 × 0.5 = $1,750
- Alice's payout = $10,000 + $1,750 = $11,750
- After loan repayment = $11,750 - $7,517.81 = $4,232.19
- Net loss = $10,000 - $4,232.19 = $5,767.81 (57.7% loss)

**Risk management:** Alice still keeps $4,232.19, not a total loss, but heavy penalty for poor team + leverage.

---

## 4. Tradable Staking Receipts (NFTs)

### 4.1 Staking NFT Minted on Stake
When user stakes, they receive an NFT representing:
```
NFT_u,t,s = {
  principal: S_u,t,s,
  team: t,
  season: s,
  ownership_share: O_u,t,s,
  loan_amount: L_u,t,s (if borrowed),
  projected_payout: P_projected_u,t,s
}
```

### 4.2 Secondary Market Pricing
NFT value fluctuates based on team performance mid-season:

```
Market_Value_NFT = S_u,t,s + Expected_Returns - Risk_Discount - Outstanding_Loan
```

**Expected Returns:**
```
Expected_Returns = (Projected_R_t,s × 0.7) × O_u,t,s
```

Based on current team record, revenue trajectory.

**Risk Discount:**
```
Risk_Discount = Expected_Returns × volatility_factor
```

Volatility increases mid-season (uncertainty).

### 4.3 Selling on Secondary Market

**Day 0 (Season Start):**
- NFT value ≈ S_u,t,s (principal only, no returns yet)

**Mid-Season (90 days in):**
- Team performing well → NFT trades at premium
- Team struggling → NFT trades at discount

**Example:**
- Alice's Team A NFT (from $10,000 stake, 50% ownership)
- Day 90: Team A has strong record, projected $35,000 revenue
- Projected payout = $10,000 + ($35,000 × 0.7 × 0.5) = $22,250
- Risk discount = 20% of returns = $2,450 (half season left, uncertainty)
- Market value = $10,000 + $12,250 - $2,450 = $19,800
- Alice sells for $19,800 (locked in $9,800 profit early)
- Buyer takes over position, receives full $22,250 at season end if projection holds

**If Alice had a loan:**
- Outstanding loan + interest = $7,517.81
- Market value = $19,800 - $7,517.81 = $12,282.19
- Buyer assumes the loan obligation

---

## 5. Advanced Formulas

### 5.1 Dynamic LTV Based on Team Performance
Adjust LTV based on team win rate:

```
LTV_ratio = base_LTV × (1 + performance_multiplier)

performance_multiplier = (W_t,current / games_played - 0.5) × volatility
```

**Example:**
- Base LTV = 0.65
- Team win rate = 70% (0.70)
- Volatility = 0.5
- Performance multiplier = (0.70 - 0.5) × 0.5 = 0.10
- Adjusted LTV = 0.65 × 1.10 = 0.715 (71.5%)

Good teams = higher leverage capacity.

### 5.2 Weighted APR Across Multiple Teams
User stakes on multiple teams:

```
Portfolio_APR = Σ (APR_u,t,s × S_u,t,s) / Σ S_u,t,s
```

Diversification across teams smooths returns.

### 5.3 Liquidation Threshold
Auto-liquidate if collateral falls below safety threshold:

```
If: Current_Value_u,t,s < Outstanding_Loan × 1.15
Then: Force sell NFT on secondary market or repay
```

1.15 = 115% collateralization requirement.

### 5.4 Yield Optimization
For stakers who don't borrow, bonus APR:

```
Bonus_APR = base_APR × (1 + no_leverage_bonus)
```

**Example:**
- Base APR = 50%
- No-leverage bonus = 0.10 (10%)
- Total APR = 50% × 1.10 = 55%

Incentivizes holding without borrowing (lower risk for protocol).

---

## 6. Economy Parameters (Initial Suggestions)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Staker cut | 70% | 70% of team revenue to stakers |
| LTV ratio | 60-80% | Borrow up to 60-80% of stake |
| Loan interest | 12-20% APR | Higher than traditional loans (risk premium) |
| No-leverage bonus | 10% | Extra APR for not borrowing |
| Liquidation threshold | 115% | Minimum collateralization |
| Season length | 162 games / ~180 days | Standard baseball season |
| Win value | Dynamic | Based on ticket sales, merch, etc. |
| Secondary market fee | 2.5% | Fee on NFT sales |

---

## 7. Risk Analysis

### 7.1 User Risks
- **Team underperformance** → low/negative returns
- **Over-leverage** → loan eats into returns or causes loss
- **Illiquidity** → locked until season end (unless sell NFT at discount)
- **Market risk** → NFT might sell below intrinsic value mid-season

### 7.2 Protocol Risks
- **Under-collateralization** → loans exceed payout value
- **Mass liquidations** → if many teams underperform simultaneously
- **NFT market manipulation** → wash trading, price manipulation

### 7.3 Mitigation Strategies
- Conservative LTV caps (60-70%)
- Dynamic interest rates based on risk
- Circuit breakers for liquidations
- Monitored secondary market (anti-manipulation)
- Insurance pool (from protocol fees)

---

## 8. Example: Full Season Simulation

### Setup
- **3 teams:** Team A (strong), Team B (mid), Team C (weak)
- **3 stakers:** Alice ($10k on A), Bob ($5k on B), Carol ($5k on C)
- **Alice borrows:** $7,000 @ 15% APR
- **Season:** 180 days

### Season End Results

**Team A (Strong):**
- Revenue: $40,000
- Reward pool: $28,000
- Alice gets: $28,000 (she's 100% of Team A pool for this example)
- Alice's payout: $10,000 + $28,000 = $38,000
- Loan repayment: $7,000 + $517.81 = $7,517.81
- Net: $38,000 - $7,517.81 = $30,482.19
- ROI: 204.8%

**Team B (Mid):**
- Revenue: $15,000
- Reward pool: $10,500
- Bob gets: $10,500 (100% of Team B pool)
- Bob's payout: $5,000 + $10,500 = $15,500
- No loan
- ROI: 210%

**Team C (Weak):**
- Revenue: $3,000
- Reward pool: $2,100
- Carol gets: $2,100
- Carol's payout: $5,000 + $2,100 = $7,100
- No loan
- Loss: -$2,900 (-58%)

---

## Next Steps for White Paper

1. **Tokenomics section** - utility token, governance, fees
2. **Game theory** - Nash equilibrium, strategy depth
3. **Technical architecture** - smart contracts, oracles, NFT standards
4. **Revenue projections** - platform fees, sustainability
5. **Roadmap** - MVP → mainnet launch → Season 1

---

---

## 9. Team Ownership Auction System

### 9.1 Overview
- **All teams start AI-managed** (minor league default)
- **Auction system** for human ownership takeover
- **Regular auction format:** highest bidder at end wins
- AI continues managing unsold teams (no forcing sales)

### 9.2 Auction Mechanics (TBD)

Questions to resolve:
1. **Auction duration** - How long? (24h, 7 days, until season start?)
2. **Reserve price** - Minimum bid required? (e.g., $1,000 USD or token equivalent)
3. **Bid increments** - Minimum increase per bid? (e.g., 5%)
4. **Auction timing** - Pre-season only? Or can ownership change mid-season?
5. **Buyout option** - Can current owner set "buy it now" price?
6. **Multiple teams** - Can one owner bid on/own multiple teams?
7. **Anti-sniping** - Does auction extend if bid in last minutes?

### 9.3 Ownership Benefits vs AI Teams

**Human-Owned Teams Get:**
- Full roster control (trades, drafts, lineups)
- Revenue strategy decisions (ticket prices, merch)
- Stadium upgrades
- Branding/customization
- Community building
- **Potential for higher revenue** (skilled management)

**AI-Managed Teams:**
- Competent but predictable
- No emotional decision-making
- Baseline revenue generation
- Still stakeable (still generate returns)
- **May actually be profitable in some markets** (efficient AI vs bad human owner)

### 9.4 Auction Revenue Distribution
Where does the auction winning bid go?

**Option A: League Treasury**
- Funds development, prize pools, events
- Grows the ecosystem

**Option B: Burn Mechanism**
- Remove tokens from circulation
- Deflationary pressure (benefits all holders)

**Option C: Staker Rewards**
- Distribute to current stakers of that team
- Rewards early believers

**Recommended: Hybrid**
- 50% → League Treasury (sustainability)
- 30% → Stakers on that team (reward believers)
- 20% → Burn (tokenomics)

### 9.5 Ownership Transfer on Secondary Market

Once owned, can ownership be resold?

**Option A: Yes, open market**
- Owners can list their team for sale anytime
- Buyers acquire management rights + staking history
- Creates team valuation market

**Option B: Auction-only**
- If owner wants to sell, goes back to auction
- Prevents backroom deals, keeps transparent

**Option C: Hybrid**
- Owner can sell privately, but 10% fee to league
- Or put back in auction with no fee

---

**Document Status:** Draft v1.1  
**Date:** 2026-03-09  
**Author:** Clawdia 🦞  
**Updates:** Added team ownership auction mechanics  
**Next:** Define auction parameters, integrate into white paper
