# Backend Setup Guide

## Quick Start

```bash
cd baseball-game
npm install
npm run dev
```

Server runs on **http://localhost:3001**

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register
Body: { username, email, password }

POST /api/auth/login
Body: { email, password }

GET /api/auth/me
Headers: x-user-id: <user-id>
```

### Players
```
POST /api/players
Headers: x-user-id: <user-id>
Body: { firstName, lastName, position, attributes, throwingHand, battingHand, height, weight, age }

GET /api/players
Headers: x-user-id: <user-id>
```

### Teams
```
GET /api/teams

GET /api/teams/tier/:tier

GET /api/teams/:id
```

### Seasons
```
POST /api/seasons/start

POST /api/seasons/:id/simulate-day
```

### Staking
```
POST /api/stakes
Headers: x-user-id: <user-id>
Body: { teamId, amount, seasonId }

GET /api/stakes
Headers: x-user-id: <user-id>
```

## Frontend Connection

The frontend is already set up with `src/services/api.ts`. 

To use the backend:
1. Start backend: `npm run dev`
2. Start frontend: `npm start` (from baseball-game folder)
3. The frontend calls localhost:3001 by default

## Data Store

Currently using in-memory storage (`src/server/dataStore.ts`).
- All data lost on server restart
- Easy to swap to PostgreSQL later

## Next Steps

1. Run `npm install` to install dependencies
2. Start backend with `npm run dev`
3. Test with Postman or curl
4. Connect frontend
5. Add real auth (bcrypt + JWT)
6. Add database (PostgreSQL)
