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
