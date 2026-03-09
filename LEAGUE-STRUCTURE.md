# Baseball League Structure - Tiered System (GLB-Style)

## Overview
**Promotion/Relegation system** inspired by GoalLineBlitz and European soccer.

Teams compete within their tier. Winners move up, losers move down.

---

## Tier Structure

### Tier 1: Diamond League (Elite)
- **Teams:** 10
- **Promotion from:** Top 2 from Platinum League
- **Relegation to:** Bottom 2 to Platinum League
- **Prestige:** Highest
- **Staking multiplier:** 1.5x revenue
- **AI difficulty:** Hardest

### Tier 2: Platinum League
- **Teams:** 16
- **Promotion from:** Top 2 from Gold League
- **Relegation to:** Bottom 2 to Gold League
- **Promote to:** Top 2 to Diamond League
- **Staking multiplier:** 1.3x revenue
- **AI difficulty:** Hard

### Tier 3: Gold League
- **Teams:** 20
- **Promotion from:** Top 3 from Silver League
- **Relegation to:** Bottom 3 to Silver League
- **Promote to:** Top 2 to Platinum League
- **Staking multiplier:** 1.1x revenue
- **AI difficulty:** Medium

### Tier 4: Silver League
- **Teams:** 24
- **Promotion from:** Top 4 from Bronze League
- **Relegation to:** Bottom 4 to Bronze League
- **Promote to:** Top 3 to Gold League
- **Staking multiplier:** 1.0x revenue
- **AI difficulty:** Medium

