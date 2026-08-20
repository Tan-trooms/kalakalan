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
  AlertCircle,
  ChevronDown,
  XCircle,
  Menu,
  Info
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
  onRejectTrade?: (matchId: string) => void;
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
  onRejectTrade,
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showTradeDropdown, setShowTradeDropdown] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

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
    <div className={`w-full max-w-7xl mx-auto px-1 sm:px-2 lg:px-4 py-1 sm:py-2 h-full flex flex-col overflow-hidden transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Desktop Multi-Panel Container */}
      <div className={`flex-1 flex h-full rounded-2xl sm:rounded-3xl border overflow-hidden shadow-md transition-all ${
        isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* LEFT PANEL: Trade Conversations List (Visible on md+ when showLeftSidebar is true) */}
        {showLeftSidebar && (
          <div className={`w-72 lg:w-80 shrink-0 hidden md:flex flex-col border-r ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
          }`}>
            {/* Left Panel Header */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm tracking-tight">Active Barters</h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {allMatches.length}
                  </span>
                </div>

                {/* Left Sidebar Toggle Button (Inside Sidebar when shown) */}
                <button
                  onClick={() => setShowLeftSidebar(false)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Hide Barters List"
                  aria-label="Hide Barters Sidebar"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Search in chats */}
              <div className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search trades..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400 text-xs"
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
                    className={`p-3 flex items-start gap-2.5 cursor-pointer transition-colors ${
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
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                      />
                      {m.unreadCount && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs truncate max-w-[130px] text-slate-900 dark:text-white">{m.partner.name}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{m.matchedAt}</span>
                      </div>

                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold truncate mt-0.5">
                        {m.myOffering.title} ↔ {m.theirOffering.title}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {m.lastMessage || 'Active negotiation'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CENTER PANEL: Main Chat Conversation */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-transparent relative">
          {/* Chat Top Header */}
          <div className={`flex-none shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 border-b flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200/80'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Left Sidebar Toggle Button in Main Chat Header (When Hidden) */}
              {!showLeftSidebar && (
                <button
                  onClick={() => setShowLeftSidebar(true)}
                  className={`p-1.5 rounded-xl transition-colors hidden md:flex items-center justify-center shrink-0 ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                  }`}
                  title="Show Barters List"
                  aria-label="Show Barters Sidebar"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onBack}
                className={`p-1.5 -ml-1 rounded-xl transition-colors md:hidden ${
                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
                aria-label="Back to matches"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={match.partner.avatar}
                  alt={match.partner.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm leading-tight truncate text-slate-900 dark:text-white">
                    {match.partner.name}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate font-medium">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">★ {match.partner.trustScore}</span>
                  <span>•</span>
                  <span className="truncate">{match.theirOffering.title}</span>
                </div>
              </div>
            </div>

            {/* Header Right Action & Sidebar Toggle */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <button
                  id="btn-header-finalize"
                  onClick={() => {
                    if (match.status === 'Trade Finalized') return;
                    setShowTradeDropdown(!showTradeDropdown);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer ${
                    match.status === 'Trade Finalized'
                      ? 'bg-purple-600 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{match.status === 'Trade Finalized' ? 'Finalized' : 'Finalize'}</span>
                  {match.status !== 'Trade Finalized' && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showTradeDropdown ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {showTradeDropdown && match.status !== 'Trade Finalized' && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowTradeDropdown(false)}
                    />
                    <div className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-xl border p-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150 ${
                      isDark ? 'bg-[#0B132B] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                      {/* Confirm Trade Option */}
                      <button
                        onClick={() => {
                          setShowTradeDropdown(false);
                          onFinalizeTrade(match.id);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Confirm Trade</span>
                      </button>

                      {/* Reject Trade Option */}
                      <button
                        onClick={() => {
                          setShowTradeDropdown(false);
                          if (onRejectTrade) {
                            onRejectTrade(match.id);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>Reject Trade</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Right Sidebar Toggle Button */}
              <button
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className={`p-1.5 rounded-xl transition-colors hidden xl:flex items-center justify-center shrink-0 border ${
                  showRightSidebar
                    ? isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : isDark
                    ? 'bg-transparent border-slate-800 hover:bg-slate-800 text-slate-400'
                    : 'bg-transparent border-slate-200 hover:bg-slate-100 text-slate-500'
                }`}
                title={showRightSidebar ? "Hide Trade Details" : "Show Trade Details"}
                aria-label="Toggle Trade Details Sidebar"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Compact Barter Strip */}
          <div className={`flex-none shrink-0 px-3 py-1.5 sm:px-4 sm:py-1.5 border-b flex items-center justify-between text-xs font-medium ${
            isDark ? 'bg-slate-900/70 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">OFFERING:</span>
              <span className="font-bold truncate max-w-[140px] sm:max-w-[220px] text-xs text-slate-900 dark:text-white">{match.myOffering.title}</span>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold shrink-0 border border-emerald-500/20 text-[10px]">
              <ArrowRightLeft className="w-3 h-3" />
              <span>Direct Barter</span>
            </div>

            <div className="flex items-center gap-1.5 truncate text-right">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">RECEIVING:</span>
              <span className="font-bold truncate max-w-[140px] sm:max-w-[220px] text-xs text-slate-900 dark:text-white">{match.theirOffering.title}</span>
            </div>
          </div>

          {/* Messages Stream Scroll Area */}
          <div className="flex-1 overflow-y-auto min-h-0 p-2.5 sm:p-3.5">
            {messages.map((msg) => {
              if (msg.isSystemEvent || msg.senderId === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 flex items-center gap-1.5 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-teal-500 shrink-0" />
                      <span>{msg.text || (msg.systemEventType === 'initiated' ? 'Trade negotiation initiated' : 'System update')}</span>
                    </div>
                  </div>
                );
              }

              const isMe = msg.senderId === 'user-me' || msg.senderId === 'me' || msg.senderId === 'current-user' || msg.senderId !== match.partner.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 mb-2 sm:mb-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* User Avatar */}
                  <img
                    src={msg.senderAvatar || (isMe ? CURRENT_USER.avatar : match.partner.avatar)}
                    alt={msg.senderName || (isMe ? CURRENT_USER.name : match.partner.name)}
                    className={`w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ${
                      isMe ? 'ring-1 ring-teal-500/30' : 'ring-1 ring-slate-300 dark:ring-slate-700'
                    }`}
                  />

                  {/* Message Content & Name */}
                  <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* Sender Name */}
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-medium px-1">
                      {msg.senderName || (isMe ? CURRENT_USER.name : match.partner.name)}
                    </span>

                    {/* Chat Bubble */}
                    <div className={`rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2 space-y-1 text-xs sm:text-sm shadow-2xs ${
                      isMe
                        ? 'bg-teal-600 dark:bg-teal-700 text-white rounded-tr-xs'
                        : isDark
                        ? 'bg-[#242526] text-slate-100 border border-slate-700/40 rounded-tl-xs'
                        : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-xs'
                    }`}>
                      {msg.text && (
                        <p className="leading-snug whitespace-pre-wrap text-xs sm:text-sm break-words">{msg.text}</p>
                      )}

                      {msg.imageUrl && (
                        <div className="rounded-xl overflow-hidden mt-1.5 border border-black/10 dark:border-white/10">
                          <img
                            src={msg.imageUrl}
                            alt="Trade item preview"
                            className="w-full max-h-52 object-cover"
                          />
                          {msg.imageCaption && (
                            <div className="p-1.5 bg-black/50 text-[11px] text-white backdrop-blur-xs">
                              {msg.imageCaption}
                            </div>
                          )}
                        </div>
                      )}

                      <div className={`text-[10px] text-right font-medium mt-0.5 ${
                        isMe ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Strip */}
          <div className={`flex-none shrink-0 px-2.5 py-1 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase shrink-0">Quick reply:</span>
            {[
              '📍 Meet at APC Cafeteria 2 PM',
              '🔍 Confirm working condition',
              '🤝 Ready to finalize trade',
              '📸 Can you send a close-up photo?'
            ].map((text) => (
              <button
                key={text}
                onClick={() => handleQuickReply(text)}
                className={`whitespace-nowrap px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all active:scale-95 ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-400' 
                    : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700 shadow-2xs'
                }`}
              >
                {text}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <div className={`flex-none shrink-0 p-1.5 sm:px-3 sm:py-1.5 border-t ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <form onSubmit={handleSend} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showAttachmentMenu
                    ? 'bg-emerald-500 text-slate-950'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Attach photo"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  id="input-chat-message"
                  type="text"
                  autoComplete="off"
                  placeholder={`Message ${match.partner.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs sm:text-sm border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <button
                id="btn-send-chat"
                type="submit"
                disabled={!inputText.trim() && !selectedPhotoUrl}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-xs ${
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
              <div className={`mt-1.5 p-1.5 rounded-xl border flex items-center gap-2 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhotoUrl('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80');
                    setShowAttachmentMenu(false);
                    setInputText('Here is the condition photo of the item.');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/30"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Attach Camera Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhotoUrl('https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&auto=format&fit=crop&q=80');
                    setShowAttachmentMenu(false);
                    setInputText('Attaching photo of the hardware status.');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-400 hover:bg-sky-500/30"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Attach Gear Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Trade Inspector & Campus Safety Details (Visible on xl+ when showRightSidebar is true) */}
        {showRightSidebar && (
          <div className={`w-80 shrink-0 hidden xl:flex flex-col border-l p-5 space-y-5 overflow-y-auto ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
          }`}>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                Trade Overview
              </h3>
              
              {/* Visual Swap comparison cards */}
              <div className="space-y-3">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Your Item (Offering)</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                      <SafeImage src={match.myOffering.imageUrl} alt={match.myOffering.title} title={match.myOffering.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{match.myOffering.title}</div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">Tier {match.myOffering.tier}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>

                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Their Item (Receiving)</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                      <SafeImage src={match.theirOffering.imageUrl} alt={match.theirOffering.title} title={match.theirOffering.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{match.theirOffering.title}</div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">Tier {match.theirOffering.tier}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Meetup Safety Box */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <h4 className="text-xs font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                Campus Safe Exchange
              </h4>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  Meet in daylight at APC Cafeteria or Library.
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  Inspect hardware/book condition before final confirmation.
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  Both parties click "Finalize Trade" to earn trust score.
                </li>
              </ul>
            </div>

            {/* Action Trade Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => onFinalizeTrade(match.id)}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Finalize Barter</span>
              </button>

              <button
                onClick={() => {
                  if (onRejectTrade) {
                    onRejectTrade(match.id);
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 bg-transparent cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Trade</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
