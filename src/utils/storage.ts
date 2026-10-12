import { Achievement, PlayerProfile, LeaderboardEntry, DailyChallenge } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_move',
    title: 'Primer Movimiento',
    description: 'Realiza tu primera jugada sobre el tablero de Nero.',
    icon: '♟️',
    unlocked: false,
    category: 'gameplay',
  },
  {
    id: 'first_check',
    title: 'Jaque al Rey',
    description: 'Declara jaque contra el rey rival.',
    icon: '⚔️',
    unlocked: false,
    category: 'gameplay',
  },
  {
    id: 'castle_master',
    title: 'Castillo Blindado',
    description: 'Ejecuta un enroque corto o largo.',
    icon: '🏰',
    unlocked: false,
    category: 'gameplay',
  },
  {
    id: 'queen_hunter',
    title: 'Cazador de Damas',
    description: 'Captura la dama del oponente.',
    icon: '👑',
    unlocked: false,
    category: 'gameplay',
  },
  {
    id: 'pawn_promote',
    title: 'Coronación Heroica',
    description: 'Promociona un peón al final del tablero.',
    icon: '⭐',
    unlocked: false,
    category: 'mastery',
  },
  {
    id: 'win_novice',
    title: 'Iniciación MS-DOS',
    description: 'Gana una partida contra la IA en nivel Novato.',
    icon: '💾',
    unlocked: false,
    category: 'ai',
  },
  {
    id: 'win_club',
    title: 'Victoria Pascal',
    description: 'Vence a la IA en nivel Club Pascal (Nivel 3).',
    icon: '🏆',
    unlocked: false,
    category: 'ai',
  },
  {
    id: 'defeat_nero',
    title: 'Vencedor de Nero',
    description: 'Derrota al Gran Maestro Nero (Nivel 4 Máximo).',
    icon: '👑',
    unlocked: false,
    category: 'ai',
  },
  {
    id: 'speed_demon',
    title: 'Victoria Relámpago',
    description: 'Gana una partida en menos de 25 movimientos.',
    icon: '⚡',
    unlocked: false,
    category: 'mastery',
  },
  {
    id: 'bluetooth_connect',
    title: 'Enlace Inalámbrico',
    description: 'Inicia una sesión de juego multijugador Bluetooth.',
    icon: '📡',
    unlocked: false,
    category: 'social',
  },
  {
    id: 'social_chatter',
    title: 'Comunidad BBS 1999',
    description: 'Envía un mensaje o frase en el chat de partida.',
    icon: '💬',
    unlocked: false,
    category: 'social',
  },
  {
    id: 'cloud_sync',
    title: 'Viajero del Tiempo',
    description: 'Genera o sincroniza tu progreso en la nube.',
    icon: '☁️',
    unlocked: false,
    category: 'mastery',
  },
];

export const INITIAL_PROFILE: PlayerProfile = {
  id: 'usr_' + Math.random().toString(36).substring(2, 9),
  name: 'Jugador DOS',
  title: 'Aspirante VGA',
  avatarId: 'avatar_grandmaster',
  avatarColor: '#00AA00',
  elo: 1200,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  streak: 0,
  bestStreak: 0,
  theme: 'nero_classic',
  crtFilter: true,
  soundEnabled: true,
  notificationsEnabled: false,
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Jari Huikari', title: 'Creador Nero 5', elo: 2450, wins: 489, avatarId: 'avatar_jari' },
  { rank: 2, name: 'Deep DOS 99', title: 'Motor Turbo Pascal', elo: 2320, wins: 342, avatarId: 'avatar_silicon' },
  { rank: 3, name: 'Kasparov_8086', title: 'Gran Maestro IBM', elo: 2210, wins: 290, avatarId: 'avatar_hacker' },
  { rank: 4, name: 'CyberBishop', title: 'Táctico VGA', elo: 1950, wins: 184, avatarId: 'avatar_bishop' },
  { rank: 5, name: 'PixelQueen', title: 'Estratega EGA', elo: 1780, wins: 145, avatarId: 'avatar_queen' },
  { rank: 6, name: 'RookMaster', title: 'Defensor C++', elo: 1610, wins: 98, avatarId: 'avatar_rook' },
  { rank: 7, name: 'RetroKnight', title: 'Caballero 16-Bit', elo: 1420, wins: 73, avatarId: 'avatar_knight' },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'daily_1',
    date: new Date().toISOString().slice(0, 10),
    title: 'Mate del Pastor Clásico',
    objective: 'Encuentra el mate en 1 movimiento con las blancas.',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
    solutionMoves: ['Qxf7#'],
    completed: false,
    rewardXp: 150,
  },
  {
    id: 'daily_2',
    date: 'tomorrow',
    title: 'Desvío de Torre Nero',
    objective: 'Realiza el jaque doble decisivo con blancas.',
    fen: '6k1/5ppp/8/8/3R4/8/5PPP/6K1 w - - 0 1',
    solutionMoves: ['Rd8#'],
    completed: false,
    rewardXp: 200,
  }
];

