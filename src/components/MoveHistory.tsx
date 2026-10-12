import React, { useState } from 'react';
import { Download, Copy, Check, Share2, FileText } from 'lucide-react';
import { formatWePlayedTxt } from '../utils/storage';

interface MoveHistoryProps {
  history: string[];
  whiteName: string;
  blackName: string;
  gameResult?: string;
  pgn: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  history,
  whiteName,
  blackName,
  gameResult = '*',
  pgn,
}) => {
  const [copied, setCopied] = useState(false);
  const [showWePlayedModal, setShowWePlayedModal] = useState(false);

  // Group moves into pairs (turn: [whiteMove, blackMove])
  const pairs: { moveNum: number; white: string; black?: string }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      moveNum: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1],
    });
  }

  const handleCopyPgn = () => {
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadWePlayed = () => {
    const content = formatWePlayedTxt(
      history,
      whiteName,
      blackName,
      gameResult,
      new Date().toLocaleDateString()
    );
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'WEPLAYED.TXT';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `¡Jugando ajedrez retro en Nero Chess MS-DOS! Partida: ${history.length} jugadas. ${whiteName} vs ${blackName}. #NeroChess #RetroGaming #MSDOS`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Echa un vistazo a mi partida en Nero Chess MS-DOS! Resultado: ${gameResult} tras ${history.length} movimientos.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="bg-[#000088] text-white p-3 dos-box w-full select-none text-xs flex flex-col h-full">
      {/* Title */}
      <div className="bg-[#AAAAAA] text-black px-1.5 py-0.5 font-pixel text-[10px] flex justify-between items-center mb-2">
        <span>HISTORIAL (WEPLAYED.TXT)</span>
        <span className="text-[9px] text-gray-800">{history.length} JUGADAS</span>
      </div>

      {/* Move List Scroll Container */}
      <div className="flex-1 bg-[#000044] p-2 dos-inset overflow-y-auto max-h-[160px] sm:max-h-[220px] font-mono text-[11px] space-y-1">
        {pairs.length === 0 ? (
          <div className="text-gray-400 italic text-center py-4 font-dos text-base">
            Esperando primera jugada...
          </div>
        ) : (
          pairs.map((pair) => (
            <div key={pair.moveNum} className="flex items-center text-gray-200 hover:bg-[#000066] px-1 py-0.5">
              <span className="w-8 text-yellow-300 font-pixel text-[9px]">{pair.moveNum}.</span>
              <span className="w-16 font-bold text-white">{pair.white}</span>
              <span className="w-16 text-cyan-200">{pair.black || ''}</span>
            </div>
          ))
        )}
      </div>

      {/* Action Bar (PGN, WEPLAYED.TXT, Share) */}
      <div className="mt-2 pt-2 border-t border-[#000055] flex flex-wrap gap-1 font-pixel text-[9px]">
        <button
          onClick={() => setShowWePlayedModal(true)}
          className="flex-1 px-2 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-[#AAAAAA] flex items-center justify-center gap-1"
          title="Ver archivo WEPLAYED.TXT original"
        >
          <FileText className="w-3 h-3" />
          <span>VER DOS TXT</span>
        </button>
        <button
          onClick={handleDownloadWePlayed}
          className="flex-1 px-2 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-white border border-[#AAAAAA] flex items-center justify-center gap-1"
          title="Descargar WEPLAYED.TXT"
        >
          <Download className="w-3 h-3" />
          <span>GUARDAR TXT</span>
        </button>
        <button
          onClick={handleCopyPgn}
          className="px-2 py-1 bg-[#005500] hover:bg-[#007700] text-lime-300 border border-[#AAAAAA] flex items-center gap-1"
          title="Copiar PGN al portapapeles"
        >
          {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? '¡COPIADO!' : 'PGN'}</span>
        </button>
      </div>

      {/* Social Share row */}
      <div className="mt-1 flex items-center justify-between text-[9px] font-pixel text-gray-300">
        <span>COMPARTIR:</span>
        <div className="flex gap-1">
          <button
            onClick={handleShareTwitter}
            className="px-1.5 py-0.5 bg-[#1DA1F2] hover:bg-sky-400 text-white font-bold"
            title="Compartir en X / Twitter"
          >
            X
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="px-1.5 py-0.5 bg-[#25D366] hover:bg-green-400 text-black font-bold"
            title="Compartir en WhatsApp"
          >
            WA
          </button>
        </div>
      </div>

      {/* WEPLAYED.TXT Preview Modal */}
      {showWePlayedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
          <div className="bg-[#0000AA] text-white max-w-lg w-full dos-box p-4 font-mono text-xs">
            <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-3">
              <span>VISOR: C:\NERO5\WEPLAYED.TXT</span>
              <button
                onClick={() => setShowWePlayedModal(false)}
                className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
              >
                ✕
              </button>
            </div>
            <pre className="bg-black text-green-400 p-3 dos-inset overflow-auto max-h-72 font-dos text-base leading-snug whitespace-pre-wrap">
              {formatWePlayedTxt(
                history,
                whiteName,
                blackName,
                gameResult,
                new Date().toLocaleDateString()
              )}
            </pre>
            <div className="mt-3 flex justify-end gap-2 font-pixel text-[10px]">
              <button
                onClick={handleDownloadWePlayed}
                className="px-3 py-1 bg-[#005500] hover:bg-[#007700] text-white border border-[#AAAAAA]"
              >
                DESCARGAR ARCHIVO
              </button>
              <button
                onClick={() => setShowWePlayedModal(false)}
                className="px-3 py-1 bg-[#555555] hover:bg-[#777777] text-white border border-[#AAAAAA]"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
