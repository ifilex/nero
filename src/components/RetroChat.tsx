import React, { useState } from 'react';
import { Send, MessageSquare, Smile } from 'lucide-react';
import { ChatMessage } from '../types';
import { retroSound } from '../audio/retroSounds';

interface RetroChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  opponentName: string;
}

export const RetroChat: React.FC<RetroChatProps> = ({
  messages,
  onSendMessage,
  opponentName,
}) => {
  const [inputText, setInputText] = useState('');

  const quickPhrases = [
    '¡Buen movimiento!',
    '¡Jaque!',
    '¿Aceptas tablas?',
    'Pensando...',
    '¡GG!',
    '¡Revancha!',
  ];

  const quickEmotes = ['♟️', '👑', '⚔️', '💥', '🐴', '🏰'];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    retroSound.playBeep(700);
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPhrase = (phrase: string) => {
    retroSound.playBeep(700);
    onSendMessage(phrase);
  };

  return (
    <div className="bg-[#000088] text-white p-3 dos-box w-full select-none text-xs flex flex-col h-full">
      {/* Title */}
      <div className="bg-[#AAAAAA] text-black px-1.5 py-0.5 font-pixel text-[10px] flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-blue-900" />
          <span>CHAT EN TIEMPO REAL (BBS CONSOLE)</span>
        </div>
        <span className="text-[9px] text-gray-800">VS {opponentName.toUpperCase()}</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-[#000033] p-2 dos-inset overflow-y-auto max-h-[140px] sm:max-h-[180px] space-y-1.5 font-tech text-[11px]">
        {messages.length === 0 ? (
          <div className="text-gray-400 italic text-center py-3 font-dos text-base">
            Canal de comunicación en línea abierto.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-1.5 rounded-none border ${
                msg.isSystem
                  ? 'bg-[#000055] border-yellow-500 text-yellow-300 font-pixel text-[9px]'
                  : msg.isAi
                  ? 'bg-[#002244] border-cyan-500 text-cyan-200'
                  : 'bg-[#003311] border-lime-500 text-white'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] opacity-75 mb-0.5">
                <span className="font-pixel text-yellow-300">{msg.sender}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="break-words font-tech leading-tight">{msg.text}</div>
            </div>
          ))
        )}
      </div>

      {/* Quick Emotes & Phrases Bar */}
      <div className="my-1.5 space-y-1">
        {/* Quick phrases */}
        <div className="flex flex-wrap gap-1">
          {quickPhrases.map((phrase) => (
            <button
              key={phrase}
              onClick={() => handleQuickPhrase(phrase)}
              className="px-1.5 py-0.5 bg-[#000055] hover:bg-[#000088] text-[9px] font-pixel text-yellow-200 border border-gray-600 active:scale-95"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Emotes */}
        <div className="flex gap-1">
          {quickEmotes.map((em) => (
            <button
              key={em}
              onClick={() => handleQuickPhrase(em)}
              className="px-1.5 py-0.5 bg-[#000044] hover:bg-[#000066] text-sm border border-gray-700"
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input Form */}
      <form onSubmit={handleSend} className="flex gap-1">
        <input
          type="text"
          placeholder="Escribe mensaje..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-black text-white px-2 py-1 border border-gray-500 font-tech text-xs focus:outline-none focus:border-yellow-300"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-[#005500] hover:bg-[#007700] text-lime-300 border border-white font-pixel text-[9px] flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          <span>ENVIAR</span>
        </button>
      </form>
    </div>
  );
};
