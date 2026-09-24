import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ChevronDown, 
  ChevronRight,
  XCircle, 
  Menu, 
  Info, 
  Lock, 
  Edit2, 
  Archive, 
  Clock, 
  Star, 
  Receipt, 
  Trash2, 
  Phone, 
  Video, 
  Bell, 
  BellOff, 
  User, 
  ThumbsUp, 
  X,
  Store,
  Compass,
  Handshake
} from 'lucide-react';
import { ChatMessage, TradeMatch, ThemeMode, UserProfile, ActiveTab } from '../types';
import { SafeImage } from './SafeImage';
import { ImageLightboxModal } from './ImageLightboxModal';
import { TradeReceiptModal, TradeReceiptData } from './TradeReceiptModal';

interface ChatViewProps {
  match: TradeMatch;
  allMatches: TradeMatch[];
  messages: ChatMessage[];
  theme: ThemeMode;
  currentUser?: UserProfile | null;
  unreadMatches?: number;
  onToggleTheme: () => void;
  onBack: () => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onSelectMatch: (matchId: string) => void;
  onSendMessage: (matchId: string, text: string, imageUrl?: string) => void;
  onEditMessage?: (matchId: string, messageId: string, newText: string) => void;
  onDeleteMessage?: (matchId: string, messageId: string) => void;
  onFinalizeTrade: (matchId: string) => void;
  onRejectTrade?: (matchId: string) => void;
  onToggleArchive?: (matchId: string) => void;
}

const formatRelativeTime = (timeStr?: string): string => {
  if (!timeStr) return '';
  const lower = timeStr.toLowerCase().trim();
  if (lower.includes('just now') || lower === 'now') return 'now';
  const minMatch = lower.match(/(\d+)\s*(?:m|min|mins|minute|minutes)/);
  if (minMatch) return `${minMatch[1]}m`;
  const hrMatch = lower.match(/(\d+)\s*(?:h|hr|hrs|hour|hours)/);
  if (hrMatch) return `${hrMatch[1]}h`;
  const dayMatch = lower.match(/(\d+)\s*(?:d|day|days)/);
  if (dayMatch) return `${dayMatch[1]}d`;
  if (lower.includes('yesterday')) return '1d';
  if (/^\d+[mhd]$/.test(lower)) return lower;
  return timeStr;
};

