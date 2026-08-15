import React from 'react';
import { 
  X, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  MapPin, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Heart, 
  MessageCircle,
  LogIn,
  UserPlus,
  LogOut,
  Users,
  Mail,
  CreditCard
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../data/mockData';
import { ThemeMode, ItemCategory, UserProfile } from '../types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onSelectAccount: (user: UserProfile) => void;
  isCyberMode: boolean;
  onToggleCyberMode: () => void;
  onSelectCategory: (cat: ItemCategory) => void;
  selectedCategory: ItemCategory;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  theme,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onSelectAccount,
  isCyberMode,
  onToggleCyberMode,
  onSelectCategory,
  selectedCategory,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide Drawer */}
      <div className={`fixed inset-y-0 left-0 max-w-[320px] w-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out ${
        isDark ? 'bg-[#0B132B] text-slate-100 border-r border-slate-800' : 'bg-white text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-4 flex items-center justify-between border-b ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Kalakalan
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
              v1.2
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile / Auth Section */}
        {currentUser ? (
          <div className={`p-4 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/60'}`}>
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold truncate">{currentUser.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  {currentUser.trustScore}
                </div>
                {currentUser.email && (
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {currentUser.email}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{currentUser.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800 text-center">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-white'} border border-slate-200/30 dark:border-slate-800`}>
                <div className="text-xs text-slate-400">Completed Trades</div>
                <div className="text-base font-bold text-emerald-500">{currentUser.completedTrades}</div>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-white'} border border-slate-200/30 dark:border-slate-800`}>
                <div className="text-xs text-slate-400">Trader Rating</div>
                <div className="text-base font-bold text-amber-500">★ {currentUser.rating}</div>
              </div>
            </div>

            {/* Switch Account or Log Out Actions */}
            <div className="flex items-center gap-2 mt-3 pt-2">
              <button
                onClick={() => {
                  onOpenAuthModal('login');
                  onClose();
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Switch User
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-colors ${
                  isDark 
                    ? 'bg-rose-950/30 border-rose-800/50 text-rose-300 hover:bg-rose-900/50' 
                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Logged out state in Drawer */
          <div className={`p-4 border-b space-y-3 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/60'}`}>
            <div className="text-center">
              <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <LogIn className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold">Welcome to Kalakalan</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sign in to post barter listings, send trade proposals, and message fellow students.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenAuthModal('login');
                  onClose();
                }}
                className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => {
                  onOpenAuthModal('signup');
                  onClose();
                }}
                className={`w-full py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Demo Profile Switcher */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
              <span>Demo Accounts</span>
              <span className="text-[10px] text-emerald-500 font-normal">Quick Switch</span>
            </h4>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      onSelectAccount(acc);
                      onClose();
                    }}
                    className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isCurrent
                        ? isDark 
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white' 
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : isDark
                        ? 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={acc.avatar} alt={acc.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate leading-tight flex items-center gap-1">
                          {acc.name}
                          {isCurrent && <span className="text-[9px] px-1 rounded bg-emerald-500 text-slate-950 font-extrabold">YOU</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{acc.location}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-500 shrink-0">
                      ★ {acc.rating}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marketplace Mode Switch */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Marketplace Mode
            </h4>
            <button
              onClick={() => {
                onToggleCyberMode();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${
                isCyberMode
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`w-4 h-4 ${isCyberMode ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="font-medium">
                  {isCyberMode ? 'Cyber Asset Exchange' : 'Campus Barter Hub'}
                </span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                isCyberMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {isCyberMode ? 'Active' : 'Switch'}
              </span>
            </button>
          </div>

          {/* Barter Value Tiers Guide */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Barter Tier Guide
            </h4>
            <div className={`p-3 rounded-xl border space-y-2.5 text-xs ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  Tier 1
                </span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Small Items</div>
                  <div className="text-[11px] text-slate-400">Books, stationery, plants, small tools.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                  Tier 2
                </span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Medium Items</div>
                  <div className="text-[11px] text-slate-400">Electronics, cameras, keyboards, audio gear.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                  Tier 3
                </span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">High Value</div>
                  <div className="text-[11px] text-slate-400">Laptops, premium tablets, electric scooters.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center text-xs text-slate-400 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          Kalakalan Fair Barter Community &copy; 2026
        </div>
      </div>
    </div>
  );
};
