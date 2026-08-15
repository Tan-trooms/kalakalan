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
      label: 'Upload',
      icon: PlusCircle,
      isPillStyle: isDark,
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
          ? 'bg-[#0B132B] border-t border-slate-800'
          : 'bg-white/95 backdrop-blur-md border-t border-slate-100'
      }`}
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          // Special treatment for Upload tab in dark mode or active state
          if (item.id === 'upload' && isDark) {
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onChangeTab(item.id)}
                className="flex flex-col items-center justify-center relative py-1 px-3 transition-transform active:scale-95"
              >
                <div className={`px-4 py-1 rounded-full flex flex-col items-center ${
                  isActive ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-emerald-400'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 min-w-[64px] transition-colors active:scale-95 ${
                isActive
                  ? isDark
                    ? 'text-emerald-400 font-medium'
                    : 'text-emerald-700 font-semibold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {item.badge !== null && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className={`w-1 h-1 rounded-full mt-0.5 ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