export const ChatView: React.FC<ChatViewProps> = ({
  match,
  allMatches,
  messages,
  theme,
  currentUser,
  unreadMatches = 0,
  onToggleTheme,
  onBack,
  onNavigateTab,
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
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; title: string; initialIndex: number } | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({
    trade: true,
    chatInfo: true,
    trust: false,
    media: true,
  });

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

  const toggleAccordion = (key: keyof typeof openAccordions) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const sharedMedia = useMemo(() => {
    return messages
      .filter((m) => !!m.imageUrl && !m.isDeleted)
      .map((m) => ({
        url: m.imageUrl!,
        caption: m.imageCaption || m.text || 'Trade attachment',
        timestamp: m.timestamp,
      }));
  }, [messages]);

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
    if (isLocked) return;
    if (!inputText.trim() && !selectedPhotoUrl) return;

    onSendMessage(match.id, inputText.trim(), selectedPhotoUrl || undefined);
    setInputText('');
    setSelectedPhotoUrl(null);
    setShowAttachmentMenu(false);
  };

  const handleSendThumbsUp = () => {
    if (isLocked) return;
    onSendMessage(match.id, '👍');
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
    <div className={`w-full flex-1 min-h-0 flex flex-col overflow-hidden transition-colors duration-200 px-0 sm:px-3 lg:px-5 pt-0 sm:pt-2 pb-0 sm:pb-2 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Desktop Multi-Panel Container — Facebook Messenger Desktop UI */}
      <div className={`flex-1 min-h-0 flex overflow-hidden sm:rounded-2xl border transition-all ${
        isDark 
          ? 'bg-[#0f172a] border-slate-800/80 shadow-2xl' 
          : 'bg-white border-slate-200 shadow-xl'
      }`}>
        
        {/* ========================================================= */}
        {/* 1. LEFT PANEL: Messenger Desktop Thread List              */}
        {/* ========================================================= */}
        {showLeftSidebar && (
          <div className={`w-80 xl:w-[340px] shrink-0 hidden md:flex flex-col border-r transition-colors ${
            isDark ? 'bg-[#0f172a] border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            {/* Left Panel Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                    Chats
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {allMatches.length}
                  </span>

                  {/* Clean Navigation Popover Menu Next to "Chats" Title */}
                  <div className="relative">
                    <button
                      id="btn-chats-nav-menu"
                      onClick={() => setShowNavMenu(!showNavMenu)}
                      className={`p-1.5 rounded-xl transition-all flex items-center gap-1 ${
                        showNavMenu
                          ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                          : isDark
                          ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                          : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                      }`}
                      title="Navigate Kalakalan views"
                      aria-label="Navigation Menu"
                    >
                      <Compass className="w-4 h-4" />
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showNavMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showNavMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-30" 
                          onClick={() => setShowNavMenu(false)} 
                        />
                        <div className={`absolute left-0 mt-2 w-48 rounded-2xl shadow-xl border p-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150 ${
                          isDark ? 'bg-[#0f172a] border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
                        }`}>
                          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Navigation
                          </div>

                          {/* 🏪 Market */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowNavMenu(false);
                              if (onNavigateTab) onNavigateTab('market');
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-slate-800/80 text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                              <Store className="w-3.5 h-3.5" />
                            </div>
                            <span className="flex-1 text-left font-medium">Marketplace</span>
                          </button>

                          {/* 🤝 Matches */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowNavMenu(false);
                              if (onNavigateTab) onNavigateTab('matches');
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-slate-800/80 text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                              <Handshake className="w-3.5 h-3.5" />
                            </div>
                            <span className="flex-1 text-left font-medium">Trade Matches</span>
                            {unreadMatches > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white leading-none">
                                {unreadMatches}
                              </span>
                            )}
                          </button>

                          {/* ➕ Post Item */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowNavMenu(false);
                              if (onNavigateTab) onNavigateTab('upload');
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-slate-800/80 text-slate-200 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Plus className="w-3.5 h-3.5" />
                            </div>
                            <span className="flex-1 text-left font-medium">Post Item</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Left Sidebar Toggle Button */}
                <button
                  onClick={() => setShowLeftSidebar(false)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Hide Chat List"
                  aria-label="Hide Barters Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* Rounded pill search area */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search Messenger..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={`w-full rounded-full text-sm pl-9 pr-8 py-2 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800/60 text-slate-200 placeholder:text-slate-400 focus:bg-slate-800/90 focus:ring-1 focus:ring-emerald-500/50 border border-slate-700/40'
                      : 'bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500/50 border border-slate-200'
                  }`}
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Tabs: All, Active, Archived */}
              <div className={`grid grid-cols-3 gap-1 p-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-slate-800/60' : 'bg-slate-100'
              }`}>
                {(['all', 'active', 'archived'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSidebarFilter(tab)}
                    className={`py-1.5 rounded-full capitalize transition-all ${
                      sidebarFilter === tab
                        ? isDark
                          ? 'bg-slate-700 text-white shadow-xs font-bold'
                          : 'bg-white text-slate-950 shadow-xs font-bold'
                        : 'text-slate-400 hover:text-slate-200 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Messenger-Style Conversation List Items */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
              {filteredMatches.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No {sidebarFilter !== 'all' ? sidebarFilter : ''} conversations found.
                </div>
              ) : (
                filteredMatches.map((m) => {
                  const isSelected = m.id === match.id;
                  const isMOnline = m.partner.isOnline !== undefined ? m.partner.isOnline : true;
                  const hasUnread = (m.unreadCount && m.unreadCount > 0) || false;

                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectMatch(m.id)}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors relative ${
                        isSelected
                          ? isDark
                            ? 'bg-slate-800/80 text-white'
                            : 'bg-slate-200/80 text-slate-900'
                          : isDark
                          ? 'hover:bg-slate-800/50 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {/* Circular avatar with active presence green dot */}
                      <div className="relative shrink-0">
                        <img
                          src={m.partner.avatar}
                          alt={m.partner.name}
                          className="w-12 h-12 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
                        />
                        {isMOnline ? (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f172a]" />
                        ) : (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white dark:border-[#0f172a]" />
                        )}
                      </div>

                      {/* Content: Title & Subtitle with relative timestamp */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-[14.5px] leading-tight truncate ${
                            hasUnread 
                              ? 'font-extrabold text-slate-900 dark:text-white' 
                              : isSelected
                              ? 'font-bold text-slate-900 dark:text-white'
                              : 'font-semibold text-slate-800 dark:text-slate-200'
                          }`}>
                            {m.partner.name}
                          </h4>
                          {m.status === 'Trade Finalized' ? (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300 shrink-0">
                              Finalized
                            </span>
                          ) : m.status === 'Trade Rejected' ? (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
                              Rejected
                            </span>
                          ) : null}
                        </div>

                        {/* Subtitle row with preview and relative timestamp */}
                        <div className={`text-[12.5px] flex items-center gap-1 truncate mt-0.5 ${
                          hasUnread 
                            ? 'font-semibold text-slate-900 dark:text-slate-100' 
                            : 'text-slate-400 dark:text-slate-400'
                        }`}>
                          <span className="truncate flex-1">
                            {m.lastMessage || `${m.myOffering.title} ↔ ${m.theirOffering.title}`}
                          </span>
                          <span className="shrink-0 text-slate-400 dark:text-slate-400 text-[11px]">
                            • {formatRelativeTime(m.matchedAt || m.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Unread blue circle badge */}
                      {hasUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow-xs" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. CENTER PANEL: Deep Slate Chat Canvas & Bubbles        */}
        {/* ========================================================= */}
        <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden min-w-0 bg-transparent relative">
          
          {/* Header: Minimalist bar with partner info and quick action buttons */}
          <div className={`flex-none h-[56px] px-3 sm:px-6 border-b flex items-center justify-between gap-2 z-10 transition-colors ${
            isDark 
              ? 'bg-[#0f172a]/95 backdrop-blur-md border-slate-800/80' 
              : 'bg-white/95 backdrop-blur-md border-slate-200'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              {/* Back button on mobile */}
              <button
                onClick={onBack}
                className={`p-1.5 -ml-1 rounded-full transition-colors md:hidden ${
                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
                aria-label="Back to matches"
                title="Back to matches"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Show barters sidebar button (when hidden on desktop) */}
              {!showLeftSidebar && (
                <button
                  onClick={() => setShowLeftSidebar(true)}
                  className={`p-1.5 rounded-full transition-colors hidden md:flex items-center justify-center shrink-0 ${
                    isDark
                      ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Show Conversation List"
                  aria-label="Show Barters Sidebar"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}

              {/* Circular Avatar with Active Presence */}
              <div className="relative shrink-0">
                <img
                  src={match.partner.avatar}
                  alt={match.partner.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
                />
                {partnerIsOnline ? (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f172a]" />
                ) : (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-slate-400 border-2 border-white dark:border-[#0f172a]" />
                )}
              </div>

              {/* Name & Active Status Pill */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[15px] leading-tight truncate text-slate-900 dark:text-white">
                    {match.partner.name}
                  </h3>
                  <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400" title="Verified Trader">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>
                
                {/* Active Status Pill */}
                <div className="text-[11px] flex items-center gap-1.5 truncate mt-0.5">
                  {partnerIsOnline ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Active now
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                      {match.partner.lastActive || 'Offline'}
                    </span>
                  )}
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-500 font-semibold">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                    <span>{match.partner.rating ? match.partner.rating.toFixed(1) : '5.0'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons (Far Right): Voice, Video, Trade Dropdown, Archive, Details */}
            <div className="flex items-center gap-1">
              {/* Voice Call Button */}
              <button
                type="button"
                className={`p-2 rounded-full transition-colors hidden sm:flex items-center justify-center ${
                  isDark 
                    ? 'text-emerald-400 hover:bg-slate-800' 
                    : 'text-emerald-600 hover:bg-slate-100'
                }`}
                title="Start voice call"
                aria-label="Start voice call"
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* Video Call Button */}
              <button
                type="button"
                className={`p-2 rounded-full transition-colors hidden sm:flex items-center justify-center ${
                  isDark 
                    ? 'text-emerald-400 hover:bg-slate-800' 
                    : 'text-emerald-600 hover:bg-slate-100'
                }`}
                title="Start video call"
                aria-label="Start video call"
              >
                <Video className="w-4 h-4" />
              </button>

              {/* Finalize / Reject Trade Action or Receipt */}
              <div className="relative">
                {isFinalized ? (
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                    title="View Digital Trade Receipt"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                ) : isRejected ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejected</span>
                  </span>
                ) : (
                  <button
                    id="btn-header-finalize"
                    onClick={() => setShowTradeDropdown(!showTradeDropdown)}
                    className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
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
                      isDark ? 'bg-[#0f172a] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
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

              {/* Archive Toggle Button */}
              {onToggleArchive && (
                <button
                  onClick={() => onToggleArchive(match.id)}
                  className={`p-2 rounded-full transition-colors ${
                    match.isArchived
                      ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                      : isDark
                      ? 'text-slate-400 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title={match.isArchived ? "Unarchive thread" : "Archive thread"}
                  aria-label="Toggle archive"
                >
                  <Archive className="w-4 h-4" />
                </button>
              )}

              {/* Right Sidebar Accordion Toggle Button */}
              <button
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className={`p-2 rounded-full transition-colors hidden xl:flex items-center justify-center shrink-0 ${
                  showRightSidebar
                    ? isDark
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-emerald-600 bg-emerald-50'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
                title={showRightSidebar ? "Hide Details" : "Show Details"}
                aria-label="Toggle details sidebar"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barter Context Banner */}
          <div className={`flex-none px-4 py-2 border-b flex items-center justify-between text-xs gap-2 ${
            isDark 
              ? 'bg-slate-900/95 border-slate-800/80 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="font-bold truncate text-slate-900 dark:text-white max-w-[200px]">
                {match.myOffering.title}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] shrink-0 border border-emerald-500/20">
                <ArrowRightLeft className="w-2.5 h-2.5" />
                <span>Barter</span>
              </span>
              <span className="font-bold truncate text-slate-900 dark:text-white max-w-[200px]">
                {match.theirOffering.title}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 shrink-0 capitalize hidden sm:inline">
              {match.status}
            </span>
          </div>

          {/* Messages Stream Scroll Area — Kalakalan native midnight blue bg-[#0a0f1d] */}
          <div className={`flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 ${
            isDark 
              ? 'bg-[#0a0f1d] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent' 
              : 'bg-slate-50/50'
          }`}>
            <div className="max-w-3xl mx-auto w-full">
              {messages.map((msg, idx) => {
                // System Event Message Rendering
                if (msg.isSystemEvent || msg.senderId === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-3">
                      <div className="max-w-[90%] px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 flex items-center gap-2 border border-slate-700/60 text-center shadow-xs">
                        {msg.systemEventType === 'trade_finalized' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        ) : msg.systemEventType === 'trade_rejected' ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span className="truncate">
                          {msg.text || (msg.systemEventType === 'initiated' ? 'Trade negotiation initiated' : 'System update')}
                        </span>
                        {msg.systemEventType === 'trade_finalized' && (
                          <button
                            type="button"
                            onClick={() => setShowReceiptModal(true)}
                            className="text-xs font-bold text-purple-400 hover:underline cursor-pointer shrink-0 ml-1"
                          >
                            Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                const isMe = msg.senderId === 'user-me' || msg.senderId === 'me' || msg.senderId === 'current-user' || msg.senderId !== match.partner.id;
                const isEditingThis = editingMessageId === msg.id;

                // Messenger grouping: collapse avatar & timestamp inside same-sender runs
                const prev = messages[idx - 1];
                const next = messages[idx + 1];
                const prevIsSame = !!prev && !prev.isSystemEvent && prev.senderId !== 'system' && (prev.senderId === msg.senderId || ((prev.senderId !== match.partner.id) === isMe));
                const nextIsSame = !!next && !next.isSystemEvent && next.senderId !== 'system' && (next.senderId === msg.senderId || ((next.senderId !== match.partner.id) === isMe));
                const isFirstInGroup = !prevIsSame;
                const isLastInGroup = !nextIsSame;

                return (
                  <div
                    key={msg.id}
                    className={`group flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-3.5' : 'mt-1'}`}
                  >
                    {/* Partner avatar beside bubble (last in group run) */}
                    {!isMe ? (
                      isLastInGroup ? (
                        <img
                          src={msg.senderAvatar || match.partner.avatar}
                          alt={msg.senderName || match.partner.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-black/5 dark:ring-white/10 mb-0.5"
                        />
                      ) : (
                        <div className="w-7 shrink-0" />
                      )
                    ) : null}

                    {/* Message Bubble Column */}
                    <div className={`flex flex-col min-w-0 max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender Name on first in group for partner */}
                      {!isMe && isFirstInGroup && (
                        <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium px-3 mb-1 truncate max-w-full">
                          {msg.senderName || match.partner.name}
                        </span>
                      )}

                      {/* Message Bubble / Inline Editor */}
                      {isEditingThis ? (
                        <div className={`px-3 py-2 rounded-2xl border w-full ${
                          isDark ? 'bg-slate-800 border-emerald-500' : 'bg-white border-emerald-600 shadow-md'
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
                            className="w-full text-sm bg-transparent outline-none text-slate-900 dark:text-white"
                          />
                          <div className="flex items-center justify-end gap-1.5 pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-2 py-0.5 rounded text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(msg.id)}
                              className="px-3 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`relative group/bubble flex items-center gap-1 min-w-0 max-w-full ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Hover edit & delete actions for own messages */}
                          {isMe && !isLocked && !msg.isDeleted && (
                            <div className="opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center shrink-0">
                              {onEditMessage && (
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(msg)}
                                  className="p-1 rounded-full transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                                  title="Edit message"
                                  aria-label="Edit message"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete(msg.id)}
                                className="p-1 rounded-full transition-colors text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                                title="Delete message"
                                aria-label="Delete message"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Bubble: Inactive bubbles use bg-slate-800/90 text-slate-100, outgoing uses bg-emerald-600 */}
                          <div className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-xs min-w-0 break-words [overflow-wrap:anywhere] overflow-hidden ${
                            msg.isDeleted
                              ? isDark
                                ? 'bg-slate-800/60 text-slate-400 border border-slate-700/40 rounded-2xl italic'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl italic'
                              : isMe
                              ? 'bg-emerald-600 text-white rounded-2xl sm:rounded-3xl'
                              : isDark
                              ? 'bg-slate-800/90 text-slate-100 border border-slate-700/40 rounded-2xl sm:rounded-3xl'
                              : 'bg-slate-200 text-slate-900 rounded-2xl sm:rounded-3xl'
                          }`}>
                            {msg.isDeleted ? (
                              <p className="text-sm select-none">This message was deleted.</p>
                            ) : (
                              <>
                                {msg.text && (
                                  <p className="whitespace-pre-wrap">{msg.text}</p>
                                )}

                                {msg.imageUrl && (
                                  <div
                                    onClick={() => setLightboxData({ 
                                      images: [msg.imageUrl!], 
                                      title: msg.imageCaption || 'Trade attachment', 
                                      initialIndex: 0 
                                    })}
                                    className="rounded-xl overflow-hidden mt-1.5 border border-black/10 dark:border-white/10 cursor-zoom-in group/img relative"
                                    title="Click to view full photo"
                                  >
                                    <img
                                      src={msg.imageUrl}
                                      alt="Trade item preview"
                                      className="w-full max-h-48 object-cover group-hover/img:scale-105 transition-transform duration-200"
                                    />
                                    {msg.imageCaption && (
                                      <div className="p-1.5 bg-black/60 text-[11px] text-white">
                                        {msg.imageCaption}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timestamp Footnote on last message in run */}
                      {isLastInGroup && !isEditingThis && (
                        <div className={`text-[10px] text-slate-400 dark:text-slate-400 px-3 mt-1 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {msg.isEdited && !msg.isDeleted && <span className="italic">Edited •</span>}
                          <span title={`Sent at: ${msg.createdAt || msg.timestamp}`}>{msg.timestamp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Replies Suggestions Bar */}
          {!isLocked && (
            <div className={`flex-none border-t ${
              isDark ? 'bg-[#0f172a] border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setShowQuickReplies((v) => !v)}
                className="w-full flex items-center justify-center gap-1 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>{showQuickReplies ? 'Hide suggestions' : 'Show suggestions'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showQuickReplies ? 'rotate-180' : ''}`} />
              </button>
              {showQuickReplies && (
                <div className="px-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 shrink-0">Quick reply:</span>
                  {[
                    '📍 Meet at APC Cafeteria 2 PM',
                    '🔍 Confirm working condition',
                    '🤝 Ready to finalize trade',
                    '📸 Can you send a close-up photo?'
                  ].map((text) => (
                    <button
                      key={text}
                      onClick={() => handleQuickReply(text)}
                      className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 shrink-0 ${
                        isDark 
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-white' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Locked Status Banner (When Finalized or Rejected) */}
          {isLocked && (
            <div className="flex-none px-3 py-1.5">
              {isFinalized ? (
                <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="truncate flex-1">Trade finalized — messaging disabled.</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate flex-1">Trade rejected — messaging closed.</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. BOTTOM COMPOSER DOCK: Facebook Messenger Bottom Dock  */}
          {/* ========================================================= */}
          <div className={`flex-none px-3 py-2.5 sm:px-4 border-t transition-colors ${
            isDark ? 'bg-[#0f172a] border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            <form onSubmit={handleSend} className="flex items-center gap-2 max-w-3xl mx-auto w-full">
              {/* Left utility buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => !isLocked && setShowAttachmentMenu(!showAttachmentMenu)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isLocked
                      ? 'opacity-40 cursor-not-allowed text-slate-500'
                      : showAttachmentMenu
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isLocked ? "Messaging locked" : "More actions"}
                >
                  <Plus className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    setSelectedPhotoUrl('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80');
                    setInputText((t) => t || 'Here is the condition photo of the item.');
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isLocked
                      ? 'opacity-40 cursor-not-allowed text-slate-500'
                      : 'text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Attach camera photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    setSelectedPhotoUrl('https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&auto=format&fit=crop&q=80');
                    setInputText((t) => t || 'Attaching photo of the hardware status.');
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isLocked
                      ? 'opacity-40 cursor-not-allowed text-slate-500'
                      : 'text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Attach gear photo"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Capsule text input */}
              <div className="flex-1 min-w-0 relative">
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
                  className={`w-full rounded-full text-sm px-4 py-2 focus:outline-none transition-all ${
                    isLocked
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed placeholder:text-slate-500'
                      : isDark
                      ? 'bg-slate-800/60 text-slate-200 placeholder:text-slate-400 border border-slate-700/50 focus:border-emerald-500/50 focus:bg-slate-800'
                      : 'bg-slate-100 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-emerald-500/50 focus:bg-white'
                  }`}
                />
              </div>

              {/* Right side: Send / Thumbs up button */}
              <div className="shrink-0 flex items-center">
                {inputText.trim() || selectedPhotoUrl ? (
                  <button
                    id="btn-send-chat"
                    type="submit"
                    disabled={isLocked}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all shadow-sm cursor-pointer"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={handleSendThumbsUp}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isLocked
                        ? 'opacity-40 cursor-not-allowed text-slate-500'
                        : 'text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 cursor-pointer'
                    }`}
                    title="Send thumbs up"
                    aria-label="Send thumbs up"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Photo Attachment Selection Pill */}
            {selectedPhotoUrl && (
              <div className="mt-2 max-w-3xl mx-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Photo attached:</span>
                <span className="truncate flex-1 text-slate-600 dark:text-slate-300">{selectedPhotoUrl}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoUrl(null)}
                  className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. RIGHT PANEL: Messenger Accordion in Native Slate      */}
        {/* ========================================================= */}
        {showRightSidebar && (
          <div className={`w-[320px] xl:w-[340px] shrink-0 hidden xl:flex flex-col border-l overflow-y-auto transition-colors ${
            isDark ? 'bg-[#0f172a] border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            {/* Top Header: Partner details and quick actions */}
            <div className="p-6 flex flex-col items-center text-center border-b border-slate-200 dark:border-slate-800/80">
              <div className="relative mb-3">
                <img
                  src={match.partner.avatar}
                  alt={match.partner.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
                />
                {partnerIsOnline ? (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f172a]" />
                ) : (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-slate-400 border-2 border-white dark:border-[#0f172a]" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {match.partner.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                {partnerIsOnline ? 'Active now' : match.partner.lastActive || 'Offline'}
              </p>

              {/* Circular quick-action buttons */}
              <div className="flex items-center justify-center gap-6 mt-4 w-full">
                {/* View Profile */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isDark 
                        ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="View Profile"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400">Profile</span>
                </div>

                {/* Mute Notifications */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isMuted
                        ? 'bg-rose-500/20 text-rose-500'
                        : isDark
                        ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={isMuted ? "Unmute notifications" : "Mute notifications"}
                  >
                    {isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400">
                    {isMuted ? 'Muted' : 'Mute'}
                  </span>
                </div>

                {/* Search in Conversation */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('input-chat-message') as HTMLInputElement;
                      input?.focus();
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isDark 
                        ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Search in Chat"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400">Search</span>
                </div>
              </div>
            </div>

            {/* Accordion List Container */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
              
              {/* Accordion 1: Trade Overview */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('trade')}
                  className="w-full px-5 py-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Trade Overview</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openAccordions.trade ? 'rotate-180' : ''
                  }`} />
                </button>

                {openAccordions.trade && (
                  <div className="px-5 pb-4 space-y-3 animate-in fade-in duration-150">
                    {/* Item offering vs receiving */}
                    <div className="space-y-2.5">
                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                          Your Offering
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div
                            onClick={() => setLightboxData({ 
                              images: match.myOffering.images?.length ? match.myOffering.images : [match.myOffering.imageUrl || ''], 
                              title: match.myOffering.title, 
                              initialIndex: 0 
                            })}
                            className="w-11 h-11 rounded-lg overflow-hidden bg-slate-700 shrink-0 cursor-zoom-in group/thumb"
                            title="Click to zoom"
                          >
                            <SafeImage 
                              src={match.myOffering.images?.[0] || match.myOffering.imageUrl} 
                              alt={match.myOffering.title} 
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" 
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate text-slate-900 dark:text-white">
                              {match.myOffering.title}
                            </div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              {match.myOffering.condition || 'Good'}
                              {match.myOffering.usageDuration ? ` • ${match.myOffering.usageDuration}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                          Their Offering
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div
                            onClick={() => setLightboxData({ 
                              images: match.theirOffering.images?.length ? match.theirOffering.images : [match.theirOffering.imageUrl || ''], 
                              title: match.theirOffering.title, 
                              initialIndex: 0 
                            })}
                            className="w-11 h-11 rounded-lg overflow-hidden bg-slate-700 shrink-0 cursor-zoom-in group/thumb"
                            title="Click to zoom"
                          >
                            <SafeImage 
                              src={match.theirOffering.images?.[0] || match.theirOffering.imageUrl} 
                              alt={match.theirOffering.title} 
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" 
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate text-slate-900 dark:text-white">
                              {match.theirOffering.title}
                            </div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              {match.theirOffering.condition || 'Good'}
                              {match.theirOffering.usageDuration ? ` • ${match.theirOffering.usageDuration}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trade Status Badge */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400 dark:text-slate-400 font-medium">Status</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        isFinalized
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                          : isRejected
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {match.status}
                      </span>
                    </div>

                    {isFinalized && (
                      <button
                        onClick={() => setShowReceiptModal(true)}
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Digital Receipt</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Chat Info */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('chatInfo')}
                  className="w-full px-5 py-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    <span>Chat Info</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openAccordions.chatInfo ? 'rotate-180' : ''
                  }`} />
                </button>

                {openAccordions.chatInfo && (
                  <div className="px-5 pb-4 space-y-2 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between py-1">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> Matched:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{match.matchedAt}</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Archive className="w-3.5 h-3.5" /> Thread State:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {match.isArchived ? 'Archived' : 'Active'}
                      </span>
                    </div>

                    {onToggleArchive && (
                      <button
                        onClick={() => onToggleArchive(match.id)}
                        className={`w-full mt-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          match.isArchived
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                            : isDark
                            ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>{match.isArchived ? 'Unarchive Thread' : 'Archive Thread'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 3: Barter Details & Trust Score */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('trust')}
                  className="w-full px-5 py-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Barter Details &amp; Trust Score</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openAccordions.trust ? 'rotate-180' : ''
                  }`} />
                </button>

                {openAccordions.trust && (
                  <div className="px-5 pb-4 space-y-3 text-xs animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] text-slate-400 block font-medium">Rating</span>
                        <span className="font-extrabold text-amber-500 flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {match.partner.rating ? match.partner.rating.toFixed(1) : '5.0'} / 5.0
                        </span>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] text-slate-400 block font-medium">Completed Trades</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                          {match.partner.completedTrades} trades
                        </span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Campus Safe Exchange Hubs
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        Recommended meetup hubs inside Asia Pacific College:
                      </p>
                      <ul className="mt-2 space-y-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        <li>• 1st Floor APC Cafeteria</li>
                        <li>• 5th Floor Library Media Hub</li>
                        <li>• 4th Floor Ram Lounge</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Shared Media & Links */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => toggleAccordion('media')}
                  className="w-full px-5 py-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                    <span>Shared Media &amp; Links</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {sharedMedia.length > 0 && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {sharedMedia.length}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openAccordions.media ? 'rotate-180' : ''
                    }`} />
                  </div>
                </button>

                {openAccordions.media && (
                  <div className="px-5 pb-4 animate-in fade-in duration-150">
                    {sharedMedia.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-400">
                        No photos shared in this conversation yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5">
                        {sharedMedia.map((m, idx) => (
                          <div
                            key={idx}
                            onClick={() => setLightboxData({
                              images: sharedMedia.map((sm) => sm.url),
                              title: m.caption,
                              initialIndex: idx,
                            })}
                            className="aspect-square rounded-lg overflow-hidden bg-slate-800/80 cursor-zoom-in group/media relative border border-slate-700/50"
                            title={m.caption}
                          >
                            <img
                              src={m.url}
                              alt={m.caption}
                              className="w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

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
