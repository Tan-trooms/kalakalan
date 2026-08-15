import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRightLeft, 
  CheckCircle2, 
  Send, 
  Plus, 
  Image as ImageIcon, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  RefreshCw,
  Sun,
  Moon,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, TradeMatch, ThemeMode, UserProfile } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { SafeImage } from './SafeImage';

interface ChatViewProps {
  match: TradeMatch;
  allMatches: TradeMatch[];
  messages: ChatMessage[];
  theme: ThemeMode;
  onToggleTheme: () => void;
  onBack: () => void;
  onSelectMatch: (matchId: string) => void;
  onSendMessage: (matchId: string, text: string, imageUrl?: string) => void;
  onFinalizeTrade: (matchId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  match,
  allMatches,
  messages,
  theme,
  onToggleTheme,
  onBack,
  onSelectMatch,
  onSendMessage,
  onFinalizeTrade,
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedPhotoUrl) return;

    onSendMessage(match.id, inputText.trim(), selectedPhotoUrl || undefined);
    setInputText('');
    setSelectedPhotoUrl(null);
    setShowAttachmentMenu(false);
  };

  const handleQuickReply = (replyText: string) => {
    onSendMessage(match.id, replyText);
  };

  const filteredMatches = allMatches.filter((m) =>
    m.partner.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.myOffering.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.theirOffering.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className={`w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 h-[calc(100vh-4.5rem)] flex flex-col transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Desktop Multi-Panel Container */}
      <div className={`flex-1 flex rounded-2xl sm:rounded-3xl border overflow-hidden shadow-md transition-all ${
        isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* LEFT PANEL: Trade Conversations List (Visible on md+) */}
        <div className={`w-72 lg:w-80 shrink-0 hidden md:flex flex-col border-r ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          {/* Left Panel Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base tracking-tight">Active Barters</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {allMatches.length}
              </span>
            </div>

            {/* Quick Search in chats */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search trades..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Matches List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredMatches.map((m) => {
              const isSelected = m.id === match.id;
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMatch(m.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? isDark
                        ? 'bg-emerald-500/15 border-l-4 border-emerald-400'
                        : 'bg-emerald-50 border-l-4 border-emerald-600'
                      : isDark
                      ? 'hover:bg-slate-800/50'
                      : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={m.partner.avatar}
                      alt={m.partner.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                    {m.unreadCount && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs truncate max-w-[120px]">{m.partner.name}</h4>
                      <span className="text-[10px] text-slate-400">{m.matchedAt}</span>
                    </div>

                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate mt-0.5">
                      {m.myOffering.title} ↔ {m.theirOffering.title}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                      {m.lastMessage || 'Active negotiation'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER PANEL: Main Chat Conversation */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
          {/* Chat Top Header */}
          <div className={`p-3 sm:px-6 sm:py-3.5 border-b flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-100'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onBack}
                className={`p-2 -ml-1 rounded-xl transition-colors md:hidden ${
                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
                aria-label="Back to matches"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={match.partner.avatar}
                  alt={match.partner.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
                    {match.partner.name}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                  <span>★ {match.partner.trustScore}</span>
                  <span>•</span>
                  <span className="truncate">{match.theirOffering.title}</span>
                </div>
              </div>
            </div>

            {/* Header Right Action: Finalize Button */}
            <div className="flex items-center gap-2">
              <button
                id="btn-header-finalize"
                onClick={() => onFinalizeTrade(match.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                  match.status === 'Trade Finalized'
                    ? 'bg-purple-600 text-white cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{match.status === 'Trade Finalized' ? 'Finalized' : 'Finalize Trade'}</span>
              </button>
            </div>
          </div>

          {/* Desktop Compact Barter Strip */}
          <div className={`px-4 py-2 border-b flex items-center justify-between text-xs font-medium ${
            isDark ? 'bg-slate-900/70 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] font-bold text-slate-400 uppercase">OFFERING:</span>
              <span className="font-bold truncate max-w-[120px] sm:max-w-[200px]">{match.myOffering.title}</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
              <ArrowRightLeft className="w-3 h-3" />
              <span>Direct Barter</span>
            </div>

            <div className="flex items-center gap-2 truncate text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">RECEIVING:</span>
              <span className="font-bold truncate max-w-[120px] sm:max-w-[200px]">{match.theirOffering.title}</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            <div className="flex justify-center my-2">
              <span className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full ${
                isDark ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                TODAY • CAMPUS SECURE TRADE CHANNEL
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.senderId === 'user-me' || msg.senderId === CURRENT_USER.id;

              if (msg.isSystemEvent) {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <div className={`px-4 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 shadow-xs ${
                      isDark ? 'bg-slate-900/90 border-slate-800 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{msg.text || 'Trade terms initiated between campus peers'}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="shrink-0 mb-1">
                      {msg.senderAvatar ? (
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center">
                          {msg.senderName.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 space-y-2 text-sm shadow-xs ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : isDark
                      ? 'bg-[#152342] text-slate-100 border border-slate-800 rounded-bl-xs'
                      : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200'
                  }`}>
                    {msg.text && (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {msg.imageUrl && (
                      <div className="rounded-xl overflow-hidden mt-2 border border-black/10 dark:border-white/10">
                        <img
                          src={msg.imageUrl}
                          alt="Trade item preview"
                          className="w-full max-h-60 object-cover"
                        />
                        {msg.imageCaption && (
                          <div className="p-1.5 bg-black/50 text-[11px] text-white backdrop-blur-xs">
                            {msg.imageCaption}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`text-[10px] text-right font-medium ${
                      isMe ? 'text-emerald-200' : 'text-slate-400'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Strip */}
          <div className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto no-scrollbar ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Quick reply:</span>
            {[
              '📍 Meet at Student Union 2 PM',
              '🔍 Confirm working condition',
              '🤝 Ready to finalize trade',
              '📸 Can you send a close-up photo?'
            ].map((text) => (
              <button
                key={text}
                onClick={() => handleQuickReply(text)}
                className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-400' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 shadow-2xs'
                }`}
              >
                {text}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <div className={`p-3 sm:px-6 sm:py-4 border-t ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className={`p-2.5 rounded-xl transition-colors ${
                  showAttachmentMenu
                    ? 'bg-emerald-500 text-slate-950'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Attach photo"
              >
                <Plus className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                <input
                  id="input-chat-message"
                  type="text"
                  placeholder={`Message ${match.partner.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <button
                id="btn-send-chat"
                type="submit"
                disabled={!inputText.trim() && !selectedPhotoUrl}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  inputText.trim() || selectedPhotoUrl
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                    : isDark
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Photo Attachment Picker */}
            {showAttachmentMenu && (
              <div className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhotoUrl('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80');
                    setShowAttachmentMenu(false);
                    setInputText('Here is the condition photo of the item.');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                >
                  <Camera className="w-4 h-4" />
                  Attach Camera Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhotoUrl('https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&auto=format&fit=crop&q=80');
                    setShowAttachmentMenu(false);
                    setInputText('Attaching photo of the hardware status.');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30"
                >
                  <ImageIcon className="w-4 h-4" />
                  Attach Gear Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Trade Inspector & Campus Safety Details (Visible on xl+) */}
        <div className={`w-80 shrink-0 hidden xl:flex flex-col border-l p-5 space-y-5 overflow-y-auto ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-3">
              Trade Overview
            </h3>
            
            {/* Visual Swap comparison cards */}
            <div className="space-y-3">
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Your Item (Offering)</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                    <SafeImage src={match.myOffering.imageUrl} alt={match.myOffering.title} title={match.myOffering.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{match.myOffering.title}</div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Tier {match.myOffering.tier}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-emerald-500">
                <ArrowRightLeft className="w-5 h-5" />
              </div>

              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Their Item (Receiving)</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                    <SafeImage src={match.theirOffering.imageUrl} alt={match.theirOffering.title} title={match.theirOffering.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{match.theirOffering.title}</div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Tier {match.theirOffering.tier}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Meetup Safety Box */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <h4 className="text-xs font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              Campus Safe Exchange
            </h4>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Meet in daylight at Student Union or Library.
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Inspect hardware/book condition before final confirmation.
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Both parties click "Finalize Trade" to earn trust score.
              </li>
            </ul>
          </div>

          {/* Action Finalize Button */}
          <button
            onClick={() => onFinalizeTrade(match.id)}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Finalize Barter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
