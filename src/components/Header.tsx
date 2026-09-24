import React from 'react';
import { Menu, Moon, Sun, LogIn, Plus } from 'lucide-react';
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
}) => {
  const isDark = theme === 'dark';

  void unreadMatches;
  void unreadMessages;

  return (
    <header className={`sticky top-0 z-30 w-full transition-colors duration-200 ${
      isDark 
        ? 'bg-[#242526]/95 backdrop-blur-md border-b border-slate-800/80 text-white shadow-sm' 
        : 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Mobile-first utility bar: nav lives at the bottom, so top stays calm + airy */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Name & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu */}
          <button
            id="btn-header-drawer"
            onClick={onOpenDrawer}
            className={`p-2 -ml-1 rounded-full transition-colors md:hidden ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo & Name (Routes back to Market feed) */}
          <button 
            type="button"
            id="btn-header-logo"
            onClick={() => onChangeTab && onChangeTab('market')}
            className="flex items-center gap-2.5 cursor-pointer group text-left border-0 bg-transparent p-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
            title="Go to Marketplace feed"
            aria-label="Kalakalan APC Barter - Go to Marketplace"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-base shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              K
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold tracking-tight group-hover:text-emerald-500 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Kalakalan
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  APC Barter
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right Actions: Post Action Button, Theme Toggle & User Profile */}
        <div className="flex items-center gap-2">
          {/* Post shortcut stays up top only as a subtle action — primary nav is the bottom dock */}
          {onChangeTab && activeTab !== 'upload' && (
            <button
              onClick={() => onChangeTab('upload')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            className={`p-2.5 rounded-full transition-colors ${
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
              className={`flex items-center gap-2 p-1 pl-1 pr-3 rounded-full border transition-all active:scale-95 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' 
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-500/50 shadow-sm'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold leading-tight truncate max-w-[120px] text-slate-900 dark:text-white">{currentUser.name}</span>
              </div>
            </button>
          ) : (
            <button
              id="btn-header-login"
              onClick={() => onOpenAuthModal('login')}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-all shadow-sm"
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

