# Team Ownership Auction System

## Core Philosophy
**AI-managed teams are first-class citizens, not placeholders.**  
Human ownership is a premium feature, not a requirement.

---

## 1. Auction Format: English Auction (Ascending Price)

### Why English Auction?
- **Transparent** - everyone sees current bid
- **Simple** - familiar to users (eBay style)
- **Price discovery** - market determines fair value
- **Excitement** - competitive bidding creates engagement

### Basic Flow
1. Team put up for auction
2. Minimum starting bid (reserve price)
3. Users place bids (must exceed current by minimum increment)
4. Auction ends at fixed time OR after X minutes of no new bids
5. Highest bidder wins ownership

---

## 2. Auction Parameters (Recommended Starting Values)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Duration** | 7 days | Full week allows global participation |
| **Reserve price** | $500 USD (or token equiv) | Low enough for accessibility, high enough to signal commitment |
| **Min bid increment** | 5% of current bid | Prevents penny-bidding spam |
| **Anti-snipe extension** | +10 minutes if bid in last 10 min | Prevents last-second sniping |
| **Max extensions** | 5 extensions (50 min total) | Eventually auction must close |
| **Bid deposit** | 10% of bid | Prevents frivolous bidding |
| **Auction frequency** | Pre-season (annually) | Ownership = full season commitment |

---

## 3. Anti-Snipe Mechanism

### Problem
Without protection, auctions become "whoever bids in the last second wins."

### Solution: Auto-Extension
```
If new_bid.timestamp > (auction_end - 10 minutes):
    auction_end += 10 minutes
    extensions_count += 1
    
If extensions_count >= 5:
    auction_end = fixed (no more extensions)
```

**Example Timeline:**
- Auction set to end at 7:00 PM
- Bid at 6:52 PM → extends to 7:10 PM
- Bid at 7:08 PM → extends to 7:20 PM
- Bid at 7:18 PM → extends to 7:30 PM
- ... up to 5 extensions max (7:50 PM hard stop)

This gives serious bidders a chance to respond without infinite extensions.

---

## 4. Bid Deposit System

### Purpose
- Prevents spam bidding
- Ensures bidders have funds
- Discourages bid-and-abandon

### Mechanics
```
When placing bid:
    deposit = bid_amount × 0.10  (10%)
    lock deposit in escrow
    
When outbid:
    return deposit to previous bidder
    
When auction ends:
    winner's deposit → part of payment
    winner pays remaining 90%
```

**Example:**
- Alice bids $1,000 → $100 deposited
- Bob bids $1,200 → $120 deposited, Alice gets $100 back
- Carol bids $1,500 → $150 deposited, Bob gets $120 back
- Auction ends, Carol wins
- Carol pays remaining $1,350 (already paid $150 deposit)
- Total: $1,500 paid for team ownership

### Failed Payment
If winner doesn't pay within 24 hours:
- Forfeit deposit (penalty)
- Team goes to second-highest bidder (at their bid price)
- Or team goes back to AI management

---

## 5. Ownership Duration & Renewals

### Model 1: Season-Based Ownership
- Owner purchases team for **one season** (e.g., 180 days)
- At season end, team goes back to auction
- Former owner can bid again (no special advantage)
- **Pro:** Keeps market dynamic, prevents hoarding
- **Con:** No long-term team building incentive

### Model 2: Perpetual Ownership
- Owner purchases team **permanently**
- Can sell anytime on secondary market
- Or forfeit back to auction pool
- **Pro:** Long-term incentive, team identity/brand building
- **Con:** Could create ownership monopolies

### Model 3: Hybrid (Recommended)
- **First season:** Auction winner gets 1-year ownership
- **After Season 1:** If owner did well (team revenue > baseline), they get:
  - **Right of first refusal** on next season auction
  - **Discount:** Can match highest bid minus 10%
- **If owner did poorly:** No special rights, fair auction
- **Pro:** Rewards good ownership, prevents bad owners squatting

---

## 6. Multiple Team Ownership

### Should one owner be allowed to own multiple teams?

**Option A: One Team per Owner**
- Prevents monopolies
- Spreads ownership across community
- More fair/decentralized

**Option B: Unlimited**
- Free market (if you can afford it, go ahead)
- Could lead to super-owners (whale dominance)

**Option C: Tiered Limits (Recommended)**
- **Default:** 1 team per owner
- **Achievement unlock:** Own 2+ teams if:
  - Owned successfully for 2+ seasons OR
  - Governance token holder (top tier) OR
  - Special NFT holder

Creates prestige/progression system while preventing early whales.

---

## 7. Auction Revenue Distribution

### Model: 50% / 30% / 20% Split

```
Total_Auction_Revenue = Winning_Bid

League_Treasury = Total × 0.50
Staker_Rewards = Total × 0.30
Token_Burn = Total × 0.20
```

### Example
Team X sells for $10,000:
- **$5,000** → League Treasury (dev fund, events, growth)
- **$3,000** → Distributed to Team X stakers (reward early believers)
- **$2,000** → Burn tokens (deflationary, benefits all holders)

### Staker Distribution Formula
```
For each staker u on team t:
    staker_payout_u = (S_u,t / P_t) × Staker_Rewards

Where:
    S_u,t = user's stake on team t
    P_t = total staked on team t
    Staker_Rewards = 30% of auction revenue
```

