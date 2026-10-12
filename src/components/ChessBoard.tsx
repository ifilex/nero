import React, { useState } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { BoardTheme, PieceColor } from '../types';
import { PixelPiece } from './PixelPieces';

interface ChessBoardProps {
  chess: Chess;
  theme: BoardTheme;
  flipped: boolean;
  onMove: (from: Square, to: Square) => void;
  lastMove: { from: Square; to: Square } | null;
  interactive: boolean;
  playerColor: PieceColor;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  theme,
  flipped,
  onMove,
  lastMove,
  interactive,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);

  // Calculate ranks and files based on orientation
  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const files = flipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  // Theme palettes for squares
  const themeColors = {
    nero_classic: {
      light: '#DCC5A3',
      dark: '#8B4513',
      border: '#AAAAAA',
      highlight: '#FFFF55',
      check: '#FF3333',
    },
    wood: {
      light: '#F0D9B5',
      dark: '#B58863',
      border: '#5C381E',
      highlight: '#B8C654',
      check: '#E63946',
    },
    phosphor_green: {
      light: '#286b28',
      dark: '#0e3a0e',
      border: '#39ff14',
      highlight: '#76ff03',
      check: '#ff0033',
    },
    amber_crt: {
      light: '#784d0a',
      dark: '#3b2403',
      border: '#ffb000',
      highlight: '#ffe066',
      check: '#ff2200',
    },
    deep_dark: {
      light: '#42485e',
      dark: '#1e2230',
      border: '#00f0ff',
      highlight: '#00e5ff',
      check: '#ff0055',
    },
  }[theme];

  // In-check square detection
  let checkSquare: Square | null = null;
  if (chess.inCheck()) {
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          const file = String.fromCharCode(97 + c);
          const rank = 8 - r;
          checkSquare = `${file}${rank}` as Square;
        }
      }
    }
  }

  const handleSquareClick = (square: Square) => {
    if (!interactive) return;

    // If square is already selected, unselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Check if clicking on a valid target square
    const validMove = validMoves.find((m) => m.to === square);
    if (selectedSquare && validMove) {
      onMove(selectedSquare, square);
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Check piece on square
    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setValidMoves(moves);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  return (
    <div className="relative inline-block select-none p-2 sm:p-3 dos-box bg-[#000055]">
      {/* Board Outer Frame */}
      <div
        className="relative grid grid-cols-8 grid-rows-8 w-[min(88vw,440px)] h-[min(88vw,440px)] sm:w-[480px] sm:h-[480px] border-4"
        style={{ borderColor: themeColors.border }}
      >
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const square = `${file}${rank}` as Square;
            const isLight = (rIdx + fIdx) % 2 === 0;
            const piece = chess.get(square);
            const isSelected = selectedSquare === square;
            const isValidTarget = validMoves.some((m) => m.to === square);
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const isKingInCheck = checkSquare === square;

            const bgColor = isKingInCheck
              ? themeColors.check
              : isSelected
              ? themeColors.highlight
              : isLight
              ? themeColors.light
              : themeColors.dark;

            return (
              <div
                key={square}
                id={`sq-${square}`}
                onClick={() => handleSquareClick(square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-75 ${
                  isSelected ? 'ring-2 ring-yellow-400 z-10' : ''
                } ${isLastMoveFrom || isLastMoveTo ? 'after:absolute after:inset-0 after:border-2 after:border-yellow-300 after:pointer-events-none' : ''}`}
                style={{ backgroundColor: bgColor }}
              >
                {/* Coordinates (File on bottom rank, Rank on leftmost file) */}
                {rIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[9px] sm:text-[11px] font-bold font-pixel pointer-events-none opacity-80 ${
                      isLight ? 'text-black' : 'text-white'
                    }`}
                  >
                    {file.toUpperCase()}
                  </span>
                )}
                {fIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[9px] sm:text-[11px] font-bold font-pixel pointer-events-none opacity-80 ${
                      isLight ? 'text-black' : 'text-white'
                    }`}
                  >
                    {rank}
                  </span>
                )}

                {/* Valid move target marker */}
                {isValidTarget && (
                  <div
                    className={`absolute z-20 pointer-events-none ${
                      piece
                        ? 'inset-0.5 sm:inset-1 border-2 sm:border-3 border-emerald-400 rounded-sm'
                        : 'w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full opacity-90 ring-2 ring-black'
                    }`}
                  />
                )}

                {/* Pixel Art Chess Piece */}
                {piece && (
                  <div className="w-[82%] h-[82%] z-10 filter drop-shadow-md flex items-center justify-center pointer-events-none">
                    <PixelPiece type={piece.type} color={piece.color} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
