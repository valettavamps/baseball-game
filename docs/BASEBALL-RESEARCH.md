# Baseball Simulation Research - Expert Guide 🧠⚾

## Overview
Research for building a dot-based baseball simulation game (like Goalline Blitz but for baseball).

---

## 1. Field Layout & Dimensions

### The Diamond
- **90 feet** between each base (actually ~88 ft center-to-center)
- Home plate is 5-sided, bases are 18" squares
- Bases in order: Home → 1st → 2nd → 3rd → Home

### Field Zones
```
        LF            CF             RF
        |              |              |
   300-400ft    400-450ft     300-400ft
        |              |              |
        |    LEFT      |    RIGHT    |
        |   FIELD     |    FIELD    |
        |              |              |
        |   3B    |    |    |   1B   |
        |        (infield)         |
        | SS      2B       2B      |
        |----------------------------|  <-- Infield dirt circle
        |         PITCHER            |
        |          MOUND              |
        |              |             |
        |    CATCHER (home plate)    |
        |____________________________|
```

### Position Numbers (for scorekeeping)
- 1 = Pitcher
- 2 = Catcher  
- 3 = First Baseman
- 4 = Second Baseman
- 5 = Third Baseman
- 6 = Shortstop
- 7 = Left Fielder
- 8 = Center Fielder
- 9 = Right Fielder

---

## 2. Defensive Positioning

### Standard (No Shift)
```
           7LF           8CF            9RF
                       
                       
           5 3B      4 2B      6 SS    1B 3
                       
                       
                       
                       
                      1 PITCHER
                      
                      
                      2 CATCHER
```

### Shift Examples

**Standard Shift vs Left-Handed Pull Hitter:**
- 3B moves to shortstop area (left side)
- SS moves to 2B area (right side)
- 2B plays shallow right field
- LF plays right-center
- CF shades toward right

**Extreme Shift (vs David Ortiz type):**
- SS and 2B both in outfield between 1B and 2B
- LF and CF moved toward right field
- 3B in shallow left field

### Positioning Factors
- **Batter handedness**: Shift more vs left-handed batters
- **Pull tendency**: Heavy pull hitters = more extreme shifts
- **Game situation**: Late innings, runners in scoring position
- **Pitcher handedness**: Some teams shift differently vs LHP/RHP

---

## 3. Pitch Count & Pitcher Endurance

### Real MLB Pitch Count Rules
| Age Group | Max Pitches | Required Rest |
|-----------|-------------|---------------|
| 7-8       | 50          | -             |
| 9-10      | 75          | -             |
| 11-12     | 85          | -             |
| 13-16     | 95          | -             |
| 17-18     | 105         | -             |

### MLB Starting Pitcher Guidelines
- **100 pitches** = typical "pull the plug" point
- **75-85 pitches** = efficient outing
- **120+ pitches** = rare, complete game territory
- **150+ pitches** = historically unusual (knuckleballer Edwin Jackson threw 149 in 2010 no-hitter)

### Fatigue Effects
- **< 50 pitches**: Fresh, effective
- **50-75 pitches**: Beginning to tire, velocity may drop slightly
- **75-100 pitches**: Tired, effectiveness decreases
- **100+ pitches**: High fatigue, increased walks, hits, reduced velocity
- **Endurance attribute** in sim: Higher = can pitch deeper into games

### Pitcher Types
- **Starting Pitcher**: 5-7 innings, 80-120 pitches
- **Long Reliever**: 2-4 innings
- **Middle Reliever**: 1-2 innings
- **Setup Man**: 1 inning, high leverage
- **Closer**: 1 inning, save situation
- **Opener**: New strategy, pitcher who starts but only goes 1-2 innings

---

## 4. Game Flow & At-Bat Mechanics

### The Count
- **Balls** (0-4): pitcher throwing balls
- **Strikes** (0-3): pitcher throwing strikes
- **0-0**: Full count potential
- **2 strikes**: Batter in danger (swing at anything)
- **3 balls**: Batter has advantage (wait for good pitch)

### At-Bat Outcomes
1. **Strikeout**: 3 strikes
2. **Walk (BB)**: 4 balls
3. **Single**: Ball in play, runner on 1st
4. **Double**: Ball in play, runner on 2nd
5. **Triple**: Ball in play, runner on 3rd
6. **Home Run**: Over the fence
7. **Ground Out**: Defense makes play
8. **Fly Out**: Ball caught in air
9. **Line Out**: Hard-hit ball caught
10. **Pop Out**: High fly, easy out
11. **Foul Ball**: Doesn't count unless 2 strikes (then strikeout)

