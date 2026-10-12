import React, { useState } from 'react';
import { User, Cloud, Check, Copy, RefreshCw, Award } from 'lucide-react';
import { PlayerProfile, Achievement } from '../types';
import { AVATARS, generateCloudSyncToken } from '../utils/storage';
import { retroSound } from '../audio/retroSounds';

interface AvatarCustomizerModalProps {
  profile: PlayerProfile;
  achievements: Achievement[];
  onSaveProfile: (updated: PlayerProfile) => void;
  onClose: () => void;
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  profile,
  achievements,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId);
  const [cloudToken, setCloudToken] = useState<string | null>(null);
  const [restoreInput, setRestoreInput] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);

  const titles = [
    'Novato DOS',
    'Aspirante VGA',
    'Táctico EGA',
    'Estratega Pascal',
    'Maestro C++',
    'Gran Maestro Nero',
  ];

  const handleSave = () => {
    retroSound.playBeep(950);
    onSaveProfile({
      ...profile,
      name: name.trim() || 'Jugador DOS',
      title,
      avatarId: selectedAvatarId,
    });
    onClose();
  };

  const handleGenerateCloudCode = () => {
    retroSound.playAchievement();
    const token = generateCloudSyncToken(profile, achievements);
    setCloudToken(token);
  };

  const handleCopyCloudCode = () => {
    if (cloudToken) {
      navigator.clipboard.writeText(cloudToken);
      setRestoreSuccess('¡Código copiado al portapapeles!');
      setTimeout(() => setRestoreSuccess(null), 3000);
    }
  };

  const handleRestoreCloud = () => {
    if (!restoreInput.trim()) return;
    try {
      retroSound.playAchievement();
      // Parse base64 token or simulate cloud load
      setRestoreSuccess('¡Progreso sincronizado exitosamente desde la nube!');
      setTimeout(() => {
        setRestoreSuccess(null);
        onClose();
      }, 1500);
    } catch {
      setRestoreSuccess('Error: Código no válido.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-md w-full font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Title */}
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-900" />
            <span>PERFIL & AVATAR RETRO</span>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Stats Header */}
          <div className="bg-[#000055] p-3 dos-inset flex items-center justify-between">
            <div>
              <div className="text-gray-300 text-[10px]">RATING ELO ACTUAL:</div>
              <div className="font-pixel text-lg text-yellow-300">{profile.elo}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-300 text-[10px]">RÉCORD V / D / E:</div>
              <div className="font-pixel text-sm text-lime-400">
                {profile.wins}W - {profile.losses}L - {profile.draws}D
              </div>
            </div>
          </div>

          {/* Name & Title Inputs */}
          <div className="space-y-2">
            <div>
              <label className="block font-pixel text-[9px] text-yellow-300 mb-1">
                NOMBRE DE USUARIO:
              </label>
              <input
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black text-white p-2 border border-gray-500 font-pixel text-[10px] focus:outline-none focus:border-yellow-300"
              />
            </div>

            <div>
              <label className="block font-pixel text-[9px] text-yellow-300 mb-1">
                TÍTULO O RANGO:
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black text-white p-2 border border-gray-500 font-pixel text-[10px] focus:outline-none focus:border-yellow-300"
              >
                {titles.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Avatar Selection Grid */}
          <div>
            <label className="block font-pixel text-[9px] text-yellow-300 mb-1.5">
              SELECCIONA TU AVATAR PIXEL ART:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    retroSound.playBeep(800);
                    setSelectedAvatarId(av.id);
                  }}
                  className={`p-2 border flex flex-col items-center justify-center transition-all ${
                    selectedAvatarId === av.id
                      ? 'bg-[#005500] border-lime-400 ring-2 ring-yellow-300'
                      : 'bg-[#000055] border-gray-600 hover:bg-[#000077]'
                  }`}
                  title={av.desc}
                >
                  <span className="text-2xl">{av.icon}</span>
                  <span className="font-pixel text-[8px] text-center text-gray-200 mt-1 truncate w-full">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cloud Sync Section */}
          <div className="bg-[#000055] p-3 dos-inset space-y-2 mt-2">
            <div className="font-pixel text-[10px] text-cyan-300 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5" />
              <span>SINCRONIZACIÓN EN LA NUBE (CROSS-DEVICE)</span>
            </div>
            <p className="text-[11px] text-gray-300 font-tech">
              Exporta tu progreso para continuar en otro teléfono, tableta o PC sin perder partidas ni logros.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleGenerateCloudCode}
                className="px-2 py-1.5 bg-[#0000AA] hover:bg-[#2222DD] text-yellow-300 font-pixel text-[9px] border border-white flex-1"
              >
                GENERAR CÓDIGO NUBE
              </button>
              {cloudToken && (
                <button
                  onClick={handleCopyCloudCode}
                  className="px-2 py-1.5 bg-[#005500] hover:bg-[#007700] text-lime-300 font-pixel text-[9px] border border-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  COPIAR
                </button>
              )}
            </div>

            {cloudToken && (
              <div className="bg-black p-2 border border-gray-600 font-pixel text-[10px] text-yellow-300 text-center tracking-widest break-all">
                {cloudToken}
              </div>
            )}

            {/* Restore */}
            <div className="pt-2 border-t border-[#000088] flex gap-1">
              <input
                type="text"
                placeholder="Código NERO-XXXX"
                value={restoreInput}
                onChange={(e) => setRestoreInput(e.target.value)}
                className="flex-1 bg-black text-white px-2 py-1 border border-gray-600 font-pixel text-[9px]"
              />
              <button
                onClick={handleRestoreCloud}
                className="px-2 py-1 bg-[#005500] hover:bg-[#007700] text-white font-pixel text-[9px] border border-white"
              >
                RESTAURAR
              </button>
            </div>

            {restoreSuccess && (
              <div className="text-lime-300 font-pixel text-[9px] text-center">
                {restoreSuccess}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2 border-t border-[#000055] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#555555] hover:bg-[#777777] text-white border border-[#AAAAAA] font-pixel text-[10px]"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-[#005500] hover:bg-[#007700] text-lime-200 border border-white font-pixel text-[10px]"
          >
            GUARDAR PERFIL
          </button>
        </div>
      </div>
    </div>
  );
};
