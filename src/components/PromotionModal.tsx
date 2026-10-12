import React from 'react';
import { PieceType, PieceColor } from '../types';
import { PixelPiece } from './PixelPieces';

interface PromotionModalProps {
  color: PieceColor;
  onSelect: (piece: PieceType) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect }) => {
  const pieces: { type: PieceType; name: string }[] = [
    { type: 'q', name: 'DAMA (Q)' },
    { type: 'r', name: 'TORRE (R)' },
    { type: 'b', name: 'ALFIL (B)' },
    { type: 'n', name: 'CABALLO (N)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-sm w-full font-mono">
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs text-center mb-3">
          CORONACIÓN DE PEÓN (PROMOTE)
        </div>
        <p className="text-center text-yellow-300 font-dos text-lg mb-4">
          Seleccione la pieza de reemplazo:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {pieces.map((p) => (
            <button
              key={p.type}
              onClick={() => onSelect(p.type)}
              className="p-3 bg-[#000055] hover:bg-[#000088] border-2 border-white flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12">
                <PixelPiece type={p.type} color={color} />
              </div>
              <span className="font-pixel text-[10px] text-yellow-300">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
