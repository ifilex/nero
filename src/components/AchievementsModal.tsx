import React from 'react';
import { Trophy, CheckCircle2, Lock } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const percentage = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-md w-full font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Title */}
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span>LOGROS DESBLOQUEABLES (MS-DOS)</span>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#000055] p-2.5 dos-inset mb-3">
          <div className="flex justify-between items-center mb-1 font-pixel text-[9px]">
            <span className="text-yellow-300">PROGRESO TOTAL:</span>
            <span className="text-white">
              {unlockedCount} / {achievements.length} ({percentage}%)
            </span>
          </div>
          <div className="w-full bg-black h-3 border border-gray-500 overflow-hidden">
            <div
              className="bg-lime-500 h-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-2.5 border transition-all flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-[#003300] border-lime-400 text-white'
                  : 'bg-[#000044] border-gray-700 text-gray-400 opacity-75'
              }`}
            >
              <div className="text-2xl pt-0.5">{ach.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-pixel text-[10px] ${
                      ach.unlocked ? 'text-yellow-300 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {ach.title}
                  </span>
                  {ach.unlocked ? (
                    <span className="text-lime-400 font-pixel text-[8px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      DESBLOQUEADO
                    </span>
                  ) : (
                    <span className="text-gray-500 font-pixel text-[8px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      BLOQUEADO
                    </span>
                  )}
                </div>
                <p className="text-[11px] mt-1 font-tech leading-snug">
                  {ach.description}
                </p>
                {ach.unlockedAt && (
                  <div className="text-[9px] text-gray-400 mt-1 font-dos">
                    Fecha: {ach.unlockedAt}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Close */}
        <div className="mt-3 pt-2 border-t border-[#000055] flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#555555] hover:bg-[#777777] text-white border border-[#AAAAAA] font-pixel text-[10px]"
          >
            VOLVER
          </button>
        </div>
      </div>
    </div>
  );
};
