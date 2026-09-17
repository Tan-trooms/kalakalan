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
  Search, 
  Check, 
  ChevronDown, 
  XCircle, 
  Menu, 
  Info, 
  Lock, 
  Edit2, 
  X, 
  Archive, 
  Clock, 
  Circle,
  Maximize2,
  Star,
  Receipt,
  Trash2
} from 'lucide-react';
import { ChatMessage, TradeMatch, ThemeMode, UserProfile } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { SafeImage } from './SafeImage';
import { ImageLightboxModal } from './ImageLightboxModal';
import { TradeReceiptModal, TradeReceiptData } from './TradeReceiptModal';

interface ChatViewProps {
  match: TradeMatch;
  allMatches: TradeMatch[];
  messages: ChatMessage[];
  theme: ThemeMode;
  currentUser?: UserProfile | null;
  onToggleTheme: () => void;
  onBack: () => void;
  onSelectMatch: (matchId: string) => void;
  onSendMessage: (matchId: string, text: string, imageUrl?: string) => void;
  onEditMessage?: (matchId: string, messageId: string, newText: string) => void;
  onDeleteMessage?: (matchId: string, messageId: string) => void;
  onFinalizeTrade: (matchId: string) => void;
  onRejectTrade?: (matchId: string) => void;
  onToggleArchive?: (matchId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  match,
  allMatches,
  messages,
  theme,
  currentUser,
  onToggleTheme,
  onBack,
  onSelectMatch,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onFinalizeTrade,
  onRejectTrade,
  onToggleArchive,
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showTradeDropdown, setShowTradeDropdown] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; title: string; initialIndex: number } | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Message Editing State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  // Check if trade is locked
  const isFinalized = match.status === 'Trade Finalized';
  const isRejected = match.status === 'Trade Rejected';
  const isLocked = isFinalized || isRejected;

  const dynamicReceiptData: TradeReceiptData = {
    transaction: {
      id: `#KLK-${match.id.replace('match-', '').toUpperCase()}-APC`,
      timestamp: 'September 9, 2026 | 3:38 PM',
      status: 'VERIFIED & COMPLETED',
    },
    currentUser: {
      name: currentUser?.name || 'Tristan G.',
      avatar: currentUser?.avatar,
      item: {
        name: match.myOffering.title,
        condition: match.myOffering.condition || '2nd Hand',
        usageDuration: match.myOffering.usageDuration || '1 Year',
        image: match.myOffering.images?.[0] || match.myOffering.imageUrl,
      },
      tradeStreak: (currentUser?.completedTrades || 0) > 0 ? currentUser?.completedTrades : 3,
    },
    partner: {
      name: match.partner.name,
      avatar: match.partner.avatar,
      item: {
        name: match.theirOffering.title,
        condition: match.theirOffering.condition || '2nd Hand',
        usageDuration: match.theirOffering.usageDuration || '6 Months',
        image: match.theirOffering.images?.[0] || match.theirOffering.imageUrl,
      },
    },
    meetup: {
      location: match.partner.location ? `Asia Pacific College - ${match.partner.location}` : 'Asia Pacific College - Cafeteria',
      time: '2:00 PM',
      confirmedNote: 'Both parties clicked "Finalize Trade"',
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessageId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLocked) return; // Enforce restriction
    if (!inputText.trim() && !selectedPhotoUrl) return;

    onSendMessage(match.id, inputText.trim(), selectedPhotoUrl || undefined);
    setInputText('');
    setSelectedPhotoUrl(null);
    setShowAttachmentMenu(false);
  };

  const handleQuickReply = (replyText: string) => {
    if (isLocked) return;
    onSendMessage(match.id, replyText);
  };

  const handleStartEdit = (msg: ChatMessage) => {
    if (isLocked) return;
    setEditingMessageId(msg.id);
    setEditingMessageText(msg.text || '');
  };

  const handleSaveEdit = (messageId: string) => {
    if (editingMessageText.trim() && onEditMessage) {
      onEditMessage(match.id, messageId, editingMessageText.trim());
    }
    setEditingMessageId(null);
    setEditingMessageText('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageText('');
  };

  const handleDelete = (messageId: string) => {
    if (isLocked) return;
    if (editingMessageId === messageId) {
      setEditingMessageId(null);
      setEditingMessageText('');
    }
    if (onDeleteMessage) {
      onDeleteMessage(match.id, messageId);
    }
  };

  const filteredMatches = allMatches.filter((m) => {
    const matchesSearch =
      m.partner.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.myOffering.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.theirOffering.title.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;

    if (sidebarFilter === 'active') return !m.isArchived && m.status !== 'Trade Finalized' && m.status !== 'Trade Rejected';
    if (sidebarFilter === 'archived') return m.isArchived || m.status === 'Trade Finalized' || m.status === 'Trade Rejected';
    return true;
  });

  const partnerIsOnline = match.partner.isOnline !== undefined 
    ? match.partner.isOnline 
    : match.partner.trustScore === 'High Trust';

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden transition-colors duration-200 px-0 sm:px-3 lg:px-5 pt-0 sm:pt-3 pb-24 sm:pb-28 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Desktop Multi-Panel Container — full-bleed Messenger shell */}
      <div className={`flex-1 flex h-full min-h-0 overflow-hidden border transition-all sm:rounded-2xl border-x-0 sm:border-x ${
        isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* LEFT PANEL: Trade Conversations List */}
        {showLeftSidebar && (
          <div className={`w-80 xl:w-[340px] shrink-0 hidden md:flex flex-col border-r ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Left Panel Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-bold text-[17px] tracking-tight">Barter Threads</h2>
                  <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {allMatches.length}
                  </span>
                </div>

                {/* Left Sidebar Toggle Button */}
                <button
                  onClick={() => setShowLeftSidebar(false)}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Hide Barters List"
                  aria-label="Hide Barters Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search in chats */}
              <div className={`flex items-center gap-2.5 px-4 h-11 rounded-full border text-sm ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-[#f0f2f5] border-transparent text-slate-900'
              }`}>
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search trades..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400 text-[15px]"
                />
              </div>

              {/* Filter Tabs: All, Active, Archived */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-[13px] font-semibold">
                {(['all', 'active', 'archived'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSidebarFilter(tab)}
                    className={`py-2 rounded-full capitalize transition-all ${
                      sidebarFilter === tab
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Matches List with Presence and Archive indicators */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredMatches.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No {sidebarFilter !== 'all' ? sidebarFilter : ''} threads found.
                </div>
              ) : (
                filteredMatches.map((m) => {
                  const isSelected = m.id === match.id;
                  const isMOnline = m.partner.isOnline !== undefined ? m.partner.isOnline : true;

                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectMatch(m.id)}
                      className={`px-4 py-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? isDark
                            ? 'bg-emerald-500/15 border-l-4 border-emerald-400'
                            : 'bg-emerald-50 border-l-4 border-emerald-600'
                          : 'border-l-4 border-transparent'
                          + (isDark
                            ? ' hover:bg-slate-800/50'
                            : ' hover:bg-slate-100/60')
                      }`}
                    >
                      {/* Avatar with Presence Dot */}
                      <div className="relative shrink-0">
                        <img
                          src={m.partner.avatar}
                          alt={m.partner.name}
                          className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                        />
                        {/* Real-time Online Indicator */}
                        {isMOnline ? (
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                          </span>
                        ) : (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-[15px] truncate text-slate-900 dark:text-white">
                            {m.partner.name}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal shrink-0">
                            {m.matchedAt}
                          </span>
                        </div>

                        <div className="text-[13px] text-emerald-700 dark:text-emerald-400 font-semibold truncate mt-1">
                          {m.myOffering.title} ↔ {m.theirOffering.title}
                        </div>

                        <div className="flex items-center justify-between mt-1.5 gap-2">
                          <p className="text-[13px] text-slate-600 dark:text-slate-400 truncate flex-1">
                            {m.lastMessage || 'Active negotiation'}
                          </p>

                          {/* Status / Archive Badges */}
                          {m.status === 'Trade Finalized' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-600 dark:text-purple-300 shrink-0">
                              Finalized
                            </span>
                          ) : m.status === 'Trade Rejected' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
                              Rejected
                            </span>
                          ) : m.isArchived ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                              Archived
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* CENTER PANEL: Main Chat Conversation */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-transparent relative">
          {/* Chat Top Header */}
          <div className={`flex-none shrink-0 px-5 sm:px-7 py-4 border-b flex items-center justify-between gap-4 ${
            isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200/80'
          }`}>
            <div className="flex items-center gap-3.5 min-w-0">
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

              {/* Partner Avatar with Real-time Presence */}
              <div className="relative shrink-0">
                <img
                  src={match.partner.avatar}
                  alt={match.partner.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                {partnerIsOnline ? (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                  </span>
                ) : (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[17px] leading-tight truncate text-slate-900 dark:text-white">
                    {match.partner.name}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                
                {/* Real-time Presence Text */}
                <div className="text-xs flex items-center gap-2 truncate font-normal mt-1">
                  {partnerIsOnline ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Active now
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">
                      {match.partner.lastActive || 'Offline'}
                    </span>
                  )}
                  <span className="text-slate-400">•</span>
                  <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{match.partner.rating ? match.partner.rating.toFixed(1) : '5.0'}</span>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{match.partner.trustScore}</span>
                </div>
              </div>
            </div>

            {/* Header Right Action & Sidebar Toggle */}
            <div className="flex items-center gap-1.5">
              {/* Archive Toggle Button */}
              {onToggleArchive && (
                <button
                  onClick={() => onToggleArchive(match.id)}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    match.isArchived
                      ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30'
                      : isDark
                      ? 'border-slate-800 hover:bg-slate-800 text-slate-400'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  title={match.isArchived ? "Unarchive thread" : "Archive thread"}
                  aria-label="Toggle archive"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Finalize / Reject Dropdown or Badge */}
              <div className="relative">
                {isFinalized ? (
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                    title="View Digital Trade Receipt"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Finalized Receipt</span>
                  </button>
                ) : isRejected ? (
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejected</span>
                  </span>
                ) : (
                  <button
                    id="btn-header-finalize"
                    onClick={() => setShowTradeDropdown(!showTradeDropdown)}
                    className="px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finalize</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showTradeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {showTradeDropdown && !isLocked && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowTradeDropdown(false)}
                    />
                    <div className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-xl border p-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150 ${
                      isDark ? 'bg-[#0B132B] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
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

                      <button
                        onClick={() => {
                          setShowTradeDropdown(false);
                          if (onRejectTrade) {
                            onRejectTrade(match.id);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
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

          {/* Barter context strip — roomy, wraps instead of squeezing */}
          <div className={`flex-none shrink-0 px-5 sm:px-7 py-3.5 border-b flex items-center gap-x-5 gap-y-2 flex-wrap text-sm font-normal ${
            isDark ? 'bg-slate-900/70 border-slate-800 text-slate-300' : 'bg-[#f0f2f5] border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2 min-w-0 flex-1 basis-52">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide shrink-0">Offering</span>
              <span className="font-medium truncate text-[15px] text-slate-900 dark:text-white">
                {match.myOffering.title} ({match.myOffering.condition})
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shrink-0 text-[13px]">
              <ArrowRightLeft className="w-4 h-4" />
              <span>Direct Barter</span>
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1 basis-52 sm:justify-end">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide shrink-0">Receiving</span>
              <span className="font-medium truncate text-[15px] text-slate-900 dark:text-white">
                {match.theirOffering.title} ({match.theirOffering.condition})
              </span>
            </div>
          </div>

          {/* Messages Stream Scroll Area */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6 sm:px-8 sm:py-8">
            <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg) => {
              if (msg.isSystemEvent || msg.senderId === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-5">
                    <div className="px-4 py-2 rounded-full text-xs font-medium bg-slate-200/80 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-2xs border border-black/5 dark:border-white/5 max-w-full flex-wrap justify-center">
                      {msg.systemEventType === 'trade_finalized' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      ) : msg.systemEventType === 'trade_rejected' ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      )}
                      <span>{msg.text || (msg.systemEventType === 'initiated' ? 'Trade negotiation initiated' : 'System update')}</span>
                      {msg.systemEventType === 'trade_finalized' && (
                        <button
                          type="button"
                          onClick={() => setShowReceiptModal(true)}
                          className="ml-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                        >
                          View Receipt
                        </button>
                      )}
                      <span className="text-[9px] text-slate-400 font-normal">({msg.timestamp})</span>
                    </div>
                  </div>
                );
              }

              const isMe = msg.senderId === 'user-me' || msg.senderId === 'me' || msg.senderId === 'current-user' || msg.senderId !== match.partner.id;
              const isEditingThis = editingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`group flex items-start gap-3 mb-5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* User Avatar */}
                  <img
                    src={msg.senderAvatar || (isMe ? CURRENT_USER.avatar : match.partner.avatar)}
                    alt={msg.senderName || (isMe ? CURRENT_USER.name : match.partner.name)}
                    className={`w-9 h-9 rounded-full object-cover shrink-0 mt-1 ${
                      isMe ? 'ring-1 ring-teal-500/30' : 'ring-1 ring-slate-300 dark:ring-slate-700'
                    }`}
                  />

                  {/* Message Content & Name */}
                  <div className={`flex flex-col max-w-[78%] lg:max-w-[62%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* Sender Name */}
                    <span className="text-[13px] text-gray-500 dark:text-gray-400 mb-1.5 font-normal px-1.5">
                      {msg.senderName || (isMe ? CURRENT_USER.name : match.partner.name)}
                    </span>

                    {/* Chat Bubble / Inline Editor */}
                    {isEditingThis ? (
                      <div className={`p-2.5 rounded-2xl border w-full space-y-2 ${
                        isDark ? 'bg-slate-900 border-emerald-500' : 'bg-white border-emerald-600 shadow-md'
                      }`}>
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(msg.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-white"
                        />
                        <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(msg.id)}
                            className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group/bubble flex items-center gap-2">
                        {/* Edit & Delete Action Buttons for user's own sent message */}
                        {isMe && !isLocked && !msg.isDeleted && (
                          <div className="opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1.5 p-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800/70 backdrop-blur-xs">
                            {onEditMessage && (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(msg)}
                                className="p-1.5 rounded-md transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-300/60 dark:hover:bg-slate-700/60 cursor-pointer"
                                title="Edit message"
                                aria-label="Edit message"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDelete(msg.id)}
                              className="p-1.5 rounded-md transition-colors text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                              title="Delete message"
                              aria-label="Delete message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className={`rounded-3xl px-4 py-3 space-y-1.5 text-[15px] leading-relaxed shadow-sm max-w-full min-w-0 break-words [overflow-wrap:anywhere] overflow-hidden ${
                          msg.isDeleted
                            ? isDark
                              ? 'bg-slate-900/60 text-slate-400 border border-slate-800/80 rounded-tr-md'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 rounded-tr-md'
                            : isMe
                            ? 'bg-emerald-600 dark:bg-emerald-600 text-white rounded-tr-md'
                            : isDark
                            ? 'bg-[#3a3b3c] text-slate-100 rounded-tl-md'
                            : 'bg-[#e4e6eb] text-slate-900 rounded-tl-md'
                        }`}>
                          {msg.isDeleted ? (
                            <p className="italic text-[15px] text-slate-400 dark:text-slate-400 select-none py-0.5">
                              This message was deleted.
                            </p>
                          ) : (
                            <>
                              {msg.text && (
                                <p className="leading-relaxed whitespace-pre-wrap text-[15px] break-words [overflow-wrap:anywhere]">{msg.text}</p>
                              )}

                              {msg.imageUrl && (
                                <div
                                  onClick={() => setLightboxData({ images: [msg.imageUrl!], title: msg.imageCaption || 'Trade attachment', initialIndex: 0 })}
                                  className="rounded-xl overflow-hidden mt-1.5 border border-black/10 dark:border-white/10 cursor-zoom-in group/img relative"
                                  title="Click to view full uncropped photo"
                                >
                                  <img
                                    src={msg.imageUrl}
                                    alt="Trade item preview"
                                    className="w-full max-h-52 object-cover group-hover/img:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold">
                                    <Maximize2 className="w-3 h-3" />
                                    <span>Expand</span>
                                  </div>
                                  {msg.imageCaption && (
                                    <div className="p-1.5 bg-black/50 text-[11px] text-white backdrop-blur-xs">
                                      {msg.imageCaption}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}

                          {/* Timestamp & Edited status */}
                          <div className={`text-[10px] text-right font-medium mt-0.5 flex items-center justify-end gap-1 ${
                            msg.isDeleted
                              ? 'text-slate-400/80 dark:text-slate-500'
                              : isMe
                              ? 'text-teal-100'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {msg.isEdited && !msg.isDeleted && (
                              <span className="italic text-[9px] opacity-85">(edited)</span>
                            )}
                            <span title={`Sent at: ${msg.createdAt || msg.timestamp}`}>{msg.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Replies Strip (Disabled when locked) */}
          {!isLocked && (
            <div className={`flex-none shrink-0 px-5 py-3 border-t flex items-center gap-2.5 overflow-x-auto no-scrollbar ${
              isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 shrink-0">Quick reply:</span>
              {[
                '📍 Meet at APC Cafeteria 2 PM',
                '🔍 Confirm working condition',
                '🤝 Ready to finalize trade',
                '📸 Can you send a close-up photo?'
              ].map((text) => (
                <button
                  key={text}
                  onClick={() => handleQuickReply(text)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-normal border transition-all active:scale-95 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-400' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 shadow-sm'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Locked Status Banner (When Finalized or Rejected) */}
          {isLocked && (
            <div className="flex-none shrink-0 p-2 sm:px-3">
              {isFinalized ? (
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
                  <Lock className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold">Trade Finalized: </span>
                    <span>This exchange has been locked and archived. Messaging is disabled.</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                    Archived
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold">Trade Rejected: </span>
                    <span>This proposal was rejected. Messaging has been closed for this trade.</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                    Archived
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Message Input Bar (Locked and Disabled if Trade is Finalized or Rejected) */}
          <div className={`flex-none shrink-0 p-4 sm:px-6 border-t ${
            isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <form onSubmit={handleSend} className="flex items-center gap-2.5 max-w-3xl mx-auto w-full">
              {/* Attachment Button */}
              <button
                type="button"
                disabled={isLocked}
                onClick={() => !isLocked && setShowAttachmentMenu(!showAttachmentMenu)}
                className={`p-2.5 rounded-full transition-colors ${
                  isLocked
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : showAttachmentMenu
                    ? 'bg-emerald-500 text-slate-950'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title={isLocked ? "Messaging locked" : "Attach photo"}
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  id="input-chat-message"
                  type="text"
                  autoComplete="off"
                  disabled={isLocked}
                  placeholder={
                    isFinalized 
                      ? "Trade finalized — messaging is locked." 
                      : isRejected 
                      ? "Trade rejected — messaging is closed." 
                      : `Message ${match.partner.name}...`
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`w-full py-3 px-5 rounded-full text-[15px] border outline-none transition-all ${
                    isLocked
                      ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed placeholder:text-slate-400 dark:placeholder:text-slate-600'
                      : isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500' 
                      : 'bg-[#f0f2f5] border-transparent focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* Send Button */}
              <button
                id="btn-send-chat"
                type="submit"
                disabled={isLocked || (!inputText.trim() && !selectedPhotoUrl)}
                className={`p-3 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  !isLocked && (inputText.trim() || selectedPhotoUrl)
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send className="w-[18px] h-[18px]" />
              </button>
            </form>

            {/* Photo Attachment Picker (Only when active) */}
            {!isLocked && showAttachmentMenu && (
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
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/30 cursor-pointer"
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
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-400 hover:bg-sky-500/30 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Attach Gear Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Trade Inspector & Campus Safety Details */}
        {showRightSidebar && (
          <div className={`w-[320px] shrink-0 hidden xl:flex flex-col border-l p-6 space-y-6 overflow-y-auto ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {/* Partner Profile & Trust Card */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={match.partner.avatar}
                    alt={match.partner.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  {partnerIsOnline ? (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 font-bold text-sm text-slate-900 dark:text-white">
                    <span className="truncate">{match.partner.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-[11px] border border-amber-500/25">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{match.partner.rating ? match.partner.rating.toFixed(1) : '5.0'}</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{match.partner.trustScore}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{match.partner.completedTrades} completed trades</span>
                    <span>{match.partner.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Trade Overview
                </h3>
                {match.createdAt && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Started {match.matchedAt}
                  </span>
                )}
              </div>
              
              {/* Visual Swap comparison cards */}
              <div className="space-y-3">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Your Item (Offering)</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div
                      onClick={() => setLightboxData({ images: match.myOffering.images?.length ? match.myOffering.images : [match.myOffering.imageUrl || ''], title: match.myOffering.title, initialIndex: 0 })}
                      className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 cursor-zoom-in group/thumb relative"
                      title="Click to view uncropped photo"
                    >
                      <SafeImage src={match.myOffering.images?.[0] || match.myOffering.imageUrl} alt={match.myOffering.title} title={match.myOffering.title} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{match.myOffering.title}</div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        {match.myOffering.condition || 'Like New'}
                        {match.myOffering.usageDuration ? ` • ${match.myOffering.usageDuration}` : ''}
                      </span>
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
                    <div
                      onClick={() => setLightboxData({ images: match.theirOffering.images?.length ? match.theirOffering.images : [match.theirOffering.imageUrl || ''], title: match.theirOffering.title, initialIndex: 0 })}
                      className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 cursor-zoom-in group/thumb relative"
                      title="Click to view uncropped photo"
                    >
                      <SafeImage src={match.theirOffering.images?.[0] || match.theirOffering.imageUrl} alt={match.theirOffering.title} title={match.theirOffering.title} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{match.theirOffering.title}</div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        {match.theirOffering.condition || 'Like New'}
                        {match.theirOffering.usageDuration ? ` • ${match.theirOffering.usageDuration}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Status & Archive Panel */}
            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Trade Status</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  isFinalized 
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' 
                    : isRejected 
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' 
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {match.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Thread State</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {match.isArchived ? 'Archived' : 'Active'}
                </span>
              </div>

              {isFinalized && (
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Digital Receipt</span>
                </button>
              )}

              {onToggleArchive && (
                <button
                  onClick={() => onToggleArchive(match.id)}
                  className={`w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    match.isArchived
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                      : isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{match.isArchived ? 'Unarchive Thread' : 'Archive Thread'}</span>
                </button>
              )}
            </div>

            {/* Campus Meetup Safety Box */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <h4 className="text-xs font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                Campus Safe Exchange
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Meet during active campus hours inside designated hubs:
              </p>
              <ul className="text-xs text-slate-700 dark:text-slate-300 mt-2 space-y-1 font-medium">
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>5th Flr Library &amp; Media Hub</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>1st Flr Multipurpose Cafeteria</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>4th Flr Ram Lounge</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Click-to-Expand Uncropped Image Lightbox Modal */}
      <ImageLightboxModal
        images={lightboxData?.images || []}
        title={lightboxData?.title}
        initialIndex={lightboxData?.initialIndex || 0}
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
      />

      {/* Official Digital Trade Receipt Modal */}
      <TradeReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        theme={theme}
        receiptData={dynamicReceiptData}
      />
    </div>
  );
};