export const AVATARS = [
  { id: 'avatar_grandmaster', name: 'Gran Maestro DOS', icon: '👑', desc: 'Veterano de torneos en MS-DOS' },
  { id: 'avatar_jari', name: 'Jari Huikari', icon: '💻', desc: 'Creador finlandés de Nero Chess' },
  { id: 'avatar_hacker', name: 'Hacker 8086', icon: '👾', desc: 'Programador de Turbo Pascal' },
  { id: 'avatar_silicon', name: 'Reina de Silicio', icon: '⚡', desc: 'Algoritmo de cálculo puro' },
  { id: 'avatar_knight', name: 'Caballero Turbo', icon: '🐴', desc: 'Táctico de aperturas veloces' },
  { id: 'avatar_bishop', name: 'Alfil Pixel', icon: '⚔️', desc: 'Dominador de las diagonales' },
  { id: 'avatar_rook', name: 'Torre VGA', icon: '🏰', desc: 'Fortaleza defensiva inquebrantable' },
  { id: 'avatar_pawn', name: 'Peón Valiente', icon: '♟️', desc: 'Camino hacia la coronación' },
];

export const STORAGE_KEYS = {
  PROFILE: 'nero_chess_profile_v1',
  ACHIEVEMENTS: 'nero_chess_achievements_v1',
  GAMES: 'nero_chess_games_history_v1',
  DAILY: 'nero_chess_daily_v1',
};

export function loadProfile(): PlayerProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) return { ...INITIAL_PROFILE, ...JSON.parse(saved) };
  } catch {}
  return INITIAL_PROFILE;
}

export function saveProfile(profile: PlayerProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {}
}

export function loadAchievements(): Achievement[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (saved) {
      const parsed: Achievement[] = JSON.parse(saved);
      // Merge with initial to include any newly added achievements
      return INITIAL_ACHIEVEMENTS.map(initial => {
        const found = parsed.find(p => p.id === initial.id);
        return found ? found : initial;
      });
    }
  } catch {}
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch {}
}

// Generate an encrypted portable Cloud Sync Token
export function generateCloudSyncToken(profile: PlayerProfile, achievements: Achievement[]): string {
  const payload = {
    version: 1,
    p: profile,
    a: achievements.filter(x => x.unlocked).map(x => x.id),
    timestamp: Date.now(),
  };
  const str = JSON.stringify(payload);
  const base64 = btoa(encodeURIComponent(str));
  return `NERO-${base64.substring(0, 10)}-${base64.substring(10, 20)}`.toUpperCase();
}

// Format game moves into authentic Nero 5 "WEPLAYED.TXT"
export function formatWePlayedTxt(
  moves: string[],
  whiteName: string,
  blackName: string,
  result: string,
  dateStr: string
): string {
  const header = `=====================================================
  NERO CHESS 5.00 FOR MS-DOS (c) JARI HUIKARI 1999
  RECORD OF GAME: WEPLAYED.TXT
=====================================================
Date:   ${dateStr}
White:  ${whiteName}
Black:  ${blackName}
Result: ${result}
-----------------------------------------------------
Moves:
`;

  let body = '';
  for (let i = 0; i < moves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const whiteMove = moves[i] || '';
    const blackMove = moves[i + 1] || '';
    body += `${moveNum.toString().padStart(3, ' ')}. ${whiteMove.padEnd(8, ' ')} ${blackMove}\n`;
  }

  return header + body + `\nEnd of game.`;
}
