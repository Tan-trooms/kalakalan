import React from 'react';
import { Menu, Moon, Sun, Search, Sparkles, User, LogIn, Store, PlusCircle, Handshake, MessageSquare, Plus } from 'lucide-react';
import { ActiveTab, ThemeMode, UserProfile } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  activeTab?: ActiveTab;
  onChangeTab?: (tab: ActiveTab) => void;
  currentUser?: UserProfile | null;
  unreadMatches?: number;
  unreadMessages?: number;
  onToggleTheme: () => void;
  onOpenDrawer: () => void;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  isCyberMode?: boolean;
  onToggleCyberMode?: () => void;
  showSearchModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  activeTab = 'market',
  onChangeTab,
  currentUser,
  unreadMatches = 0,
  unreadMessages = 0,
  onToggleTheme,
  onOpenDrawer,
  onOpenAuthModal,
  isCyberMode,
  onToggleCyberMode,
}) => {
  const isDark = theme === 'dark';

  const navItems = [
    {
      id: 'market' as ActiveTab,
      label: 'Marketplace',
      icon: Store,
      badge: null,
    },
    {
      id: 'upload' as ActiveTab,
      label: 'Post Item',
      icon: PlusCircle,
      badge: null,
    },
    {
      id: 'matches' as ActiveTab,
      label: 'Trade Matches',
      icon: Handshake,
      badge: unreadMatches > 0 ? unreadMatches : null,
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  return (
    <header className={`sticky top-0 z-30 w-full transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800/80 text-white' 
        : 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Name & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            id="btn-header-drawer"
            onClick={onOpenDrawer}
            className={`p-2 -ml-2 rounded-xl transition-colors md:hidden ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo & Name */}
          <div 
            onClick={() => onChangeTab && onChangeTab('market')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-bold tracking-tight ${
                  isCyberMode
                    ? 'text-emerald-400 font-mono tracking-wider'
                    : isDark
                    ? 'text-white'
                    : 'text-slate-900'
                }`}>
                  Kalakalan
                </span>
                {isCyberMode ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    CYBER
                  </span>
                ) : (
                  <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Campus Barter
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on mobile, visible on md+) */}
        {onChangeTab && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => onChangeTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? isDark
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-white text-emerald-900 shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? 'bg-slate-950 text-white' 
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Actions: Post Action Button, Theme Toggle, Cyber Mode & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Item Quick Button for Desktop */}
          {onChangeTab && activeTab !== 'upload' && (
            <button
              onClick={() => onChangeTab('upload')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm hover:shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post Barter</span>
            </button>
          )}

          {onToggleCyberMode && (
            <button
              id="btn-toggle-cyber"
              onClick={onToggleCyberMode}
              title={isCyberMode ? "Switch to Campus Barter" : "Switch to Cyber Marketplace"}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-medium ${
                isCyberMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : isDark
                  ? 'text-slate-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden xl:inline">{isCyberMode ? 'Cyber Deck' : 'Campus'}</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-colors ${
              isDark 
                ? 'text-slate-300 hover:bg-slate-800' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* User Profile Avatar / Sign In */}
          {currentUser ? (
            <button
              id="btn-header-profile"
              onClick={onOpenDrawer}
              title={`Logged in as ${currentUser.name}`}
              className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border transition-all active:scale-95 ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50' 
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-500/50'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight truncate max-w-[100px]">{currentUser.name}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-none">
                  {currentUser.trustScore}
                </span>
              </div>
            </button>
          ) : (
            <button
              id="btn-header-login"
              onClick={() => onOpenAuthModal('login')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

