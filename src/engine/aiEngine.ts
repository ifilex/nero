import { Chess, Move, Square } from 'chess.js';
import { GameDifficulty } from '../types';

// Classical Piece-Square Tables (Centipawns)
// Flipped appropriately for White vs Black
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE_MIDDLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

export interface EngineEvaluation {
  bestMove: Move | null;
  score: number; // centipawns, positive means favoring white
  depth: number;
  nodesEvaluated: number;
  timeTakenMs: number;
  pv: string; // principal variation string (e.g. "e2-e4 e7-e5")
}

export class NeroChessEngine {
  private nodesCount = 0;

  // Evaluate the board position from White's perspective
  public evaluatePosition(chess: Chess): number {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -200000 : 200000;
    }
    if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
      return 0;
    }

    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const val = PIECE_VALUES[piece.type] || 0;
        let posVal = 0;

        // Position index 0..63
        const idx = piece.color === 'w' ? r * 8 + c : (7 - r) * 8 + c;

        switch (piece.type) {
          case 'p': posVal = PAWN_TABLE[idx]; break;
          case 'n': posVal = KNIGHT_TABLE[idx]; break;
          case 'b': posVal = BISHOP_TABLE[idx]; break;
          case 'r': posVal = ROOK_TABLE[idx]; break;
          case 'q': posVal = QUEEN_TABLE[idx]; break;
          case 'k': posVal = KING_TABLE_MIDDLE[idx]; break;
        }

        const totalVal = val + posVal;
        if (piece.color === 'w') {
          score += totalVal;
        } else {
          score -= totalVal;
        }
      }
    }

    return score;
  }

  // Minimax with Alpha-Beta Pruning
  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): { score: number; bestMove: Move | null } {
    this.nodesCount++;

    if (depth === 0 || chess.isGameOver()) {
      return { score: this.evaluatePosition(chess), bestMove: null };
    }

    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) {
      return { score: this.evaluatePosition(chess), bestMove: null };
    }

    // Move ordering: captures and checks first
    moves.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.captured) scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
      if (b.captured) scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
      if (a.promotion) scoreA += 800;
      if (b.promotion) scoreB += 800;
      return scoreB - scoreA;
    });

    let bestMove: Move | null = moves[0];

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();

        if (evaluation.score > maxEval) {
          maxEval = evaluation.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation.score);
        if (beta <= alpha) {
          break; // Beta cut-off
        }
      }
      return { score: maxEval, bestMove };
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const evaluation = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();

        if (evaluation.score < minEval) {
          minEval = evaluation.score;
          bestMove = move;
        }
        beta = Math.min(beta, evaluation.score);
        if (beta <= alpha) {
          break; // Alpha cut-off
        }
      }
      return { score: minEval, bestMove };
    }
  }

  // Find best move based on difficulty
  public findBestMove(
    chess: Chess,
    difficulty: GameDifficulty,
    playerStreak: number = 0
  ): EngineEvaluation {
    const startTime = performance.now();
    this.nodesCount = 0;
    const moves = chess.moves({ verbose: true });

    if (moves.length === 0) {
      return {
        bestMove: null,
        score: this.evaluatePosition(chess),
        depth: 0,
        nodesEvaluated: 0,
        timeTakenMs: 0,
        pv: '',
      };
    }

    const isWhite = chess.turn() === 'w';
    let targetDepth = 2;
    let blunderChance = 0;

    // Determine target depth & randomness based on level
    let actualLevel: number = 2;
    if (difficulty === 'adaptive') {
      // Scale from 1 to 4 based on player streak
      if (playerStreak <= -2) actualLevel = 1;
      else if (playerStreak <= 0) actualLevel = 2;
      else if (playerStreak <= 2) actualLevel = 3;
      else actualLevel = 4;
    } else {
      actualLevel = difficulty;
    }

    switch (actualLevel) {
      case 1:
        targetDepth = 1;
        blunderChance = 0.45; // 45% chance to pick random legal move
        break;
      case 2:
        targetDepth = 2;
        blunderChance = 0.20;
        break;
      case 3:
        targetDepth = 3;
        blunderChance = 0.05;
        break;
      case 4:
      default:
        targetDepth = 4;
        blunderChance = 0.0;
        break;
    }

    // Deliberate casual blunder for beginner levels
    if (blunderChance > 0 && Math.random() < blunderChance) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      const endTime = performance.now();
      return {
        bestMove: randomMove,
        score: (isWhite ? 1 : -1) * (actualLevel * 20),
        depth: targetDepth,
        nodesEvaluated: Math.floor(Math.random() * 40) + 15,
        timeTakenMs: Math.round(endTime - startTime + 120),
        pv: `${randomMove.from}-${randomMove.to}`,
      };
    }

    const { score, bestMove } = this.minimax(
      chess,
      targetDepth,
      -Infinity,
      Infinity,
      isWhite
    );

    const endTime = performance.now();
    const chosenMove = bestMove || moves[0];
    const pv = chosenMove ? `${chosenMove.from}-${chosenMove.to}` : '';

    return {
      bestMove: chosenMove,
      score,
      depth: targetDepth,
      nodesEvaluated: this.nodesCount,
      timeTakenMs: Math.round(endTime - startTime),
      pv,
    };
  }
}

export const aiEngine = new NeroChessEngine();
