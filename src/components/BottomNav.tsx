import React from 'react';
import { Store, PlusCircle, Handshake, MessageSquare } from 'lucide-react';
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

  const navItems = [
    {
      id: 'market' as ActiveTab,
      label: 'Market',
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
      label: 'Matches',
      icon: Handshake,
      badge: unreadMatches > 0 ? unreadMatches : null,
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Chat',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className={`fixed bottom-0 left-0 right-0 z-30 transition-colors duration-200 md:hidden ${
        isDark
          ? 'bg-[#0B132B]/95 backdrop-blur-md border-t border-slate-800 text-white'
          : 'bg-white/95 backdrop-blur-md border-t border-slate-200 text-slate-900 shadow-lg'
      }`}
    >
      <div className="max-w-md mx-auto px-4 h-18 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 min-w-[68px] transition-all active:scale-95 ${
                isActive
                  ? isDark
                    ? 'text-emerald-400 font-bold'
                    : 'text-emerald-700 font-extrabold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== null && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
