/**
 * League Settings Types
 * Per-league simulation parameters
 */

export interface LeagueSettings {
  leagueId: string;
  season: number;
  
  // Global simulation modifiers
  modifiers: {
    homeRunRate: number;       // HR per at-bat: 0.01 - 0.10 (default 0.025)
    hitRate: number;           // Total hits: 0.20 - 0.35 (default 0.265)
    strikeoutRate: number;     // K per at-bat: 0.10 - 0.30 (default 0.180)
    walkRate: number;         // BB per at-bat: 0.05 - 0.15 (default 0.085)
    stolenBaseRate: number;   // SB success: 0.50 - 0.90 (default 0.720)
    tripleRate: number;       // 3B per hit: 0.01 - 0.08 (default 0.030)
    doubleRate: number;       // 2B per hit: 0.08 - 0.20 (default 0.145)
    errorRate: number;        // Errors: 0.5 - 2.0 (default 1.0)
    hitByPitchRate: number;   // HBP: 0.005 - 0.02 (default 0.008)
  };
  
  // Rule variations
  rules: {
    dhEnabled: boolean;
    infieldShiftAllowed: boolean;
    threeBatterMinimum: boolean;
    extraInningRunner: boolean;
  };
}

// Default league settings
export const DEFAULT_LEAGUE_SETTINGS: LeagueSettings = {
  leagueId: 'default',
  season: 1,
  modifiers: {
    homeRunRate: 0.025,
    hitRate: 0.265,
    strikeoutRate: 0.180,
    walkRate: 0.085,
    stolenBaseRate: 0.720,
    tripleRate: 0.030,
    doubleRate: 0.145,
    errorRate: 1.0,
    hitByPitchRate: 0.008
  },
  rules: {
    dhEnabled: true,
    infieldShiftAllowed: true,
    threeBatterMinimum: false,
    extraInningRunner: false
  }
};
