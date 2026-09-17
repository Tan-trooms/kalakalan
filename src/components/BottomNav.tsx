import React from 'react';
import { Store, Plus, Handshake, MessageSquare } from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  unreadMatches?: number;
  unreadMessages?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  theme,
  unreadMatches = 1,
  unreadMessages = 2,
}) => {
  const isDark = theme === 'dark';

  const sideItems = [
    {
      id: 'market' as ActiveTab,
      label: 'Market',
      icon: Store,
      badge: null as number | null,
    },
    {
      id: 'matches' as ActiveTab,
      label: 'Matches',
      icon: Handshake,
      badge: unreadMatches > 0 ? unreadMatches : null,
    },
  ];

  const rightItems = [
    {
      id: 'chat' as ActiveTab,
      label: 'Chat',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  const isPostActive = activeTab === 'upload';

  const renderSideButton = (item: (typeof sideItems)[number]) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        id={`nav-tab-${item.id}`}
        onClick={() => onChangeTab(item.id)}
        className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 relative py-2 sm:py-2.5 px-3 sm:px-5 min-w-[68px] sm:min-w-0 rounded-2xl sm:rounded-full transition-all active:scale-95 ${
          isActive
            ? isDark
              ? 'text-emerald-300 sm:bg-emerald-500/15 font-semibold'
              : 'text-emerald-700 sm:bg-emerald-100 font-semibold'
            : isDark
            ? 'text-slate-400 hover:text-slate-100 sm:hover:bg-slate-800'
            : 'text-slate-500 hover:text-slate-900 sm:hover:bg-slate-100'
        }`}
      >
        <span className="relative">
          <Icon className={`w-[22px] h-[22px] sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
          {item.badge !== null && (
            <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.5 rounded-full text-[10px] leading-none font-bold bg-emerald-600 text-white shadow-sm min-w-[18px] text-center">
              {item.badge}
            </span>
          )}
        </span>
        <span className={`text-[11px] sm:text-sm tracking-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
          {item.label}
        </span>
        {/* Mobile active pill */}
        {isActive && (
          <span className="sm:hidden w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
        )}
      </button>
    );
  };

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Primary"
      className="fixed z-40 inset-x-0 bottom-0 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-5 pb-[env(safe-area-inset-bottom)] sm:pb-0"
    >
      {/* Mobile: full-width bar. Desktop: floating dock — lots of air around it. */}
      <div
        className={`mx-auto flex items-stretch justify-around sm:justify-center sm:gap-1 px-4 sm:px-2.5 py-1.5 sm:py-1.5 w-full sm:w-auto sm:rounded-full sm:border transition-colors duration-200 ${
          isDark
            ? 'bg-[#242526]/95 backdrop-blur-md border-t sm:border-slate-700/80 border-slate-800 text-white sm:shadow-2xl'
            : 'bg-white/95 backdrop-blur-md border-t sm:border-slate-200 border-slate-200 text-slate-900 shadow-[0_-1px_12px_rgba(0,0,0,0.06)] sm:shadow-2xl'
        }`}
      >
        <div className="flex items-stretch justify-around flex-1 sm:flex-none sm:gap-1">
          {sideItems.map(renderSideButton)}
        </div>

        {/* Center Post — the mobile-first hero action */}
        <button
          id="nav-tab-upload"
          onClick={() => onChangeTab('upload')}
          aria-label="Post an item"
          className={`mx-1 sm:mx-1.5 self-center flex items-center gap-2 rounded-full px-5 sm:px-6 h-11 sm:h-11 shrink-0 font-semibold text-sm transition-all active:scale-95 shadow-lg ${
            isPostActive
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.75]" />
          <span className="sm:inline">Post</span>
        </button>

        <div className="flex items-stretch justify-around flex-1 sm:flex-none sm:gap-1">
          {rightItems.map(renderSideButton)}
          {/* Desktop-only extra breathing: profile hint is up top, so keep dock to 4 actions */}
        </div>
      </div>
    </nav>
  );
};
