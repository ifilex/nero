import React from 'react';
import { Chess, Square } from 'chess.js';
import { EngineEvaluation } from '../engine/aiEngine';
import { GameDifficulty, GameMode, PieceColor } from '../types';
import { PixelPiece } from './PixelPieces';

interface EngineMonitorProps {
  chess: Chess;
  evaluation: EngineEvaluation | null;
  isAiThinking: boolean;
  difficulty: GameDifficulty;
  gameMode: GameMode;
  playerColor: PieceColor;
  turnCount: number;
}

export const EngineMonitor: React.FC<EngineMonitorProps> = ({
  chess,
  evaluation,
  isAiThinking,
  difficulty,
  gameMode,
  turnCount,
}) => {
  // Calculate captured pieces
  const board = chess.board();
  const currentPieces: Record<string, number> = {
    wp: 0, wn: 0, wb: 0, wr: 0, wq: 0,
    bp: 0, bn: 0, bb: 0, br: 0, bq: 0,
  };

  board.forEach((row) => {
    row.forEach((piece) => {
      if (piece && piece.type !== 'k') {
        currentPieces[`${piece.color}${piece.type}`]++;
      }
    });
  });

  const startingPieces: Record<string, number> = {
    wp: 8, wn: 2, wb: 2, wr: 2, wq: 1,
    bp: 8, bn: 2, bb: 2, br: 2, bq: 1,
  };

  const capturedWhite: { type: any; count: number }[] = [];
  const capturedBlack: { type: any; count: number }[] = [];

  ['p', 'n', 'b', 'r', 'q'].forEach((t) => {
    const lostWhite = startingPieces[`w${t}`] - (currentPieces[`w${t}`] || 0);
    if (lostWhite > 0) capturedWhite.push({ type: t, count: lostWhite });

    const lostBlack = startingPieces[`b${t}`] - (currentPieces[`b${t}`] || 0);
    if (lostBlack > 0) capturedBlack.push({ type: t, count: lostBlack });
  });

  const isWhiteTurn = chess.turn() === 'w';

  // Format eval display
  const rawScore = evaluation?.score ?? 0;
  const evalFormatted =
    Math.abs(rawScore) > 10000
      ? rawScore > 0 ? '+MATE' : '-MATE'
      : (rawScore / 100).toFixed(2);

  // Status banner
  let gameStatusText = '';
  if (chess.isCheckmate()) {
    gameStatusText = `¡JAQUE MATE! GANAN ${isWhiteTurn ? 'NEGRAS' : 'BLANCAS'}`;
  } else if (chess.isDraw()) {
    gameStatusText = 'TABLAS (EMPATE)';
  } else if (chess.inCheck()) {
    gameStatusText = `¡JAQUE AL REY ${isWhiteTurn ? 'BLANCO' : 'NEGRO'}!`;
  }

  return (
    <div className="bg-[#000088] text-white p-3 dos-box w-full select-none text-xs font-mono space-y-2.5">
      {/* Title */}
      <div className="bg-[#AAAAAA] text-black px-1.5 py-0.5 font-pixel text-[10px] flex justify-between items-center">
        <span>ESTADO DEL MOTOR NERO 5</span>
        <span className="text-[9px] text-gray-800">
          {gameMode === 'ai' ? `MODO: IA (${difficulty})` : gameMode === 'bluetooth' ? 'MODO: BLUETOOTH' : 'MODO: 2 JUGADORES'}
        </span>
      </div>

      {/* Alert Status Banner */}
      {gameStatusText && (
        <div className="bg-red-600 text-yellow-200 font-pixel text-[10px] sm:text-xs py-1 px-2 text-center animate-pulse border border-yellow-300">
          {gameStatusText}
        </div>
      )}

      {/* Turn indicator & Thinking Animation */}
      <div className="flex items-center justify-between bg-[#000055] p-2 dos-inset">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 border-2 border-black ${
              isWhiteTurn ? 'bg-white' : 'bg-gray-900 ring-1 ring-white'
            }`}
          />
          <span className="font-pixel text-[10px] text-yellow-300">
            TURNO: {isWhiteTurn ? 'BLANCAS' : 'NEGRAS'}
          </span>
        </div>
        <div className="font-pixel text-[9px]">
          {isAiThinking ? (
            <span className="text-cyan-300 animate-pulse">
              CALCULANDO<span className="animate-ping">_</span>
            </span>
          ) : (
            <span className="text-green-400">EN ESPERA</span>
          )}
        </div>
      </div>

      {/* Engine Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-tech">
        <div className="bg-[#000044] p-1.5 dos-inset">
          <div className="text-gray-400 text-[10px]">EVALUACIÓN:</div>
          <div className={`font-pixel text-[11px] ${rawScore > 0 ? 'text-green-300' : rawScore < 0 ? 'text-red-400' : 'text-yellow-300'}`}>
            {evalFormatted}
          </div>
        </div>
        <div className="bg-[#000044] p-1.5 dos-inset">
          <div className="text-gray-400 text-[10px]">PROFUNDIDAD:</div>
          <div className="font-pixel text-[11px] text-cyan-300">
            {evaluation?.depth ? `PLY ${evaluation.depth}` : 'PLY --'}
          </div>
        </div>
        <div className="bg-[#000044] p-1.5 dos-inset">
          <div className="text-gray-400 text-[10px]">NODOS VISITADOS:</div>
          <div className="text-white font-bold">
            {evaluation?.nodesEvaluated ? evaluation.nodesEvaluated.toLocaleString() : '0'}
          </div>
        </div>
        <div className="bg-[#000044] p-1.5 dos-inset">
          <div className="text-gray-400 text-[10px]">MEJOR LÍNEA (PV):</div>
          <div className="text-yellow-300 font-bold">
            {evaluation?.pv || '--'}
          </div>
        </div>
      </div>

      {/* Material Balance / Captured Pieces */}
      <div className="space-y-1 bg-[#000044] p-2 dos-inset">
        <div className="text-gray-400 text-[10px] font-pixel">PIEZAS CAPTURADAS:</div>
        
        {/* White lost pieces */}
        <div className="flex items-center gap-1 min-h-[22px]">
          <span className="text-[10px] text-gray-300 w-8">BLA:</span>
          <div className="flex items-center gap-1">
            {capturedWhite.length === 0 ? (
              <span className="text-gray-500 text-[10px]">Ninguna</span>
            ) : (
              capturedWhite.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-4 h-4">
                    <PixelPiece type={item.type} color="w" />
                  </div>
                  {item.count > 1 && (
                    <span className="text-[9px] text-yellow-300 font-pixel">×{item.count}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Black lost pieces */}
        <div className="flex items-center gap-1 min-h-[22px]">
          <span className="text-[10px] text-gray-300 w-8">NEG:</span>
          <div className="flex items-center gap-1">
            {capturedBlack.length === 0 ? (
              <span className="text-gray-500 text-[10px]">Ninguna</span>
            ) : (
              capturedBlack.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-4 h-4">
                    <PixelPiece type={item.type} color="b" />
                  </div>
                  {item.count > 1 && (
                    <span className="text-[9px] text-yellow-300 font-pixel">×{item.count}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