### Baserunner Movement
- **Single**: Runners advance 1 base (sometimes 2 on catcher's error)
- **Double**: Runners advance 2 bases
- **Triple**: Runners advance 3 bases
- **Home Run**: All runners score
- **Ground Out (force)**: Runners advance 1 base
- **Fly Out (tag up)**: Runners advance after catch
- **Steal**: Runner takes base while pitch is thrown

---

## 5. Inning Structure

### Standard Inning
- 9 innings (like PFL races)
- Top: Away team bats
- Bottom: Home team bats
- 3 outs per half-inning
- 5-sim-per-day schedule (like PFL)

### Scoring
- **Run**: Runner crosses home plate
- **Score kept**: Team totals
- **Final**: Highest runs wins

---

## 6. Visual Representation (Dots Concept)

### Field View (Top-Down)
```
┌──────────────────────────────────────────────┐
│              OUTFIELD                         │
│   [7]         [8]           [9]            │
│   LFC         CFC            RFC            │
│                                              │
│          ════════════════                   │
│         (infield grass arc)                  │
│          ════════════════                   │
│                                              │
│   [5]     [4] [6]      [3]                 │
│   3B       2B SS        1B                 │
│                                              │
│              [1]                             │
│             PITCHER                          │
│                                              │
│              [2]                             │
│             CATCHER                          │
│              ●                               │
│            (HOME)                            │
└──────────────────────────────────────────────┘
```

### Dot Representation
- **Batter**: Highlighted dot at home plate
- **Runners**: Colored dots on bases (green = your team)
- **Fielders**: Positioned dots at their locations
- **Ball**: Small dot traveling (animated)

### Animation States
1. **Pitch**: Ball dot moves from catcher to home
2. **Swing**: Batter dot moves toward ball
3. **Contact**: 
   - Ground ball → dot moves to fielder → throw to base
   - Fly ball → dot arcs upward → fielder catches or drops
4. **Run**: Runner dots move to appropriate bases
5. **Score**: Runner dot crosses home, flash effect

---

## 7. Key Attributes for Simulation

### Batter Attributes
- **Contact**: Ability to hit ball
- **Power**: Distance on hits
- **Speed**: Running, stealing
- **Discipline**: Taking walks vs swinging
- **Arm**: Throwing strength

### Pitcher Attributes
- **Velocity**: Fastball speed
- **Control**: Strike percentage
- **Movement**: Pitch break
- **Stamina**: How deep into game
- **Hold Runner**: Preventing steals

### fielder Attributes
- **Range**: How far can reach
- **Glove**: Fielding ability
- **Arm**: Throwing accuracy/distance

---

## 8. Manager Decisions (AI & Human)

### Pitching Changes
- Pull starter when tired (100+ pitches)
- Bring in reliever for matchups (LHP vs LHB)
- Closer for save situation
- Double switches (optional complexity)

### Defensive Substitutions
- Pinch hitter for pitcher (DH league)
- Pinch runner for slow guy
- Defensive replacement in late innings
- Shift or no shift based on batter

### Lineup Management
- Leadoff: High OBP, speed
- Cleanup: Power hitter
- Rotation rest days

---

## 9. Comparison: PFL vs Your Baseball Game

| Aspect | PFL (Horse Racing) | Your Baseball |
|--------|-------------------|---------------|
| Live | Unity video | Dots animation |
| Duration | ~2 min race | ~1-2 min sim |
| Sims/day | 8-12 | 5-8 |
| Player agency | Bet/watch | Manage/watch |
| Graphics | 3D expensive | 2D dots cheap |
| Real-time | Yes | Yes |

---

## 11. Pitcher Endurance System (Advanced)

### Core Concept
Endurance is NOT just about pitch count - it's a dynamic system that affects:
- **Pitchers**: How long they can pitch effectively
- **Fielders**: Fielding ability degrades with fatigue
- **Batters**: Power and discipline drop late in games

### Pitch Count Thresholds
| Pitch Count | Starter (75+ End) | Mid (50-74 End) | Low (<50 End) |
|-------------|-------------------|-----------------|---------------|
| 0-50 | Fresh, dominant | Fresh, normal | Starting to feel it |
| 51-75 | Very effective | Normal | Tired |
| 76-100 | Still effective | Declining | Exhausted |
| 100+ | Manager decision* | Risk zone | Never reach |

*Manager may leave pitcher in past 100 if:
  - No-hitter or perfect game in progress
  - High endurance rating
  - Low pitch count per inning (efficient)

### Pitch Mix & Endurance Drain

**Fastballs drain endurance FASTER:**
- High velocity pitchers (95+) drain 1.2x normal
- Mid velocity (90-94) drain 1.0x normal
- Low velocity (<90) drain 0.8x normal

**Off-speed pitches conserve endurance:**
- Changeups: 0.7x drain
- Curveballs: 0.8x drain
- Sliders: 0.9x drain

**Example:**
- 100-pitch pitcher throwing 70% fastballs = 100 * 1.2 = 120 effective "fatigue points"
- 100-pitch pitcher throwing 70% changeups = 100 * 0.7 = 70 effective "fatigue points"

### Formula Concept
```
fatigue_points += (pitch_count * velocity_modifier * pitch_mix_modifier)
effectiveness = max(0, base_rating - (fatigue_points - threshold) * degradation_rate)
```

### No-Hitter / Perfect Game Momentum

**Real MLB Examples:**
- Pitchers often get "extra" energy in no-hitters
- Managers will break pitch count records for perfect games
- Adrenaline overrides fatigue

**Implementation:**
- Track "no-hit bid" status
- If no hits through 5 innings: reduce fatigue accumulation by 30%
- If no hits through 7 innings: reduce by 50%
- Perfect game: ignore fatigue caps

### Endurance for ALL Players

Endurance isn't just for pitchers:

**Fielders:**
- Range decreases with fatigue
- Error probability increases late in games
- Arm strength decreases (throws accuracy)

**Batters:**
- Power drops 5-10% in late innings
- Discipline decreases (more chasing)
- Contact drops slightly

**Base Runners:**
- Steal success drops
- Take extra base on hits less often

### Fatigue Recovery
- **Between games**: Full recovery in sim (instant in most games)
- **In-game**: No recovery during game
- **Season fatigue**: Some games track cumulative fatigue

---

## 12. Manager AI Decision Making

### Pitching Changes

**When to pull starter:**
1. Pitch count exceeds endurance threshold
2. Giving up contact, fatigue showing
3. Next batter is favorable matchup for reliever
4. Runners in scoring position, tired pitcher

**When to leave pitcher in:**
1. No-hitter / perfect game bid
2. Low pitch count per inning (very efficient)
3. High endurance attribute
4. Bullpen exhausted

### Defensive Decisions

**Shift Logic:**
- Track batter pull tendency (%)
- Shift if pull% > 40%
- Extreme shift if pull% > 60%
- No shift vs switch hitters, small ball teams

**In-Game Decisions:**
- Double switches (NL style)
- Defensive substitutions (9th inning)
- Intentional walks

### Lineup Management
- Rest days for regulars
- Platoon advantages (LHP vs LHB)
- Cleanup hitter protection

---

## 13. Additional Research Topics Needed

- BaseHit specifically: How does their endurance work?
- Out-of-the-box pitcher fatigue systems
- Stamina vs Endurance attribute distinction
- Recovery mechanics between games

---

## 14. Open Source Baseball Engines Found

### mcneo/ball - Python Plate Discipline Engine
**Source:** https://github.com/mcneo/ball

This engine focuses on **plate discipline** - the most realistic approach:

**Key Attributes Used:**
```python
foulball_chance  # Chance ball is fouled off when swung
babip             # Batting Average on Balls In Play
oswing            # Swing % outside the zone
zswing            # Swing % inside the zone
ocontact          # Contact % outside zone
zcontact          # Contact % inside zone
zone              # % of pitches in strike zone
fstrike           # First pitch strike %
swinging_strike   # Swinging strike %
doubles           # % of contact that's a double
triples           # % of contact that's a triple
homeruns          # % of contact that's a HR
```

**How It Works:**
1. Determine if pitch is ball or strike (based on `zone`)
2. Determine if batter swings (based on oswing/zswing)
3. Determine if contact is made (ocontact/zcontact)
4. Determine outcome (based on babip, HR%, 2B%, 3B%)

**Key Insight:** This model is much more realistic than simple random because it factors in:
- Count (balls/strikes affect behavior)
- Pitch location (in/out of zone)
- Batter discipline (swinging at balls vs strikes)
- Contact ability

### ZenGM Baseball
**Source:** https://github.com/zengm-games/zengm (uses SPORT=baseball)

Full management sim with:
- Player creation/generation
- Contract negotiations
- Season simulation
- Trades
- Uses IndexedDB for data

### Bat-Around Baseball Sim
**Source:** https://github.com/adamzev/baseball

React + Flask app using real 2017 MLB data.

---

## 15. Proposed Attribute System

### Batter Attributes (Based on Plate Discipline Research)
| Attribute | Range | Description |
|-----------|-------|-------------|
| Contact | 1-100 | Ability to make contact |
| Power | 1-100 | Hit distance, HR/2B/3B tendency |
| Speed | 1-100 | Baserunning, stealing |
| Discipline | 1-100 | Plate patience, taking walks |
| Vision | 1-100 | Ability to track ball, foul ball % |

### Pitcher Attributes
| Attribute | Range | Description |
|-----------|-------|-------------|
| Velocity | 1-100 | Fastball speed (affects fatigue) |
| Control | 1-100 | Strike % |
| Movement | 1-100 | Pitch break |
| Stamina | 1-100 | How deep can pitch |
| Endurance | 1-100 | Fatigue recovery, pitch limit |

### fielder Attributes
| Attribute | Range | Description |
|-----------|-------|-------------|
| Range | 1-100 | Balls reached |
| Glove | 1-100 | Error probability |
| Arm | 1-100 | Throw strength/accuracy |

---

## 16. Fatigue System Implementation (Refined)

Based on research + open source code analysis:

```python
# Fatigue calculation
pitch_fatigue = pitch_count * velocity_modifier * pitch_mix_modifier
fatigue_impact = (pitch_fatigue - endurance_threshold) * degradation_rate

# Effectiveness drops as fatigue increases
effective_rating = base_rating - fatigue_impact

# Pitch mix affects fatigue rate
fastball_drain = 1.2x
changeup_drain = 0.7x
curveball_drain = 0.8x
slider_drain = 0.9x

# No-hit momentum (adrenaline)
if no_hits_through(5): fatigue *= 0.7
if no_hits_through(7): fatigue *= 0.5
```

---

## 17. Hidden vs Visible Attributes

### Visible Attributes (Shown to Players)
- Overall rating
- Position
- Key stats (power, contact, speed, etc.)

### Hidden Attributes (Behind the Scenes)
- Clutch ability
- Durability/Injury likelihood
- Consistency (hot/cold streaks)
- Leadership
- Work ethic
- These affect outcomes without players knowing

### Implementation
```typescript
interface PlayerAttributes {
  // Visible
  contact: number;
  power: number;
  speed: number;
  // ... other visible

  // Hidden
  hidden?: {
    clutch: number;      // Performs better in pressure
    durability: number;  // Injury probability
    consistency: number; // Variance in performance
    leadership: number;  // Team chemistry
    workEthic: number;   // Development rate
  }
}
```

---

## 18. Team Owner Sliders

Team owners can customize team playstyle. These are EASY to add later:

### Planned Slider Categories
| Slider | Range | Effect |
|--------|-------|--------|
| Aggression | 1-100 | Steal attempts, hit & run |
| Bunting | 1-100 | Sacrifice bunt frequency |
| Shift Usage | 1-100 | How often to shift defense |
| Platoon Usage | 1-100 | Bench vs same-hand batters |
| Steal Frequency | 1-100 | Base stealing aggressiveness |
| Power vs Contact | 1-100 | Hitting approach |
| Bullpen Usage | 1-100 | When to pull starters |

### Implementation
```typescript
interface TeamSettings {
  // Gameplay sliders (owner-adjustable)
  sliders: {
    aggression: number;        // 1-100
    bunting: number;           // 1-100
    shiftFrequency: number;    // 1-100
    platoonUsage: number;      // 1-100
    stealFrequency: number;    // 1-100
    powerVsContact: number;   // 1-100
    bullpenManagement: number; // 1-100
  }
}
```

These can be added to simulation as modifiers without changing core engine!

---

## 19. Consumables System

Players can buy items that affect games/series:

### Consumable Types
| Item | Effect | Duration |
|------|--------|----------|
| Energy Drink | +5 Stamina | 1 game |
| Hot Streak | +10 Power | 1 game |
| Focus Aid | +5 Discipline | 1 game |
| Speed Boost | +5 Speed | 1 game |
| Series Pack | +3 to all | 3-game series |
| Pitcher Elixir | -10 fatigue rate | 1 game |

### Implementation
```typescript
interface ConsumableEffect {
  playerId: string;
  statModified: keyof PlayerAttributes;
  modifier: number;  // +5, -10, etc.
  duration: number;  // games or at-bats
  expiresAt: number; // timestamp
}

interface ActiveConsumables {
  playerId: string;
  effects: ConsumableEffect[];
}
```

### How They Work
1. Player uses consumable before game
2. System applies modifier to base attributes
3. During simulation, use `effectiveRating = baseRating + consumableModifier + fatigueModifier`
4. After duration, remove modifier

---

## 20. Developer Control Center (Commissioner Tools)

Essential for balancing and tweaking the simulation. Each LEAGUE has its own settings.

### Per-League Settings
Each league stores its own simulation parameters:

```typescript
interface LeagueSettings {
  leagueId: string;
  season: number;
  
  // Global simulation modifiers (raw numbers, not named presets)
  // 1.0 = league average baseline
  // 0.5 = 50% of average, 2.0 = 200% of average
  modifiers: {
    homeRunRate: number;       // HR per at-bat: 0.01 - 0.10
    hitRate: number;           // Total hits: 0.20 - 0.35
    strikeoutRate: number;     // K per at-bat: 0.10 - 0.30
    walkRate: number;          // BB per at-bat: 0.05 - 0.15
    stolenBaseRate: number;    // SB attempts: 0.50 - 0.90
    tripleRate: number;        // 3B per hit: 0.01 - 0.08
    doubleRate: number;        // 2B per hit: 0.08 - 0.20
    errorRate: number;        // Fielding errors: 0.50 - 2.0
    hitByPitchRate: number;   // HBP: 0.005 - 0.02
  };
  
  // Rule variations
  rules: {
    dhEnabled: boolean;         // Designated hitter
    infieldShiftAllowed: boolean;
    threeBatterMinimum: boolean;
    extraInningRunner: boolean;  // Runner on 2nd in extras
    designatedHitter: boolean;
  };
}
```

### Control Center UI Concept (Per League)
```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ League Settings - Bronze League (Season 1)             │
├─────────────────────────────────────────────────────────────┤
│  [📋 Copy from Last Season]  [📤 Export]  [📥 Import]    │
├─────────────────────────────────────────────────────────────┤
│  🏃 Offense                  │  💪 Pitching                │
│  ─────────────────────────    │  ─────────────────────────  │
│  Home Runs:    [0.025     ]  │  Strikeouts:  [0.180    ]   │
│  (0.010 - 0.100)            │  (0.100 - 0.300)            │
│                             │                              │
│  Hits:         [0.265     ]  │  Walks:       [0.085     ]  │
│  (0.200 - 0.350)            │  (0.050 - 0.150)            │
│                             │                              │
│  Walks:        [0.090     ]  │  HR Allowed:   [0.022     ]  │
│  (0.050 - 0.150)            │  (0.010 - 0.080)            │
│                             │                              │
│  Stolen Bases: [0.720     ]  │  ERA:          [4.20      ]  │
│  (0.500 - 0.900)            │  (2.00 - 8.00)              │
├─────────────────────────────────────────────────────────────┤
│  ⚾ Defense                                                │
│  ────────────────────────────────────────────────────────  │
│  Errors:      [1.0       ] (0.5 - 2.0)                    │
│  Shift Allowed: [✓ Yes]                                    │
├─────────────────────────────────────────────────────────────┤
│  [💾 Save Settings]  [↩️ Reset to Defaults]               │
└─────────────────────────────────────────────────────────────┘
```

### How to Use Last Season's Settings
```typescript
async function copyFromLastSeason(leagueId, currentSeason) {
  const lastSeason = currentSeason - 1;
  
  // Fetch last season's settings
  const { data: lastSettings } = await supabase
    .from('league_settings')
    .select('*')
    .eq('league_id', leagueId)
    .eq('season', lastSeason)
    .single();
  
  if (lastSettings) {
    // Copy to current season
    await supabase
      .from('league_settings')
      .insert({
        league_id: leagueId,
        season: currentSeason,
        modifiers: lastSettings.modifiers,
        rules: lastSettings.rules
      });
  }
}
```

### Implementation Notes
1. Each league has own settings stored in Supabase
2. Settings can be copied from last season with one click
3. Raw number inputs (not named presets)
4. Export/import JSON for sharing settings
5. Show baseline ranges as guidance
6. Save applies to current season only

---

## 14. Sources & References

- Wikipedia: Baseball positions, pitch count, infield shift, field dimensions
- Baseball scorekeeping conventions
- MLB usage patterns for pitchers
- PFL model for real-time sim
- User input on BaseHit-style mechanics
- mcneo/ball: Open source plate discipline engine
- ZenGM: Full sports management framework

---

*Research compiled: 2026-03-12*
*Updated with open source engine research*
