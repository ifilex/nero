import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import {
  GameDifficulty,
  GameMode,
  BoardTheme,
  PieceColor,
  PieceType,
  Achievement,
  PlayerProfile,
  ChatMessage,
  DailyChallenge,
} from './types';
import { aiEngine, EngineEvaluation } from './engine/aiEngine';
import { retroSound } from './audio/retroSounds';
import {
  loadProfile,
  saveProfile,
  loadAchievements,
  saveAchievements,
  INITIAL_LEADERBOARD,
  DAILY_CHALLENGES,
} from './utils/storage';
import { DosHeader } from './components/DosHeader';
import { ChessBoard } from './components/ChessBoard';
import { EngineMonitor } from './components/EngineMonitor';
import { MoveHistory } from './components/MoveHistory';
import { RetroChat } from './components/RetroChat';
import { PromotionModal } from './components/PromotionModal';
import { HelpModal } from './components/HelpModal';
import { AchievementsModal } from './components/AchievementsModal';
import { BluetoothMultiplayerModal } from './components/BluetoothMultiplayerModal';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { SettingsModal } from './components/SettingsModal';
import { Award } from 'lucide-react';

export default function App() {
  // Game State
  const [chess] = useState(() => new Chess());
  const [, setGameVersion] = useState(0); // For forcing re-render on chess internal mutations
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<GameDifficulty>(2);
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [flipped, setFlipped] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [evaluation, setEvaluation] = useState<EngineEvaluation | null>(null);
  const [moveHistoryList, setMoveHistoryList] = useState<string[]>([]);
  const [opponentName, setOpponentName] = useState('Nero Engine 5.0');

  // Pending promotion
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Profile & Achievements
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<
    'help' | 'achievements' | 'bluetooth' | 'avatar' | 'leaderboard' | 'daily' | 'settings' | null
  >(null);

  // Mobile Sub-View Tab ('monitor' | 'history' | 'chat')
  const [mobileTab, setMobileTab] = useState<'monitor' | 'history' | 'chat'>('monitor');

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'SISTEMA DOS',
      text: 'NERO CHESS 5.0 INICIALIZADO EN MS-DOS 6.22.',
      timestamp: '00:00',
      isSystem: true,
    },
    {
      id: 'msg_1',
      sender: 'Nero Engine',
      text: '¡Saludos! Listo para calcular jugadas en Turbo Pascal. ¡Que comience la partida!',
      timestamp: '00:01',
      isAi: true,
    },
  ]);

  // Sync sound setting
  useEffect(() => {
    retroSound.enabled = profile.soundEnabled;
  }, [profile.soundEnabled]);

  // Keyboard shortcut listener for F1 - F10
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveModal('help');
      } else if (e.key === 'F2') {
        e.preventDefault();
        startNewGame();
      } else if (e.key === 'F3') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'F5') {
        e.preventDefault();
        setFlipped((prev) => !prev);
      } else if (e.key === 'F6') {
        e.preventDefault();
        handleHint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chess]);

  // Unlock achievement helper
  const unlockAchievement = useCallback(
    (id: string) => {
      setAchievements((prev) => {
        const target = prev.find((a) => a.id === id);
        if (target && !target.unlocked) {
          const updated = prev.map((a) =>
            a.id === id
              ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleDateString() }
              : a
          );
          saveAchievements(updated);
          const unlockedItem = updated.find((a) => a.id === id)!;
          setRecentAchievement(unlockedItem);
          retroSound.playAchievement();
          setTimeout(() => setRecentAchievement(null), 4000);
          return updated;
        }
        return prev;
      });
    },
    []
  );

  // Trigger AI move
  const makeAiMove = useCallback(() => {
    if (chess.isGameOver() || isAiThinking) return;

    setIsAiThinking(true);

    // Give visual delay to simulate MS-DOS processing nodes
    const thinkingDelay = difficulty === 1 ? 300 : difficulty === 2 ? 600 : 900;

    setTimeout(() => {
      try {
        const evalResult = aiEngine.findBestMove(chess, difficulty, profile.streak);
        setEvaluation(evalResult);

        if (evalResult.bestMove) {
          const m = chess.move(evalResult.bestMove);
          if (m) {
            setLastMove({ from: m.from as Square, to: m.to as Square });
            setMoveHistoryList([...chess.history()]);
            setGameVersion((v) => v + 1);

            if (m.captured) {
              retroSound.playCapture();
            } else if (m.san.includes('O-O')) {
              retroSound.playCastle();
            } else {
              retroSound.playMove();
            }

            if (chess.inCheck()) {
              retroSound.playCheck();
            }

            // Check game over
            if (chess.isGameOver()) {
              handleGameOver();
            }
          }
        }
      } catch (err) {
        console.error('AI Move calculation error:', err);
      } finally {
        setIsAiThinking(false);
      }
    }, thinkingDelay);
  }, [chess, difficulty, isAiThinking, profile.streak]);

  // Handle game over results and ELO calculations
  const handleGameOver = useCallback(() => {
    const isPlayerWhite = playerColor === 'w';
    let won = false;
    let draw = false;

    if (chess.isCheckmate()) {
      const winnerColor = chess.turn() === 'w' ? 'b' : 'w';
      won = winnerColor === playerColor;
      if (won) {
        retroSound.playVictory();
      } else {
        retroSound.playDefeat();
      }
    } else {
      draw = true;
      retroSound.playBeep(400);
    }

    // Update player profile
    setProfile((prev) => {
      const newWins = won ? prev.wins + 1 : prev.wins;
      const newLosses = !won && !draw ? prev.losses + 1 : prev.losses;
      const newDraws = draw ? prev.draws + 1 : prev.draws;
      const newStreak = won ? Math.max(1, prev.streak + 1) : draw ? 0 : Math.min(-1, prev.streak - 1);
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      const eloDiff = won ? (difficulty === 4 ? 35 : 20) : draw ? 0 : -15;
      const newElo = Math.max(600, prev.elo + eloDiff);

      const updated = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: newWins,
        losses: newLosses,
        draws: newDraws,
        streak: newStreak,
        bestStreak: newBestStreak,
        elo: newElo,
      };
      saveProfile(updated);
      return updated;
    });

    // Check game over achievements
    if (won) {
      if (difficulty === 1) unlockAchievement('win_novice');
      if (difficulty === 3) unlockAchievement('win_club');
      if (difficulty === 4) unlockAchievement('defeat_nero');
      if (chess.history().length <= 50) unlockAchievement('speed_demon'); // <= 25 full moves
    }
  }, [chess, playerColor, difficulty, unlockAchievement]);

  // Handle user piece move on the board
  const handlePlayerMove = (from: Square, to: Square) => {
    if (isAiThinking || chess.isGameOver()) return;

    // Verify it's player's turn in AI mode
    if (gameMode === 'ai' && chess.turn() !== playerColor) return;

    const piece = chess.get(from);
    if (!piece) return;

    // Check for pawn promotion
    const isPawn = piece.type === 'p';
    const isPromoting =
      isPawn &&
      ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'));

    if (isPromoting) {
      setPendingPromotion({ from, to });
      return;
    }

    // Execute standard move
    try {
      const move = chess.move({ from, to });
      if (!move) return;

      onMoveExecuted(move);
    } catch {
      // Invalid move
      retroSound.playBeep(200);
    }
  };

  // Complete promotion after piece choice
  const handlePromotionSelect = (promotionPiece: PieceType) => {
    if (!pendingPromotion) return;
    try {
      const move = chess.move({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: promotionPiece,
      });
      setPendingPromotion(null);
      if (move) {
        retroSound.playPromote();
        unlockAchievement('pawn_promote');
        onMoveExecuted(move);
      }
    } catch {
      setPendingPromotion(null);
    }
  };

  // Post move triggers
  const onMoveExecuted = (move: Move) => {
    setLastMove({ from: move.from as Square, to: move.to as Square });
    setMoveHistoryList([...chess.history()]);
    setGameVersion((v) => v + 1);

    // Audio & Achievements
    unlockAchievement('first_move');

    if (move.captured) {
      retroSound.playCapture();
      if (move.captured === 'q') {
        unlockAchievement('queen_hunter');
      }
    } else if (move.san.includes('O-O')) {
      retroSound.playCastle();
      unlockAchievement('castle_master');
    } else {
      retroSound.playMove();
    }

    if (chess.inCheck()) {
      retroSound.playCheck();
      unlockAchievement('first_check');
    }

    // Check game over
    if (chess.isGameOver()) {
      handleGameOver();
      return;
    }

    // If vs AI, schedule AI response
    if (gameMode === 'ai' && chess.turn() !== playerColor) {
      makeAiMove();
    }
  };

  // Start New Game
  const startNewGame = () => {
    retroSound.playBeep(900);
    chess.reset();
    setLastMove(null);
    setEvaluation(null);
    setMoveHistoryList([]);
    setPendingPromotion(null);
    setIsAiThinking(false);
    setGameVersion((v) => v + 1);

    // If player is black, AI moves first
    if (gameMode === 'ai' && playerColor === 'b') {
      makeAiMove();
    }
  };

  // Undo Move
  const handleUndo = () => {
    if (isAiThinking) return;
    retroSound.playBeep(500);

    // In AI mode, undo 2 plies (AI move and player move)
    if (gameMode === 'ai') {
      chess.undo();
      chess.undo();
    } else {
      chess.undo();
    }

    const hist = chess.history({ verbose: true });
    const last = hist[hist.length - 1];
    setLastMove(last ? { from: last.from as Square, to: last.to as Square } : null);
    setMoveHistoryList([...chess.history()]);
    setGameVersion((v) => v + 1);
  };

  // Hint recommendation
  const handleHint = () => {
    if (chess.isGameOver()) return;
    retroSound.playBeep(1100);
    const best = aiEngine.findBestMove(chess, 4);
    if (best.bestMove) {
      setEvaluation(best);
      const hintMsg: ChatMessage = {
        id: `hint_${Date.now()}`,
        sender: 'TUTOR NERO',
        text: `Sugerencia táctica: Mover ${best.bestMove.san} (${best.bestMove.from} a ${best.bestMove.to}).`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isAi: true,
      };
      setChatMessages((prev) => [...prev, hintMsg]);
    }
  };

  // Chat send
  const handleSendMessage = (text: string) => {
    unlockAchievement('social_chatter');
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: profile.name,
      text,
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // AI dynamic responses in AI mode
    if (gameMode === 'ai') {
      setTimeout(() => {
        const responses = [
          'Calculando variantes... ¡Esa estructura de peones es interesante!',
          'Interesante movimiento. Analizando 18,400 nodos en Turbo Pascal...',
          '¡Buena jugada! Pero mantén la vista en tu flanco de dama.',
          'Nero 5 está pensando a profundidad 4...',
          '¿Aceptas el desafío de los alfiles opuestos?',
          '¡Continuemos la batalla sobre el tablero de 16 bits!',
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: opponentName,
          text: reply,
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          isAi: true,
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      }, 1000);
    }
  };

  // Start Bluetooth Game
  const handleStartBluetoothGame = (name: string, deviceId: string) => {
    unlockAchievement('bluetooth_connect');
    setGameMode('bluetooth');
    setOpponentName(name);
    startNewGame();
    setChatMessages((prev) => [
      ...prev,
      {
        id: `bt_${Date.now()}`,
        sender: 'BLUETOOTH',
        text: `Enlace inalámbrico establecido con ${name} (ID: ${deviceId.slice(0, 8)}).`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isSystem: true,
      },
    ]);
  };

  // Start Pass & Play
  const handleStartPassAndPlay = () => {
    setGameMode('pass_and_play');
    setOpponentName('Jugador 2 Local');
    startNewGame();
    setChatMessages((prev) => [
      ...prev,
      {
        id: `pp_${Date.now()}`,
        sender: 'SISTEMA',
        text: 'Modo 2 Jugadores Local activado. Turnos compartidos en la misma pantalla.',
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isSystem: true,
      },
    ]);
  };

  // Play Daily Tactical Puzzle
  const handlePlayPuzzle = (fen: string, title: string) => {
    chess.load(fen);
    setLastMove(null);
    setEvaluation(null);
    setMoveHistoryList([]);
    setGameVersion((v) => v + 1);
    setChatMessages((prev) => [
      ...prev,
      {
        id: `puzzle_${Date.now()}`,
        sender: 'RETO DIARIO',
        text: `Posición cargada: "${title}". Juegan las ${chess.turn() === 'w' ? 'Blancas' : 'Negras'}.`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isSystem: true,
      },
    ]);
  };

  // Dynamic Theme Styling for Body
  const themeBgClasses = {
    nero_classic: 'bg-[#000080]',
    wood: 'bg-[#2A1810]',
    phosphor_green: 'bg-[#021202]',
    amber_crt: 'bg-[#180E02]',
    deep_dark: 'bg-[#0A0C14]',
  }[profile.theme];

  return (
    <div
      className={`min-h-screen ${themeBgClasses} text-gray-100 flex flex-col items-center justify-between ${
        profile.crtFilter ? 'crt-effect' : ''
      }`}
    >
      {/* Top MS-DOS Header Bar */}
      <DosHeader
        onNewGame={startNewGame}
        onUndo={handleUndo}
        onFlip={() => setFlipped((prev) => !prev)}
        onHint={handleHint}
        onOpenHelp={() => setActiveModal('help')}
        onOpenAchievements={() => setActiveModal('achievements')}
        onOpenBluetooth={() => setActiveModal('bluetooth')}
        onOpenLeaderboard={() => setActiveModal('leaderboard')}
        onOpenAvatar={() => setActiveModal('avatar')}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenDaily={() => setActiveModal('daily')}
        soundEnabled={profile.soundEnabled}
        onToggleSound={() => {
          const next = !profile.soundEnabled;
          setProfile((p) => {
            const u = { ...p, soundEnabled: next };
            saveProfile(u);
            return u;
          });
        }}
        crtFilter={profile.crtFilter}
        onToggleCrt={() => {
          const next = !profile.crtFilter;
          setProfile((p) => {
            const u = { ...p, crtFilter: next };
            saveProfile(u);
            return u;
          });
        }}
        difficulty={difficulty}
        theme={profile.theme}
      />

      {/* Achievement Toast Banner */}
      {recentAchievement && (
        <div className="fixed top-14 z-50 animate-bounce bg-[#005500] text-white px-4 py-2 dos-box flex items-center gap-2 font-pixel text-xs border-2 border-yellow-300 shadow-2xl">
          <Award className="w-5 h-5 text-yellow-300 animate-pulse" />
          <div>
            <div className="text-yellow-300 text-[10px]">¡LOGRO DESBLOQUEADO!</div>
            <div className="font-bold">{recentAchievement.title}</div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="w-full max-w-7xl px-2 sm:px-4 py-2 sm:py-4 flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-3 lg:gap-6">
        {/* Left Column: The Retro Chessboard & Quick Mobile Controls */}
        <div className="flex flex-col items-center">
          {/* Top Opponent Info Bar */}
          <div className="w-full bg-[#0000AA] text-white px-3 py-1.5 dos-inset mb-1 flex items-center justify-between font-pixel text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span>{opponentName.toUpperCase()}</span>
            </div>
            <div className="text-yellow-300">
              {gameMode === 'ai' ? `IA DIFICULTAD: ${difficulty}` : 'JUGADOR 2'}
            </div>
          </div>

          {/* Authentic Pixel Chess Board */}
          <ChessBoard
            chess={chess}
            theme={profile.theme}
            flipped={flipped}
            onMove={handlePlayerMove}
            lastMove={lastMove}
            interactive={!isAiThinking && !chess.isGameOver()}
            playerColor={playerColor}
          />

          {/* Bottom Player Info Bar */}
          <div className="w-full bg-[#0000AA] text-white px-3 py-1.5 dos-inset mt-1 flex items-center justify-between font-pixel text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <span>{profile.name.toUpperCase()} (TÚ)</span>
              <span className="text-gray-300 text-[9px]">[{profile.title}]</span>
            </div>
            <div className="text-lime-300">ELO: {profile.elo}</div>
          </div>

          {/* Mobile Quick Action Buttons (Touch Friendly) */}
          <div className="lg:hidden flex flex-wrap gap-1.5 mt-2 w-full font-pixel text-[9px]">
            <button
              onClick={() => setMobileTab('monitor')}
              className={`flex-1 py-2 border ${
                mobileTab === 'monitor'
                  ? 'bg-[#005500] text-lime-300 border-lime-400'
                  : 'bg-[#000055] text-gray-300 border-gray-600'
              }`}
            >
              MOTOR
            </button>
            <button
              onClick={() => setMobileTab('history')}
              className={`flex-1 py-2 border ${
                mobileTab === 'history'
                  ? 'bg-[#005500] text-lime-300 border-lime-400'
                  : 'bg-[#000055] text-gray-300 border-gray-600'
              }`}
            >
              JUGADAS
            </button>
            <button
              onClick={() => setMobileTab('chat')}
              className={`flex-1 py-2 border ${
                mobileTab === 'chat'
                  ? 'bg-[#005500] text-lime-300 border-lime-400'
                  : 'bg-[#000055] text-gray-300 border-gray-600'
              }`}
            >
              CHAT
            </button>
          </div>
        </div>

        {/* Right Column: Workstation Panels (Desktop shows side-by-side, Mobile toggles tabs) */}
        <div className="w-full lg:w-[420px] flex flex-col gap-3">
          {/* Desktop Dual/Triple Panel layout */}
          <div className="hidden lg:flex flex-col gap-3">
            <EngineMonitor
              chess={chess}
              evaluation={evaluation}
              isAiThinking={isAiThinking}
              difficulty={difficulty}
              gameMode={gameMode}
              playerColor={playerColor}
              turnCount={moveHistoryList.length}
            />

            <MoveHistory
              history={moveHistoryList}
              whiteName={flipped ? opponentName : profile.name}
              blackName={flipped ? profile.name : opponentName}
              gameResult={chess.isCheckmate() ? (chess.turn() === 'w' ? '0-1' : '1-0') : chess.isDraw() ? '1/2-1/2' : '*'}
              pgn={chess.pgn()}
            />

            <RetroChat
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              opponentName={opponentName}
            />
          </div>

          {/* Mobile Tab-Switched View */}
          <div className="lg:hidden w-full">
            {mobileTab === 'monitor' && (
              <EngineMonitor
                chess={chess}
                evaluation={evaluation}
                isAiThinking={isAiThinking}
                difficulty={difficulty}
                gameMode={gameMode}
                playerColor={playerColor}
                turnCount={moveHistoryList.length}
              />
            )}
            {mobileTab === 'history' && (
              <MoveHistory
                history={moveHistoryList}
                whiteName={flipped ? opponentName : profile.name}
                blackName={flipped ? profile.name : opponentName}
                gameResult={chess.isCheckmate() ? (chess.turn() === 'w' ? '0-1' : '1-0') : chess.isDraw() ? '1/2-1/2' : '*'}
                pgn={chess.pgn()}
              />
            )}
            {mobileTab === 'chat' && (
              <RetroChat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                opponentName={opponentName}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom MS-DOS Status line */}
      <footer className="w-full bg-[#AAAAAA] text-black px-3 py-1 font-pixel text-[9px] sm:text-[10px] flex flex-wrap justify-between items-center border-t border-black select-none">
        <div>
          C:\GAMES\NERO5&gt; NERO.EXE --VGA-16COLOR
        </div>
        <div className="flex gap-3">
          <span>MEM: 640K OK</span>
          <span>SND: SOUND BLASTER 16</span>
          <span className="hidden sm:inline">TURBO: ACTIVE</span>
        </div>
      </footer>

      {/* Modals */}
      {pendingPromotion && (
        <PromotionModal
          color={chess.turn()}
          onSelect={handlePromotionSelect}
        />
      )}

      {activeModal === 'help' && (
        <HelpModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'achievements' && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'bluetooth' && (
        <BluetoothMultiplayerModal
          onClose={() => setActiveModal(null)}
          onStartBluetoothGame={handleStartBluetoothGame}
          onStartPassAndPlay={handleStartPassAndPlay}
        />
      )}

      {activeModal === 'avatar' && (
        <AvatarCustomizerModal
          profile={profile}
          achievements={achievements}
          onSaveProfile={(updated) => {
            setProfile(updated);
            saveProfile(updated);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'leaderboard' && (
        <LeaderboardModal
          entries={INITIAL_LEADERBOARD}
          profile={profile}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'daily' && (
        <DailyChallengeModal
          challenge={DAILY_CHALLENGES[0]}
          notificationsEnabled={profile.notificationsEnabled}
          onToggleNotifications={() => {
            setProfile((prev) => {
              const u = { ...prev, notificationsEnabled: !prev.notificationsEnabled };
              saveProfile(u);
              return u;
            });
          }}
          onPlayPuzzle={handlePlayPuzzle}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          theme={profile.theme}
          onChangeTheme={(newTheme) => {
            setProfile((prev) => {
              const u = { ...prev, theme: newTheme };
              saveProfile(u);
              return u;
            });
          }}
          crtFilter={profile.crtFilter}
          onToggleCrt={() => {
            setProfile((prev) => {
              const u = { ...prev, crtFilter: !prev.crtFilter };
              saveProfile(u);
              return u;
            });
          }}
          soundEnabled={profile.soundEnabled}
          onToggleSound={() => {
            setProfile((prev) => {
              const u = { ...prev, soundEnabled: !prev.soundEnabled };
              saveProfile(u);
              return u;
            });
          }}
          difficulty={difficulty}
          onChangeDifficulty={(diff) => setDifficulty(diff)}
          flipped={flipped}
          onToggleFlipped={() => setFlipped((prev) => !prev)}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
