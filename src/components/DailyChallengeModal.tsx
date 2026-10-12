import React, { useState } from 'react';
import { Bell, BellRing, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { DailyChallenge } from '../types';
import { retroSound } from '../audio/retroSounds';

interface DailyChallengeModalProps {
  challenge: DailyChallenge;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onPlayPuzzle: (fen: string, title: string) => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  challenge,
  notificationsEnabled,
  onToggleNotifications,
  onPlayPuzzle,
  onClose,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [notificationSent, setNotificationSent] = useState(false);

  const handleRequestPush = async () => {
    retroSound.playBeep(900);
    if (typeof Notification !== 'undefined') {
      try {
        const res = await Notification.requestPermission();
        setPermissionStatus(res);
        if (res === 'granted') {
          onToggleNotifications();
          new Notification('Nero Chess MS-DOS', {
            body: `¡Nuevo objetivo táctico disponible hoy: ${challenge.title}!`,
            icon: '/favicon.ico',
          });
          setNotificationSent(true);
        }
      } catch {
        onToggleNotifications();
      }
    } else {
      onToggleNotifications();
      setNotificationSent(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-md w-full font-mono text-xs">
        {/* Title */}
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-700" />
            <span>OBJETIVO TÁCTICO & NOTIFICACIONES DIARIAS</span>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        {/* Daily Mission Card */}
        <div className="bg-[#000055] p-3 dos-inset mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-pixel text-[10px] text-pink-300">
              RETO DE HOY: {challenge.date}
            </span>
            <span className="bg-[#550055] text-yellow-300 font-pixel text-[8px] px-1.5 py-0.5 border border-pink-500">
              +{challenge.rewardXp} XP ELO
            </span>
          </div>
          <h3 className="font-pixel text-sm text-yellow-300">{challenge.title}</h3>
          <p className="text-gray-200 font-tech text-xs leading-relaxed">
            {challenge.objective}
          </p>

          <button
            onClick={() => {
              retroSound.playAchievement();
              onPlayPuzzle(challenge.fen, challenge.title);
              onClose();
            }}
            className="w-full py-2 mt-2 bg-[#005500] hover:bg-[#007700] text-lime-200 border-2 border-white font-pixel text-[10px] flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-transform"
          >
            <Play className="w-3.5 h-3.5 fill-lime-200" />
            CARGAR POSICIÓN DEL RETO AL TABLERO
          </button>
        </div>

        {/* Push Notification Setup */}
        <div className="bg-[#000044] p-3 dos-inset space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-400" />
            <span className="font-pixel text-[10px] text-yellow-300">
              NOTIFICACIONES PUSH DIARIAS (RECORDATORIOS)
            </span>
          </div>
          <p className="text-gray-300 font-dos text-base leading-snug">
            Recibe un aviso diario en tu dispositivo a las 09:00 AM con un nuevo enigma táctico de ajedrez retro para mantenerte en forma.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[#000088]">
            <span className="text-[11px] text-gray-300">
              Estado:{' '}
              <strong className={notificationsEnabled ? 'text-lime-400' : 'text-yellow-400'}>
                {notificationsEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
              </strong>
            </span>
            <button
              onClick={handleRequestPush}
              className={`px-3 py-1 font-pixel text-[9px] border flex items-center gap-1.5 ${
                notificationsEnabled
                  ? 'bg-red-900 border-red-400 text-red-200'
                  : 'bg-[#0055AA] border-white text-cyan-200 hover:bg-[#0077EE]'
              }`}
            >
              {notificationsEnabled ? (
                <>
                  <BellRing className="w-3 h-3" />
                  DESACTIVAR
                </>
              ) : (
                <>
                  <Bell className="w-3 h-3" />
                  ACTIVAR PUSH
                </>
              )}
            </button>
          </div>

          {notificationSent && (
            <div className="text-lime-300 font-pixel text-[9px] text-center mt-1">
              ¡Notificación de prueba enviada con éxito!
            </div>
          )}
        </div>

        {/* Close */}
        <div className="mt-3 flex justify-end">
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