### Tier 5: Bronze League (Entry Level)
- **Teams:** 30
- **Promotion from:** New teams start here
- **Relegation to:** None (can't go lower)
- **Promote to:** Top 4 to Silver League
- **Staking multiplier:** 0.8x revenue
- **AI difficulty:** Easy

**Total teams:** 100 (10 + 16 + 20 + 24 + 30)

---

## Promotion/Relegation Rules

### Between Seasons
At the end of each season:

1. **Automatic promotion** - Top X teams move up
2. **Automatic relegation** - Bottom X teams move down
3. **New teams** - Always start in Bronze League
4. **Team death** - Teams with 0 stakers dissolve (only in Bronze)

### Playoff System (Optional)
For more drama, could add:
- **Promotion playoffs** - Teams 3-6 fight for last spot
- **Relegation playoffs** - Teams fighting to avoid drop

---

## Season Structure

### Within Each Tier
- **Games per team:** 162 (play everyone in tier ~8-10 times)
- **Season length:** 180 days
- **Cross-tier games:** None during regular season
- **All-Star game:** Top players from each tier (mid-season)

### Inter-Tier Tournament (Playoffs)
After regular season:
- **Tier Champions Cup** - Top 2 from each tier compete
- **Relegation Battle** - Bottom teams fight to stay up
- **Prize pools** - Championship bonuses

---

## Staking Implications

### Revenue Multipliers
- **Diamond League:** 1.5x (high risk, high reward)
- **Platinum League:** 1.3x
- **Gold League:** 1.1x
- **Silver League:** 1.0x (baseline)
- **Bronze League:** 0.8x (safer, lower returns)

### Why This Works
- **Risk/reward balance** - Higher tiers = more revenue but harder competition
- **Smart staking** - Stake on strong Bronze team about to promote
- **Contrarian plays** - Stake on relegated Diamond team (value buy)
- **Long-term strategy** - Follow a team through the tiers

---

## Team Progression Examples

### Success Story
```
Season 1: Bronze League (4th place) → Promoted to Silver
Season 2: Silver League (2nd place) → Promoted to Gold
Season 3: Gold League (1st place) → Promoted to Platinum
Season 4: Platinum League (1st place) → Promoted to Diamond
Season 5: Diamond League (Champion!) 🏆
```

### Roller Coaster
```
Season 1: Diamond League (10th place) → Relegated to Platinum
Season 2: Platinum League (16th place) → Relegated to Gold
Season 3: Gold League (1st place) → Promoted to Platinum
Season 4: Platinum League (5th place) → Stay in Platinum
```

---

## AI Team Distribution

Teams spread across tiers by skill:

### Diamond League (10 teams)
- Overall rating: 85-95
- Best players, best AI managers
- "Yankees", "Dodgers" equivalent

### Platinum League (16 teams)
- Overall rating: 75-85
- Strong contenders

### Gold League (20 teams)
- Overall rating: 65-75
- Competitive mid-tier

### Silver League (24 teams)
- Overall rating: 55-65
- Developing teams

### Bronze League (30 teams)
- Overall rating: 45-55
- Entry-level teams
- New human-owned teams start here

---

## UI Changes Needed

### Season Dashboard
- Show ALL tiers, not just one standings table
- Tabs for each league
- Highlight promotion/relegation zones

### Team Cards
- Badge showing tier (Diamond, Platinum, etc.)
- "Promoted!" or "Relegated" badges
- Historical tier progression chart

### Staking Interface
- Filter by tier
- Show tier risk/reward info
- "About to promote" indicator
- "Relegation battle" warning

---

## Player Value Across Tiers

### Market Dynamics
- **Diamond players:** Expensive, high stats
- **Bronze players:** Cheap, room to grow
- **Free agency:** Players prefer higher tiers
- **Trades:** Cross-tier trades possible (but rare)

### Salary Cap by Tier
- **Diamond:** $10M salary cap
- **Platinum:** $7M
- **Gold:** $5M
- **Silver:** $3M
- **Bronze:** $2M

Forces roster management as teams promote (can't keep everyone).

---

## Narrative Hooks

### Stories Write Themselves
- **Cinderella runs** - Bronze team fighting to Diamond
- **Fallen giants** - Former champs struggling in Silver
- **Yo-yo teams** - Up and down between tiers
- **Ownership rivalries** - Following rivals through tiers
- **Relegation drama** - Final day battles to avoid drop

---

## Technical Implementation

### Data Structure
```typescript
interface League {
  id: string;
  name: string;
  tier: number; // 1-5
  teams: Team[];
  promotionSlots: number;
  relegationSlots: number;
  revenueMultiplier: number;
}

interface Team {
  // ... existing fields
  currentTier: number;
  tierHistory: TierHistory[];
  promotionStatus?: 'promoted' | 'relegated' | 'stayed';
}

interface TierHistory {
  season: number;
  tier: number;
  finalRank: number;
  record: { wins: number; losses: number };
}
```

### Season End Logic
```typescript
function processPromotionRelegation(leagues: League[]): void {
  leagues.forEach(league => {
    const standings = getStandings(league);
    
    // Promote top X
    const promoted = standings.slice(0, league.promotionSlots);
    promoteTeams(promoted, league.tier - 1);
    
    // Relegate bottom X
    const relegated = standings.slice(-league.relegationSlots);
    relegateTeams(relegated, league.tier + 1);
  });
}
```

---

## Launch Strategy

### Season 0 (Initial Seeding)
- Generate 100 teams
- Distribute by AI skill rating
- Run short "preseason" to balance

### Season 1 (First Real Season)
- All leagues active
- Track promotion/relegation
- Educate users on system

### Season 2+ (Steady State)
- Normal promotion/relegation flow
- New teams enter at Bronze
- Veteran teams fight for Diamond

---

## Advantages Over Flat League

✅ **More competitive** - Teams face similar skill levels  
✅ **Better for new teams** - Don't face juggernauts immediately  
✅ **Rewards excellence** - Path to prove you're best  
✅ **Relegation drama** - High stakes for all teams  
✅ **Long-term engagement** - Follow a team's journey  
✅ **Staking strategy** - More ways to be smart  
✅ **Natural balance** - System self-corrects over time  

---

## Next Steps

1. **Update SeasonManager** - Handle multiple leagues
2. **Update MockDataGenerator** - Distribute teams by tier
3. **UI updates** - Show all tiers, promotion zones
4. **Staking adjustments** - Tier-based multipliers
5. **Promotion/relegation logic** - Season-end processing

---

**Status:** Design complete, ready to implement  
**Timeline:** 2-3 hours to rebuild league structure  
**Impact:** MUCH more engaging than flat league  

🦞⚾ Let's build it!
