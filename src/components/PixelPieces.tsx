import React from 'react';
import { PieceType, PieceColor } from '../types';

interface PixelPieceProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
}

export const PixelPiece: React.FC<PixelPieceProps> = ({ type, color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';

  // 16-color VGA palette colors
  // White pieces: Primary #FFFFFF, Shadow #AAAAAA, Outline #000000
  // Black pieces: Primary #333333, Highlight #777777, Outline #000000
  const fill = isWhite ? '#F8F9FA' : '#1A1A24';
  const shade = isWhite ? '#B0B4BC' : '#3F4452';
  const outline = '#000000';
  const eye = isWhite ? '#111111' : '#E2E8F0';

  switch (type) {
    case 'p': // Pawn
      return (
        <svg viewBox="0 0 32 32" className={className} shapeRendering="crispEdges">
          {/* Base */}
          <rect x="8" y="27" width="16" height="3" fill={outline} />
          <rect x="9" y="25" width="14" height="2" fill={shade} />
          <rect x="10" y="25" width="10" height="2" fill={fill} />
          {/* Stem */}
          <rect x="12" y="16" width="8" height="9" fill={outline} />
          <rect x="13" y="16" width="6" height="9" fill={fill} />
          <rect x="16" y="17" width="3" height="8" fill={shade} />
          {/* Collar */}
          <rect x="10" y="14" width="12" height="2" fill={outline} />
          <rect x="11" y="14" width="10" height="2" fill={fill} />
          {/* Head */}
          <rect x="11" y="7" width="10" height="7" fill={outline} />
          <rect x="12" y="8" width="8" height="5" fill={fill} />
          <rect x="15" y="8" width="5" height="5" fill={shade} />
          <rect x="13" y="6" width="6" height="1" fill={outline} />
          <rect x="14" y="6" width="4" height="1" fill={fill} />
        </svg>
      );

    case 'r': // Rook
      return (
        <svg viewBox="0 0 32 32" className={className} shapeRendering="crispEdges">
          {/* Base */}
          <rect x="6" y="27" width="20" height="3" fill={outline} />
          <rect x="7" y="25" width="18" height="2" fill={shade} />
          <rect x="8" y="25" width="14" height="2" fill={fill} />
          {/* Body */}
          <rect x="9" y="14" width="14" height="11" fill={outline} />
          <rect x="10" y="14" width="12" height="11" fill={fill} />
          <rect x="17" y="15" width="5" height="10" fill={shade} />
          {/* Battlements */}
          <rect x="7" y="6" width="18" height="8" fill={outline} />
          <rect x="8" y="7" width="16" height="6" fill={fill} />
          <rect x="17" y="7" width="7" height="6" fill={shade} />
          {/* Cuts in battlements */}
          <rect x="11" y="6" width="3" height="4" fill="transparent" />
          <rect x="18" y="6" width="3" height="4" fill="transparent" />
          {/* Top trim */}
          <rect x="8" y="6" width="3" height="2" fill={fill} />
          <rect x="14" y="6" width="4" height="2" fill={fill} />
          <rect x="21" y="6" width="3" height="2" fill={shade} />
        </svg>
      );

    case 'n': // Knight
      return (
        <svg viewBox="0 0 32 32" className={className} shapeRendering="crispEdges">
          {/* Base */}
          <rect x="7" y="27" width="18" height="3" fill={outline} />
          <rect x="8" y="25" width="16" height="2" fill={shade} />
          <rect x="9" y="25" width="13" height="2" fill={fill} />
          {/* Horse Mane and Body */}
          <rect x="8" y="14" width="16" height="11" fill={outline} />
          <rect x="9" y="15" width="14" height="10" fill={fill} />
          <rect x="17" y="16" width="6" height="9" fill={shade} />
          {/* Snout & Ears */}
          <rect x="6" y="8" width="16" height="8" fill={outline} />
          <rect x="7" y="9" width="14" height="6" fill={fill} />
          <rect x="6" y="12" width="7" height="4" fill={outline} />
          <rect x="7" y="12" width="5" height="3" fill={fill} />
          {/* Ear */}
          <rect x="15" y="5" width="4" height="4" fill={outline} />
          <rect x="16" y="6" width="2" height="3" fill={fill} />
          {/* Eye & Nostril */}
          <rect x="10" y="11" width="2" height="2" fill={eye} />
          <rect x="7" y="14" width="1" height="1" fill={eye} />
          {/* Mane Serration */}
          <rect x="19" y="8" width="3" height="12" fill={shade} />
          <rect x="21" y="9" width="2" height="3" fill={outline} />
          <rect x="21" y="13" width="2" height="3" fill={outline} />
          <rect x="21" y="17" width="2" height="3" fill={outline} />
        </svg>
      );

    case 'b': // Bishop
      return (
        <svg viewBox="0 0 32 32" className={className} shapeRendering="crispEdges">
          {/* Base */}
          <rect x="7" y="27" width="18" height="3" fill={outline} />
          <rect x="8" y="25" width="16" height="2" fill={shade} />
          <rect x="9" y="25" width="13" height="2" fill={fill} />
          {/* Stem */}
          <rect x="11" y="17" width="10" height="8" fill={outline} />
          <rect x="12" y="17" width="8" height="8" fill={fill} />
          <rect x="16" y="17" width="4" height="8" fill={shade} />
          {/* Mitre (Head) */}
          <rect x="9" y="8" width="14" height="9" fill={outline} />
          <rect x="10" y="9" width="12" height="7" fill={fill} />
          <rect x="17" y="9" width="5" height="7" fill={shade} />
          {/* Slit */}
          <rect x="13" y="10" width="2" height="5" fill={outline} />
          {/* Top cross / ball */}
          <rect x="14" y="4" width="4" height="4" fill={outline} />
          <rect x="15" y="5" width="2" height="2" fill={fill} />
        </svg>
      );

    case 'q': // Queen
      return (
        <svg viewBox="0 0 32 32" className={className} shapeRendering="crispEdges">
          {/* Base */}
          <rect x="6" y="27" width="20" height="3" fill={outline} />
          <rect x="7" y="25" width="18" height="2" fill={shade} />
          <rect x="8" y="25" width="14" height="2" fill={fill} />
          {/* Gown / Body */}
          <rect x="9" y="16" width="14" height="9" fill={outline} />
          <rect x="10" y="16" width="12" height="9" fill={fill} />
          <rect x="16" y="17" width="6" height="8" fill={shade} />
          {/* Crown */}
          <rect x="6" y="8" width="20" height="8" fill={outline} />
          <rect x="7" y="9" width="18" height="6" fill={fill} />
          <rect x="17" y="9" width="8" height="6" fill={shade} />
          {/* Crown Jewels / Peaks */}
          <rect x="6" y="5" width="3" height="4" fill={outline} />
          <rect x="7" y="6" width="1" height="2" fill={fill} />
          <rect x="11" y="6" width="3" height="3" fill={outline} />
          <rect x="12" y="7" width="1" height="1" fill={fill} />
          <rect x="15" y="4" width="3" height="5" fill={outline} />
          <rect x="16" y="5" width="1" height="3" fill={fill} />
          <rect x="19" y="6" width="3" height="3" fill={outline} />
          <rect x="20" y="7" width="1" height="1" fill={shade} />
          <rect x="23" y="5" width="3" height="4" fill={outline} />
          <rect x="24" y="6" width="1" height="2" fill={shade} />
        </svg>
      );

    case 'k': // King
      return (
        <svg viewBox="0 0 32 32" className={className} shapeRendering="crispEdges">
          {/* Base */}
          <rect x="6" y="27" width="20" height="3" fill={outline} />
          <rect x="7" y="25" width="18" height="2" fill={shade} />
          <rect x="8" y="25" width="14" height="2" fill={fill} />
          {/* Robe / Body */}
          <rect x="9" y="15" width="14" height="10" fill={outline} />
          <rect x="10" y="15" width="12" height="10" fill={fill} />
          <rect x="16" y="16" width="6" height="9" fill={shade} />
          {/* Arched Crown */}
          <rect x="7" y="8" width="18" height="7" fill={outline} />
          <rect x="8" y="9" width="16" height="5" fill={fill} />
          <rect x="17" y="9" width="7" height="5" fill={shade} />
          {/* Royal Cross on Top */}
          <rect x="14" y="3" width="4" height="6" fill={outline} />
          <rect x="12" y="4" width="8" height="3" fill={outline} />
          <rect x="15" y="4" width="2" height="4" fill={fill} />
          <rect x="13" y="5" width="6" height="1" fill={fill} />
        </svg>
      );
  }
};
