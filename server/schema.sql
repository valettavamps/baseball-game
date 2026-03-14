-- SimForge Baseball Database Schema
-- Run this on your PostgreSQL database

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    tier INTEGER NOT NULL CHECK (tier >= 1 AND tier <= 5),
    owner_id UUID REFERENCES users(id),
    stake_amount DECIMAL(15, 2) DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Players
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(10) NOT NULL,
    throw_hand CHAR(1) NOT NULL CHECK (throw_hand IN ('L', 'R')),
    bat_hand CHAR(1) NOT NULL CHECK (bat_hand IN ('L', 'R', 'S')),
    attributes JSONB NOT NULL,
    overall_grade CHAR(2),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'contracted', 'retired')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster player lookups
CREATE INDEX idx_players_user ON players(user_id);
CREATE INDEX idx_players_status ON players(status);

-- Contract Offers
CREATE TABLE IF NOT EXISTS contract_offers (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id),
    team_id UUID REFERENCES teams(id),
    salary INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    bonuses JSONB DEFAULT '[]',
    scout_report TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_offers_player ON contract_offers(player_id);
CREATE INDEX idx_offers_status ON contract_offers(status);

-- Contracts (active player-team relationships)
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id),
    team_id UUID REFERENCES teams(id),
    salary INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Games
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY,
    home_team_id UUID REFERENCES teams(id),
    away_team_id UUID REFERENCES teams(id),
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'postponed')),
    scheduled_time TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    innings JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_scheduled ON games(scheduled_time);

-- Team Game Stats (for standings)
CREATE TABLE IF NOT EXISTS team_game_stats (
    id UUID PRIMARY KEY,
    team_id UUID REFERENCES teams(id),
    game_id UUID REFERENCES games(id),
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    UNIQUE(team_id, game_id)
);

-- Seed some teams
INSERT INTO teams (id, name, city, tier) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Solana Sluggers', 'San Francisco', 1),
    ('22222222-2222-2222-2222-222222222222', 'Phantom Pitchers', 'Los Angeles', 1),
    ('33333333-3333-3333-3333-333333333333', 'Anchor Arms', 'New York', 2),
    ('44444444-4444-4444-4444-444444444444', 'Metaplex Maulers', 'Chicago', 2),
    ('55555555-5555-5555-5555-555555555555', 'Raydium Rockets', 'Houston', 3),
    ('66666666-6666-6666-6666-666666666666', 'Jupiter Giants', 'Miami', 3),
    ('77777777-7777-7777-7777-777777777777', 'Orca Outfielders', 'Seattle', 4),
    ('88888888-8888-8888-8888-888888888888', 'Sage Ballers', 'Denver', 5)
ON CONFLICT DO NOTHING;

-- Seed more teams for all tiers
INSERT INTO teams (id, name, city, tier) 
SELECT 
    gen_random_uuid(),
    'Team ' || i,
    'City ' || i,
    ((i - 1) % 5) + 1
FROM generate_series(9, 100) i
WHERE NOT EXISTS (SELECT 1 FROM teams);

-- ============ EXTENDED PLAYER DATA TABLES ============