**Example:**
- Alice staked $2,000 on Team X (40% of $5,000 pool)
- Team X sells for $10,000 at auction
- Staker rewards = $10,000 × 0.30 = $3,000
- Alice gets: $3,000 × 0.40 = $1,200 bonus (on top of season returns)

This incentivizes early staking on undervalued teams.

---

## 8. AI Team Management Quality Tiers

Not all AI teams should be equal. Create tiers:

### Tier 1: Basic AI (Free Teams)
- Competent but predictable
- Conservative strategies
- Baseline revenue generation
- **Use case:** Placeholder teams, small markets

### Tier 2: Advanced AI (Premium Teams)
- Better strategy engines
- More adaptive
- Higher revenue potential
- **Unlock:** League votes to upgrade an AI team
- **Cost:** Treasury pays for upgrade

### Tier 3: Community-Managed AI
- DAO-style management (stakers vote on decisions)
- Hybrid human/AI (AI proposes, community approves)
- **Use case:** Teams with no single owner but engaged community

This ensures AI teams aren't just "filler" — they can be competitive.

---

## 9. Mid-Season Ownership Changes?

Should ownership transfer be allowed mid-season?

### Option A: No (Recommended for MVP)
- Owner commits for full season (no takesies-backsies)
- Simplifies staking math (no ownership changes mid-payout)
- Prevents gaming the system (buy team after good start)

### Option B: Yes, with penalty
- Owner can list team for sale mid-season
- **Penalty:** 20% of sale price to league treasury
- New owner inherits current staking obligations
- **Pro:** Liquidity for owners who need out
- **Con:** Complex edge cases

**Recommendation:** Start with Option A (MVP), add Option B in v2 if demand exists.

---

## 10. Technical Implementation (Smart Contract Flow)

### Contract: TeamAuction.sol

```solidity
struct Auction {
    uint256 teamId;
    address currentHighBidder;
    uint256 currentBid;
    uint256 endTime;
    uint256 extensionCount;
    bool finalized;
}

function placeBid(uint256 teamId, uint256 bidAmount) external payable {
    require(msg.value >= bidAmount * 0.10, "Deposit 10%");
    require(bidAmount >= currentBid * 1.05, "Min 5% increment");
    
    // Return previous bidder's deposit
    if (currentHighBidder != address(0)) {
        payable(currentHighBidder).transfer(previousDeposit);
    }
    
    // Anti-snipe extension
    if (block.timestamp > endTime - 10 minutes && extensionCount < 5) {
        endTime += 10 minutes;
        extensionCount++;
    }
    
    auction.currentHighBidder = msg.sender;
    auction.currentBid = bidAmount;
    
    emit BidPlaced(teamId, msg.sender, bidAmount);
}

function finalizeAuction(uint256 teamId) external {
    require(block.timestamp > endTime, "Auction ongoing");
    require(!finalized, "Already finalized");
    
    // Transfer ownership
    teamOwnership[teamId] = currentHighBidder;
    
    // Distribute revenue
    uint256 treasury = currentBid * 50 / 100;
    uint256 stakers = currentBid * 30 / 100;
    uint256 burn = currentBid * 20 / 100;
    
    // Execute distributions...
    
    finalized = true;
    emit AuctionFinalized(teamId, currentHighBidder, currentBid);
}
```

---

## 11. UI/UX Considerations

### Auction Page Must Show:
- Current high bid + bidder (anonymous or public?)
- Time remaining (with live countdown)
- Bid history (transparency)
- Team stats (win/loss, revenue history, staking pool size)
- AI performance metrics (if AI-managed currently)
- Reserve price indicator (e.g., "50% to reserve")

### Bidding Experience:
- One-click bid increments (5%, 10%, 25%)
- Custom bid input
- Max bid (proxy bidding) — auto-bid up to your max
- Real-time notifications (outbid alerts)
- Mobile-friendly (bidding wars happen on phones)

---

## 12. Example Auction Scenario

### Setup
- **Team:** City Sluggers (mid-tier AI team)
- **Previous season revenue:** $25,000
- **Current staking pool:** $8,000 (10 stakers)
- **Reserve price:** $1,000
- **Auction duration:** 7 days

### Timeline

**Day 1:**
- Alice bids $1,000 (opening bid)
- Bob bids $1,200
- Carol bids $1,500

**Day 3:**
- Dave bids $2,000
- Eve bids $2,500

**Day 6:**
- Frank bids $3,500 (aggressive jump)

**Day 7, 6:55 PM (5 min left):**
- Eve bids $4,000 → extends to 7:10 PM
- Frank bids $4,500 → extends to 7:20 PM
- Eve bids $5,000 → extends to 7:30 PM
- Frank considers... decides to let Eve have it

**7:30 PM:** Auction ends. **Eve wins at $5,000.**

### Post-Auction
- Eve pays remaining $4,500 (already deposited $500)
- Revenue distribution:
  - $2,500 → League Treasury
  - $1,500 → Distributed to 10 stakers (~$150 each)
  - $1,000 → Token burn
- Eve now owns City Sluggers for the season
- AI hands over control; Eve manages roster, strategy, etc.

---

## Next Steps

1. ✅ Design auction parameters (DONE)
2. ⏳ Implement auction smart contracts
3. ⏳ Build auction UI/UX
4. ⏳ Test auction mechanics (testnet)
5. ⏳ Launch first team auctions (mainnet)

---

**Document Status:** Draft v1.0  
**Date:** 2026-03-09  
**Author:** Clawdia 🦞  
**Next:** Review with team, finalize parameters, start smart contract spec
