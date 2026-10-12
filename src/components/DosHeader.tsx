import React from 'react';
import { Volume2, VolumeX, Monitor, Trophy, Bluetooth, User, Settings, Sparkles, RefreshCw } from 'lucide-react';
import { BoardTheme, GameDifficulty } from '../types';

interface DosHeaderProps {
  onNewGame: () => void;
  onUndo: () => void;
  onFlip: () => void;
  onHint: () => void;
  onOpenHelp: () => void;
  onOpenAchievements: () => void;
  onOpenBluetooth: () => void;
  onOpenLeaderboard: () => void;
  onOpenAvatar: () => void;
  onOpenSettings: () => void;
  onOpenDaily: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtFilter: boolean;
  onToggleCrt: () => void;
  difficulty: GameDifficulty;
  theme: BoardTheme;
}

export const DosHeader: React.FC<DosHeaderProps> = ({
  onNewGame,
  onUndo,
  onFlip,
  onHint,
  onOpenHelp,
  onOpenAchievements,
  onOpenBluetooth,
  onOpenLeaderboard,
  onOpenAvatar,
  onOpenSettings,
  onOpenDaily,
  soundEnabled,
  onToggleSound,
  crtFilter,
  onToggleCrt,
  difficulty,
}) => {
  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 1: return 'NV1: NOVATO';
      case 2: return 'NV2: CASUAL';
      case 3: return 'NV3: CLUB';
      case 4: return 'NV4: MAESTRO';
      case 'adaptive': return 'ADAPTABLE';
      default: return 'DOS 5.0';
    }
  };

  return (
    <header className="w-full bg-[#0000AA] text-white border-b-2 border-[#AAAAAA] shadow-md select-none">
      {/* Top MS-DOS Title Bar */}
      <div className="bg-[#AAAAAA] text-black px-2 py-0.5 flex items-center justify-between text-xs sm:text-sm font-pixel border-b border-black">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-1.5 py-0.5 text-[10px] sm:text-xs">■</span>
          <span className="font-bold tracking-wider">NERO CHESS 5.00 - MS-DOS</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-dos text-gray-900">
          <span className="hidden md:inline">FREEWARE BY JARI HUIKARI (1999)</span>
          <span className="bg-[#0000AA] text-yellow-300 px-1 font-pixel text-[9px]">{getDifficultyLabel()}</span>
        </div>
      </div>

      {/* Turbo Pascal Function Key Bar */}
      <div className="bg-[#000080] px-2 py-1 flex items-center justify-between overflow-x-auto gap-2 border-b border-[#000055] text-xs">
        <div className="flex items-center gap-1.5 flex-nowrap font-pixel text-[9px] sm:text-[10px]">
          <button
            onClick={onOpenHelp}
            className="px-1.5 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-[#AAAAAA] active:translate-y-0.5 transition-all whitespace-nowrap"
            title="Ayuda / Reglas de Nero Chess"
          >
            <span className="text-white">F1</span> Ayuda
          </button>
          <button
            onClick={onNewGame}
            className="px-1.5 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-[#AAAAAA] active:translate-y-0.5 transition-all whitespace-nowrap"
            title="Nueva partida"
          >
            <span className="text-white">F2</span> Nueva
          </button>
          <button
            onClick={onUndo}
            className="px-1.5 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-[#AAAAAA] active:translate-y-0.5 transition-all whitespace-nowrap"
            title="Deshacer jugada"
          >
            <span className="text-white">F3</span> Undo
          </button>
          <button
            onClick={onFlip}
            className="px-1.5 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-[#AAAAAA] active:translate-y-0.5 transition-all whitespace-nowrap"
            title="Girar tablero"
          >
            <span className="text-white">F5</span> Girar
          </button>
          <button
            onClick={onHint}
            className="px-1.5 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-[#AAAAAA] active:translate-y-0.5 transition-all whitespace-nowrap"
            title="Pista / Sugerencia del motor"
          >
            <span className="text-white">F6</span> Pista
          </button>
          <button
            onClick={onOpenBluetooth}
            className="px-1.5 py-1 bg-[#0055AA] hover:bg-[#0077EE] text-cyan-200 border border-[#AAAAAA] active:translate-y-0.5 transition-all whitespace-nowrap flex items-center gap-1"
            title="Multijugador Bluetooth / Local"
          >
            <Bluetooth className="w-3 h-3" />
            <span>BT Multi</span>
          </button>
        </div>

        {/* Quick Tools and Modals Buttons */}
        <div className="flex items-center gap-1 flex-nowrap font-pixel text-[9px]">
          <button
            onClick={onOpenDaily}
            className="p-1 bg-[#550055] hover:bg-[#770077] text-pink-300 border border-[#AAAAAA] flex items-center gap-1"
            title="Reto Táctico Diario"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">Reto</span>
          </button>
          <button
            onClick={onOpenAchievements}
            className="p-1 bg-[#555500] hover:bg-[#777700] text-yellow-200 border border-[#AAAAAA] flex items-center gap-1"
            title="Logros desbloqueables"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logros</span>
          </button>
          <button
            onClick={onOpenLeaderboard}
            className="p-1 bg-[#005500] hover:bg-[#007700] text-emerald-300 border border-[#AAAAAA] flex items-center gap-1"
            title="Tabla de Clasificación ELO"
          >
            <span className="font-bold">ELO</span>
          </button>
          <button
            onClick={onOpenAvatar}
            className="p-1 bg-[#000088] hover:bg-[#2222AA] text-white border border-[#AAAAAA] flex items-center gap-1"
            title="Perfil & Avatar"
          >
            <User className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleSound}
            className={`p-1 border border-[#AAAAAA] ${soundEnabled ? 'bg-[#0000AA] text-green-300' : 'bg-red-950 text-red-400'}`}
            title="Sonido sintetizado PC-Speaker"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleCrt}
            className={`p-1 border border-[#AAAAAA] ${crtFilter ? 'bg-[#005500] text-lime-300' : 'bg-gray-800 text-gray-400'}`}
            title="Filtro CRT Scanlines"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1 bg-[#0000AA] hover:bg-[#2222DD] text-white border border-[#AAAAAA]"
            title="Ajustes y Modo Oscuro"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
