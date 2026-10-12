export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export type GameDifficulty = 1 | 2 | 3 | 4 | 'adaptive';

export type GameMode = 'ai' | 'pass_and_play' | 'bluetooth';

export type BoardTheme = 'nero_classic' | 'wood' | 'phosphor_green' | 'amber_crt' | 'deep_dark';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'gameplay' | 'ai' | 'mastery' | 'social';
}

export interface PlayerProfile {
  id: string;
  name: string;
  title: string;
  avatarId: string;
  avatarColor: string;
  elo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  streak: number;
  bestStreak: number;
  theme: BoardTheme;
  crtFilter: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
  isSystem?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  title: string;
  elo: number;
  wins: number;
  avatarId: string;
  isUser?: boolean;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  objective: string;
  fen: string;
  solutionMoves: string[]; // e.g. ["Qxf7#"]
  completed: boolean;
  rewardXp: number;
}
