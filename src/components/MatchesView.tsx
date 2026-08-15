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
    <div className={`pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Title & Stats Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trade Matches &amp; Proposals
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage your direct barter pairings, active negotiations, and confirmed exchanges.
            </p>
          </div>
        </div>

        {/* Desktop Quick Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0f1b38]/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-xs font-semibold text-slate-400">Total Barter Matches</div>
            <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{matches.length}</div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0f1b38]/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-xs font-semibold text-slate-400">Ready to Trade</div>
            <div className="text-2xl font-bold mt-1 text-emerald-500">{readyMatches.length}</div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0f1b38]/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-xs font-semibold text-slate-400">Pending Proposals</div>
            <div className="text-2xl font-bold mt-1 text-amber-500">{pendingMatches.length}</div>
          </div>
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#0f1b38]/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-xs font-semibold text-slate-400">Campus Trust Verification</div>
            <div className="text-sm font-bold mt-1.5 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Student Verified
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'all', label: 'All Matches', count: matches.length },
            { id: 'ready', label: 'Ready to Trade', count: readyMatches.length },
            { id: 'pending', label: 'Pending Response', count: pendingMatches.length },
            { id: 'finalized', label: 'Finalized Trades', count: finalizedMatches.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? isDark
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-emerald-700 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterTab === tab.id ? 'bg-black/20 text-current' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Matches (Responsive 1 col on mobile, 2 col on tablet, 3 col on PC) */}
      {displayedMatches.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Handshake className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-base">No matches found in this category</h3>
          <p className="text-xs text-slate-400 mt-1">Browse the marketplace and propose trades to initiate new barter pairings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.map((match) => {
            const isReady = match.status === 'Ready to Trade';
            const isFinalized = match.status === 'Trade Finalized';

            return (
              <div
                key={match.id}
                className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg flex flex-col justify-between ${
                  isDark 
                    ? 'bg-[#111c38] border-slate-800 hover:border-emerald-500/50 hover:shadow-emerald-500/5' 
                    : 'bg-white border-slate-200 shadow-xs hover:border-emerald-600/40 hover:shadow-slate-200'
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
                        <h3 className="font-bold text-sm leading-tight truncate">
                          {match.partner.name}
                        </h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          ★ {match.partner.trustScore}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isFinalized
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : isReady
                        ? isDark 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {match.status}
                    </span>
                  </div>

                  {/* Visual Item Swap Pair Box */}
                  <div className={`p-4 rounded-xl border mb-4 flex items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    {/* Your item */}
                    <div className="flex-1 flex flex-col items-center text-center min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">You Offer</div>
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2 shadow-xs">
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
                      <span className="text-xs font-bold leading-tight line-clamp-2">
                        {match.myOffering.title}
                      </span>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex flex-col items-center justify-center shrink-0 px-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        Swap
                      </span>
                    </div>

                    {/* Their item */}
                    <div className="flex-1 flex flex-col items-center text-center min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">You Receive</div>
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2 shadow-xs">
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
                      <span className="text-xs font-bold leading-tight line-clamp-2">
                        {match.theirOffering.title}
                      </span>
                    </div>
                  </div>

                  {/* Last message note */}
                  {match.lastMessage && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1 italic px-1">
                      "{match.lastMessage}"
                    </div>
                  )}
                </div>

                {/* Action button */}
                <button
                  id={`btn-message-match-${match.id}`}
                  onClick={() => onOpenChat(match.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 ${
                    isReady
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
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
