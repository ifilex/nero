import React from 'react';
import { Settings, Moon, Sun, Monitor, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { BoardTheme, GameDifficulty } from '../types';
import { retroSound } from '../audio/retroSounds';

interface SettingsModalProps {
  theme: BoardTheme;
  onChangeTheme: (theme: BoardTheme) => void;
  crtFilter: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  difficulty: GameDifficulty;
  onChangeDifficulty: (diff: GameDifficulty) => void;
  flipped: boolean;
  onToggleFlipped: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  theme,
  onChangeTheme,
  crtFilter,
  onToggleCrt,
  soundEnabled,
  onToggleSound,
  difficulty,
  onChangeDifficulty,
  flipped,
  onToggleFlipped,
  onClose,
}) => {
  const themes: { id: BoardTheme; name: string; desc: string; preview: string }[] = [
    {
      id: 'nero_classic',
      name: 'Azul DOS Nero 5',
      desc: 'El diseño clásico VGA original de Jari Huikari (1999)',
      preview: 'bg-[#0000AA] border-[#8B4513]',
    },
    {
      id: 'wood',
      name: 'Madera & Nogal',
      desc: 'Estilo clásico artesanal de torneo',
      preview: 'bg-[#4A2E18] border-[#B58863]',
    },
    {
      id: 'phosphor_green',
      name: 'Verde Fósforo CRT',
      desc: 'Modo oscuro monocromo terminal Matrix / Apple II',
      preview: 'bg-[#0b340b] border-[#39ff14]',
    },
    {
      id: 'amber_crt',
      name: 'Ámbar Hércules CRT',
      desc: 'Modo oscuro cálido monocromo de los años 80',
      preview: 'bg-[#3b2403] border-[#ffb000]',
    },
    {
      id: 'deep_dark',
      name: 'Modo Oscuro Cyber OLED',
      desc: 'Negro puro con acentos de neón para visión nocturna',
      preview: 'bg-[#10121a] border-[#00f0ff]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-md w-full font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Title */}
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-blue-900" />
            <span>AJUSTES & PERSONALIZACIÓN DE PANTALLA</span>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Themes (Modo Oscuro Personalizable) */}
          <div>
            <label className="block font-pixel text-[10px] text-yellow-300 mb-2 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5" />
              <span>TEMAS DE TABLERO & MODO OSCURO:</span>
            </label>
            <div className="space-y-1.5">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    retroSound.playBeep(850);
                    onChangeTheme(th.id);
                  }}
                  className={`w-full p-2 border flex items-center justify-between text-left transition-all ${
                    theme === th.id
                      ? 'bg-[#005500] border-lime-400 ring-2 ring-yellow-300'
                      : 'bg-[#000044] border-gray-700 hover:bg-[#000066]'
                  }`}
                >
                  <div>
                    <div className="font-pixel text-[9px] text-white">{th.name}</div>
                    <div className="text-[10px] text-gray-300 font-tech">{th.desc}</div>
                  </div>
                  <div className={`w-6 h-6 border-2 ${th.preview}`} />
                </button>
              ))}
            </div>
          </div>

          {/* CRT & Sound Toggles */}
          <div className="bg-[#000055] p-3 dos-inset space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-pixel text-[9px] text-yellow-300 flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  <span>EFECTO CRT SCANLINES (TUBO RETRO)</span>
                </div>
                <div className="text-[10px] text-gray-300 font-tech">
                  Líneas de barrido analógicas simuladas de monitor CRT
                </div>
              </div>
              <button
                onClick={onToggleCrt}
                className={`px-3 py-1 font-pixel text-[9px] border ${
                  crtFilter ? 'bg-[#005500] text-lime-300 border-lime-400' : 'bg-gray-800 text-gray-400 border-gray-600'
                }`}
              >
                {crtFilter ? 'ACTIVADO' : 'APAGADO'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#000088]">
              <div>
                <div className="font-pixel text-[9px] text-yellow-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>SINTETIZADOR DE SONIDO (PC SPEAKER)</span>
                </div>
                <div className="text-[10px] text-gray-300 font-tech">
                  Efectos de sonido de 16 bits sintetizados por Web Audio
                </div>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1 font-pixel text-[9px] border ${
                  soundEnabled ? 'bg-[#005500] text-lime-300 border-lime-400' : 'bg-gray-800 text-gray-400 border-gray-600'
                }`}
              >
                {soundEnabled ? 'ACTIVADO' : 'MUTED'}
              </button>
            </div>
          </div>

          {/* AI Level & Difficulty */}
          <div className="bg-[#000055] p-3 dos-inset space-y-2">
            <div className="font-pixel text-[9px] text-yellow-300">
              NIVEL DE IA ADAPTABLE NERO 5:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { val: 1, label: 'NV1: Novato (~800)' },
                { val: 2, label: 'NV2: Casual (~1200)' },
                { val: 3, label: 'NV3: Club (~1600)' },
                { val: 4, label: 'NV4: Maestro (~2000)' },
                { val: 'adaptive', label: 'Dinámico Adaptable' },
              ].map((item) => (
                <button
                  key={String(item.val)}
                  onClick={() => {
                    retroSound.playBeep(850);
                    onChangeDifficulty(item.val as GameDifficulty);
                  }}
                  className={`p-2 border font-pixel text-[8px] text-center ${
                    difficulty === item.val
                      ? 'bg-[#005500] border-lime-400 text-white ring-1 ring-yellow-300'
                      : 'bg-[#000033] border-gray-600 text-gray-300 hover:bg-[#000066]'
                  } ${item.val === 'adaptive' ? 'col-span-2' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation Flip */}
          <div className="bg-[#000055] p-3 dos-inset flex items-center justify-between">
            <div>
              <div className="font-pixel text-[9px] text-yellow-300">
                ORIENTACIÓN DEL TABLERO:
              </div>
              <div className="text-[10px] text-gray-300 font-tech">
                Jugar con Blancas (Abajo) o Negras (Abajo)
              </div>
            </div>
            <button
              onClick={onToggleFlipped}
              className="px-3 py-1 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 border border-white font-pixel text-[9px]"
            >
              {flipped ? 'NEGRAS ABAJO' : 'BLANCAS ABAJO'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-3 pt-2 border-t border-[#000055] flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#555555] hover:bg-[#777777] text-white border border-[#AAAAAA] font-pixel text-[10px]"
          >
            GUARDAR Y SALIR
          </button>
        </div>
      </div>
    </div>
  );
};
