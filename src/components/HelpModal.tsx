import React from 'react';
import { HelpCircle, Terminal, Award } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-lg w-full font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Title */}
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-900" />
            <span>AYUDA & MANUAL DE NERO CHESS 5.00</span>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 font-tech text-xs pr-1">
          {/* Historical background */}
          <div className="bg-[#000055] p-3 dos-inset">
            <h4 className="font-pixel text-[10px] text-yellow-300 mb-1 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>SOBRE NERO 5 CHESS (MS-DOS 1999)</span>
            </h4>
            <p className="text-gray-200 leading-relaxed font-dos text-base">
              Nero 5 es el legendario programa de ajedrez programado en Turbo Pascal por el autor finlandés <strong>Jari Huikari</strong> para el sistema operativo MS-DOS. Fue reconocido por su potente motor de cálculo posicional, guardado en el archivo histórico <code>WEPLAYED.TXT</code>, colores personalizables de tablero y controles rápidos.
            </p>
          </div>

          {/* Controls */}
          <div className="bg-[#000055] p-3 dos-inset space-y-2">
            <h4 className="font-pixel text-[10px] text-yellow-300">
              CONTROLES TÁCTILES Y DE TECLADO:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
              <li><strong>Tocar / Clic:</strong> Selecciona una pieza para ver los cuadros válidos destacados con puntos retro. Toca el destino para mover.</li>
              <li><strong>F1:</strong> Abrir este manual de ayuda.</li>
              <li><strong>F2:</strong> Iniciar una Nueva Partida.</li>
              <li><strong>F3 / Undo:</strong> Deshacer el último movimiento.</li>
              <li><strong>F5 / Girar:</strong> Invertir la perspectiva del tablero.</li>
              <li><strong>F6 / Pista:</strong> Consultar la recomendación táctica del motor.</li>
            </ul>
          </div>

          {/* Special Chess Moves */}
          <div className="bg-[#000055] p-3 dos-inset space-y-2">
            <h4 className="font-pixel text-[10px] text-yellow-300">
              MOVIMIENTOS REGLAMENTARIOS DE AJEDREZ:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
              <li><strong>Enroque:</strong> Mueve el Rey dos casillas hacia la Torre (O-O u O-O-O). Requiere que ni el rey ni la torre se hayan movido.</li>
              <li><strong>Captura al Paso (En Passant):</strong> Si un peón rival avanza 2 casillas y queda adyacente al tuyo, puedes capturarlo en diagonal en el turno inmediato.</li>
              <li><strong>Coronación (Promoción):</strong> Al llegar a la 8va fila, aparecerá el menú interactivo para elegir Dama, Torre, Alfil o Caballo.</li>
              <li><strong>Tablas / Empate:</strong> Ahogado (sin movimientos legales sin estar en jaque), triple repetición, o regla de 50 movimientos.</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-3 pt-2 border-t border-[#000055] flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#555555] hover:bg-[#777777] text-white border border-[#AAAAAA] font-pixel text-[10px]"
          >
            ENTENDIDO
          </button>
        </div>
      </div>
    </div>
  );
};
