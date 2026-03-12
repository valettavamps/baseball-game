# SimForge Baseball Backend Architecture

## Overview
Express.js backend on Render.com with PostgreSQL database.

---

## Security Requirements 🔐

### 1. Authentication
- **JWT tokens** (access + refresh)
- **bcrypt** for password hashing (12 rounds)
- **Rate limiting** on auth endpoints (prevent brute force)
- **2FA** support (TOTP)

### 2. API Security
- **HTTPS only** (Render provides)
- **CORS** whitelist only allowed origins
- **Helmet.js** security headers
- **Input validation** (Joi or Zod)
- **SQL injection prevention** (parameterized queries)
- **Rate limiting** global (express-rate-limit)

### 3. Data Protection
- Environment variables for all secrets
- No sensitive data in logs
- Sanitize error messages (don't leak stack traces)

---

## Database Schema (PostgreSQL)

### Users
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  username VARCHAR(50) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Players
```sql
players (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  position VARCHAR(10),
  overall_grade CHAR(2),
  attributes JSONB,
  status VARCHAR(20),
  created_at TIMESTAMP
)
```

### Teams
```sql
teams (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  tier INTEGER (1-5),
  owner_id UUID REFERENCES users(id),
  stake_amount DECIMAL
)
```

### ContractOffers
```sql
contract_offers (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  team_id UUID REFERENCES teams(id),
  salary INTEGER,
  duration INTEGER,
  status VARCHAR(20),
  expires_at TIMESTAMP
)
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Invalidate tokens
- `POST /api/auth/2fa/setup` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA

### Players
- `GET /api/players` - List player's players
- `POST /api/players` - Create player
- `GET /api/players/:id` - Get player details
- `PUT /api/players/:id` - Update player

### Offers
- `GET /api/offers` - Get contract offers
- `POST /api/offers/:id/accept` - Accept offer
- `POST /api/offers/:id/reject` - Reject offer

### Teams
- `GET /api/teams` - List teams
- `GET /api/teams/:id` - Team details

### Game
- `GET /api/games` - Live games
- `GET /api/standings` - League standings

---

## Deployment (Render.com)

1. **Create Render account** (free)
2. **New Web Service** → Connect GitHub repo
3. **Settings:**
   - Build command: `npm install && npm run build`
   - Start command: `node dist/server.js`
   - Environment: Node
4. **Add environment variables:**
   - `DATABASE_URL` (PostgreSQL)
   - `JWT_SECRET` (generate strong random)
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
5. **Add PostgreSQL** (free tier)

---

## Estimated Cost
- **Render Free Tier:** $0
  - Web service: free (sleeps after 15min)
  - PostgreSQL: free (90 day limit but renews)
- **Later:** ~$20/mo for always-on

---

## Next Steps
1. Review this plan
2. Decide what's needed now vs later
3. I build the secure backend

Questions?