-- Player Ratings (Current and Potential)
CREATE TABLE IF NOT EXISTS player_ratings (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    -- Current Ratings (1-100)
    discipline INTEGER,
    contact INTEGER,
    power INTEGER,
    speed INTEGER,
    run_accuracy INTEGER,
    glove INTEGER,
    arm INTEGER,
    endurance INTEGER,
    -- Potential Ratings
    potential_discipline INTEGER,
    potential_contact INTEGER,
    potential_power INTEGER,
    potential_speed INTEGER,
    potential_run_accuracy INTEGER,
    potential_glove INTEGER,
    potential_arm INTEGER,
    potential_endurance INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Player Extended Info (age, height, weight, draft info, etc.)
CREATE TABLE IF NOT EXISTS player_info (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    experience_years INTEGER,
    debut_date DATE,
    last_game_date DATE,
    salary INTEGER,
    acquired VARCHAR(100),
    draft_year INTEGER,
    draft_round INTEGER,
    draft_pick INTEGER,
    drafted_by VARCHAR(100),
    height_inches INTEGER,
    weight_lbs INTEGER,
    throwing_hand CHAR(1),
    batting_hand CHAR(1),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Season Batting Stats (Extended)
CREATE TABLE IF NOT EXISTS player_season_batting (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    team_id UUID REFERENCES teams(id),
    team_name VARCHAR(100),
    games_played INTEGER,
    pa INTEGER,
    ab INTEGER,
    runs INTEGER,
    hits INTEGER,
    doubles INTEGER,
    triples INTEGER,
    home_runs INTEGER,
    rbi INTEGER,
    walks INTEGER,
    strikeouts INTEGER,
    stolen_bases INTEGER,
    caught_stealing INTEGER,
    avg DECIMAL(4,3),
    obp DECIMAL(4,3),
    slg DECIMAL(4,3),
    ops DECIMAL(5,3),
    -- Extended Stats
    tb INTEGER,
    gbfb DECIMAL(4,2),
    sf INTEGER,
    hbp INTEGER,
    gdp INTEGER,
    roe INTEGER,
    xb INTEGER,
    bro DECIMAL(4,3),
    sa DECIMAL(4,3),
    rc DECIMAL(6,1),
    lWts DECIMAL(6,2),
    abHr DECIMAL(6,2),
    tbpa DECIMAL(4,3),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, year)
);

-- Career Batting Totals
CREATE TABLE IF NOT EXISTS player_career_batting (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    games_played INTEGER,
    pa INTEGER,
    ab INTEGER,
    runs INTEGER,
    hits INTEGER,
    doubles INTEGER,
    triples INTEGER,
    home_runs INTEGER,
    rbi INTEGER,
    walks INTEGER,
    strikeouts INTEGER,
    stolen_bases INTEGER,
    caught_stealing INTEGER,
    avg DECIMAL(4,3),
    obp DECIMAL(4,3),
    slg DECIMAL(4,3),
    ops DECIMAL(5,3),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Fielding Stats
CREATE TABLE IF NOT EXISTS player_fielding (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    position VARCHAR(10),
    games_played INTEGER,
    po INTEGER,
    a INTEGER,
    e INTEGER,
    tc INTEGER,
    dp INTEGER,
    sb INTEGER,
    cs INTEGER,
    cs_pct DECIMAL(4,3),
    pct DECIMAL(4,3),
    rng DECIMAL(5,2),
    year INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, position, year)
);

-- Season Pitching Stats (Extended)
CREATE TABLE IF NOT EXISTS player_season_pitching (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    team_id UUID REFERENCES teams(id),
    team_name VARCHAR(100),
    games_played INTEGER,
    games_started INTEGER,
    wins INTEGER,
    losses INTEGER,
    era DECIMAL(5,2),
    innings DECIMAL(6,1),
    hits INTEGER,
    runs INTEGER,
    earned_runs INTEGER,
    walks INTEGER,
    strikeouts INTEGER,
    hr INTEGER,
    -- Extended Stats
    so9 DECIMAL(4,2),
    bb9 DECIMAL(4,2),
    soBb DECIMAL(5,2),
    go INTEGER,
    fo INTEGER,
    ffo INTEGER,
    ir INTEGER,
    irs INTEGER,
    oavg DECIMAL(4,3),
    oobp DECIMAL(4,3),
    oslg DECIMAL(4,3),
    oops DECIMAL(5,3),
    lWts DECIMAL(6,2),
    babip DECIMAL(4,3),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, year)
);

-- Career Pitching Totals
CREATE TABLE IF NOT EXISTS player_career_pitching (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    games_played INTEGER,
    games_started INTEGER,
    wins INTEGER,
    losses INTEGER,
    era DECIMAL(5,2),
    innings DECIMAL(6,1),
    hits INTEGER,
    runs INTEGER,
    earned_runs INTEGER,
    walks INTEGER,
    strikeouts INTEGER,
    home_runs INTEGER,
    so9 DECIMAL(4,2),
    bb9 DECIMAL(4,2),
    soBb DECIMAL(5,2),
    go INTEGER,
    fo INTEGER,
    oavg DECIMAL(4,3),
    oobp DECIMAL(4,3),
    oslg DECIMAL(4,3),
    oops DECIMAL(5,3),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Player Awards (counts)
CREATE TABLE IF NOT EXISTS player_awards (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    mvp INTEGER DEFAULT 0,
    all_star INTEGER DEFAULT 0,
    gold_glove INTEGER DEFAULT 0,
    silver_slugger INTEGER DEFAULT 0,
    cy_young INTEGER DEFAULT 0,
    roty INTEGER DEFAULT 0,
    player_of_game INTEGER DEFAULT 0,
    world_series_rings INTEGER DEFAULT 0,
    hall_of_fame_score DECIMAL(6,2),
    hall_of_fame_inducted BOOLEAN DEFAULT FALSE,
    hall_of_fame_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Player Achievements (single game achievements)
CREATE TABLE IF NOT EXISTS player_achievements (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    date DATE,
    achievement VARCHAR(100),
    opponent VARCHAR(100),
    opponent_id UUID REFERENCES teams(id),
    result VARCHAR(50),
    game_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Player Season History (year-by-year summary)
CREATE TABLE IF NOT EXISTS player_season_history (
    id UUID PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    team_id UUID REFERENCES teams(id),
    team_name VARCHAR(100),
    position VARCHAR(10),
    games_played INTEGER,
    avg DECIMAL(4,3),
    hr INTEGER,
    rbi INTEGER,
    wins INTEGER,
    losses INTEGER,
    era DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(player_id, year)
);

-- Indexes for new tables
CREATE INDEX idx_ratings_player ON player_ratings(player_id);
CREATE INDEX idx_info_player ON player_info(player_id);
CREATE INDEX idx_season_batting_player ON player_season_batting(player_id);
CREATE INDEX idx_season_batting_year ON player_season_batting(year);
CREATE INDEX idx_career_batting_player ON player_career_batting(player_id);
CREATE INDEX idx_fielding_player ON player_fielding(player_id);
CREATE INDEX idx_season_pitching_player ON player_season_pitching(player_id);
CREATE INDEX idx_career_pitching_player ON player_career_pitching(player_id);
CREATE INDEX idx_awards_player ON player_awards(player_id);
CREATE INDEX idx_achievements_player ON player_achievements(player_id);
CREATE INDEX idx_history_player ON player_season_history(player_id);
CREATE INDEX idx_history_year ON player_season_history(year);
