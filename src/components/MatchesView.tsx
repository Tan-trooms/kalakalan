import React, { useState } from 'react';
import { Handshake, Clock, ArrowRightLeft, ArrowRight, MessageSquare, CheckCircle2, User, Sparkles, ShieldCheck, Filter } from 'lucide-react';
import { TradeMatch, ThemeMode, ValueTier } from '../types';
import { SafeImage } from './SafeImage';

interface MatchesViewProps {
  matches: TradeMatch[];
  theme: ThemeMode;
  onOpenChat: (matchId: string) => void;
  onCancelMatch?: (matchId: string) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  theme,
  onOpenChat,
  onCancelMatch,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'pending' | 'finalized'>('all');
  const isDark = theme === 'dark';

  const readyMatches = matches.filter((m) => m.status === 'Ready to Trade');
  const pendingMatches = matches.filter((m) => m.status === 'Pending Response');
  const finalizedMatches = matches.filter((m) => m.status === 'Trade Finalized');

  const displayedMatches = matches.filter((m) => {
    if (filterTab === 'ready') return m.status === 'Ready to Trade';
    if (filterTab === 'pending') return m.status === 'Pending Response';
    if (filterTab === 'finalized') return m.status === 'Trade Finalized';
    return true;
  });

  const renderTierPill = (tier: ValueTier) => {
    const color = tier === 1 ? 'bg-emerald-600' : tier === 2 ? 'bg-sky-600' : 'bg-indigo-600';
    return (
      <span className={`px-2 py-0.5 rounded-md ${color} text-white font-bold text-[10px] shadow-xs`}>
        Tier {tier}
      </span>
    );
  };

  return (
    <div className={`pb-28 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Title Header */}
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Trade Matches
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
            Manage your active barter pairings and message campus traders.
          </p>
        </div>

        {/* Minimal Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Matches</div>
            <div className="text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">{matches.length}</div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Ready to Trade</div>
            <div className="text-3xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">{readyMatches.length}</div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pending Review</div>
            <div className="text-3xl font-extrabold mt-1 text-amber-500">{pendingMatches.length}</div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">APC Student Security</div>
            <div className="text-sm font-bold mt-2 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Verified Rams
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Matches', count: matches.length },
            { id: 'ready', label: 'Ready to Trade', count: readyMatches.length },
            { id: 'pending', label: 'Pending Response', count: pendingMatches.length },
            { id: 'finalized', label: 'Finalized Trades', count: finalizedMatches.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
                filterTab === tab.id
                  ? isDark
                    ? 'bg-emerald-500 text-slate-950 shadow-xs font-extrabold'
                    : 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                filterTab === tab.id ? 'bg-black/20 text-current' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Matches */}
      {displayedMatches.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Handshake className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No matches found in this category</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse the marketplace and propose trades to initiate new barter pairings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.map((match) => {
            const isReady = match.status === 'Ready to Trade';
            const isFinalized = match.status === 'Trade Finalized';

            return (
              <div
                key={match.id}
                className={`rounded-3xl border p-5 transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
                  isDark 
                    ? 'bg-[#0B132B] border-slate-800 hover:border-emerald-500/50' 
                    : 'bg-white border-slate-200 shadow-sm hover:border-emerald-600/40'
                }`}
              >
                <div>
                  {/* Top Partner Profile */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={match.partner.avatar}
                        alt={match.partner.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-base leading-tight truncate text-slate-900 dark:text-white">
                          {match.partner.name}
                        </h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          ★ {match.partner.trustScore}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isFinalized
                        ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                        : isReady
                        ? isDark 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold'
                    }`}>
                      {match.status}
                    </span>
                  </div>

                  {/* Visual Item Swap Pair Box */}
                  <div className={`p-4 rounded-2xl border mb-4 flex items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {/* Your item */}
                    <div className="flex-1 flex flex-col items-center text-center min-w-0">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">You Offer</div>
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2 shadow-xs">
                        <SafeImage
                          src={match.myOffering.imageUrl}
                          alt={match.myOffering.title}
                          title={match.myOffering.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1">
                          {renderTierPill(match.myOffering.tier)}
                        </div>
                      </div>
                      <span className="text-sm font-bold leading-snug line-clamp-2 text-slate-900 dark:text-white">
                        {match.myOffering.title}
                      </span>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex flex-col items-center justify-center shrink-0 px-2">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-2xs">
                        <ArrowRightLeft className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        Swap
                      </span>
                    </div>

                    {/* Their item */}
                    <div className="flex-1 flex flex-col items-center text-center min-w-0">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">You Receive</div>
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2 shadow-xs">
                        <SafeImage
                          src={match.theirOffering.imageUrl}
                          alt={match.theirOffering.title}
                          title={match.theirOffering.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1">
                          {renderTierPill(match.theirOffering.tier)}
                        </div>
                      </div>
                      <span className="text-sm font-bold leading-snug line-clamp-2 text-slate-900 dark:text-white">
                        {match.theirOffering.title}
                      </span>
                    </div>
                  </div>

                  {/* Last message note */}
                  {match.lastMessage && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-1 italic px-1">
                      "{match.lastMessage}"
                    </div>
                  )}
                </div>

                {/* Action button */}
                <button
                  id={`btn-message-match-${match.id}`}
                  onClick={() => onOpenChat(match.id)}
                  className={`w-full py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                    isReady
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                  <span>{isReady ? 'Chat & Finalize Barter' : 'View Message Thread'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
