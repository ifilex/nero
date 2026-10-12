import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { LeaderboardEntry, PlayerProfile } from '../types';
import { AVATARS } from '../utils/storage';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  profile: PlayerProfile;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  profile,
  onClose,
}) => {
  // Combine AI/Global masters with current user profile
  const fullLeaderboard: LeaderboardEntry[] = [
    ...entries,
    {
      rank: 0,
      name: profile.name,
      title: profile.title,
      elo: profile.elo,
      wins: profile.wins,
      avatarId: profile.avatarId,
      isUser: true,
    },
  ]
    .sort((a, b) => b.elo - a.elo)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const getAvatarIcon = (avatarId: string) => {
    const av = AVATARS.find((a) => a.id === avatarId);
    return av ? av.icon : '👤';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-[#0000AA] text-white p-4 dos-box max-w-md w-full font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Title */}
        <div className="bg-[#AAAAAA] text-black px-2 py-1 font-pixel text-xs flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span>TABLA DE CLASIFICACIÓN GLOBAL (MS-DOS)</span>
          </div>
          <button
            onClick={onClose}
            className="bg-red-700 text-white px-1.5 font-bold hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-200 mb-2 font-dos text-base">
          Salón de la fama de grandes maestros de Nero Chess en la red BBS.
        </p>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto dos-inset bg-[#000044] p-1 space-y-1">
          <div className="grid grid-cols-12 gap-1 px-2 py-1 bg-[#000088] font-pixel text-[9px] text-yellow-300">
            <span className="col-span-2">POS</span>
            <span className="col-span-6">JUGADOR</span>
            <span className="col-span-2 text-right">ELO</span>
            <span className="col-span-2 text-right">WINS</span>
          </div>

          {fullLeaderboard.map((player) => (
            <div
              key={player.name}
              className={`grid grid-cols-12 gap-1 items-center px-2 py-1.5 transition-colors ${
                player.isUser
                  ? 'bg-[#005500] border-2 border-lime-400 font-bold'
                  : 'bg-[#000033] hover:bg-[#000066]'
              }`}
            >
              {/* Position */}
              <div className="col-span-2 flex items-center gap-1 font-pixel text-[10px]">
                {player.rank === 1 ? (
                  <Crown className="w-3.5 h-3.5 text-yellow-400" />
                ) : player.rank === 2 ? (
                  <Medal className="w-3.5 h-3.5 text-gray-300" />
                ) : player.rank === 3 ? (
                  <Medal className="w-3.5 h-3.5 text-amber-600" />
                ) : null}
                <span>#{player.rank}</span>
              </div>

              {/* Player Info */}
              <div className="col-span-6 flex items-center gap-1.5 truncate">
                <span className="text-base">{getAvatarIcon(player.avatarId)}</span>
                <div className="truncate">
                  <div className="font-pixel text-[9px] text-white truncate">
                    {player.name} {player.isUser && '(TÚ)'}
                  </div>
                  <div className="text-[9px] text-gray-400 truncate font-tech">
                    {player.title}
                  </div>
                </div>
              </div>

              {/* ELO */}
              <div className="col-span-2 text-right font-pixel text-[10px] text-yellow-300">
                {player.elo}
              </div>

              {/* Wins */}
              <div className="col-span-2 text-right font-pixel text-[10px] text-lime-400">
                {player.wins}
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
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
