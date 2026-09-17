import React, { useState } from 'react';
import { Handshake, Clock, ArrowRightLeft, ArrowRight, MessageSquare, CheckCircle2, User, Sparkles, ShieldCheck, Filter, XCircle, Lock, Archive, Star } from 'lucide-react';
import { TradeMatch, ThemeMode, ItemCondition } from '../types';
import { SafeImage } from './SafeImage';

interface MatchesViewProps {
  matches: TradeMatch[];
  theme: ThemeMode;
  onOpenChat: (matchId: string) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  theme,
  onOpenChat,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'pending' | 'finalized' | 'archived'>('all');
  const isDark = theme === 'dark';

  const readyMatches = matches.filter((m) => m.status === 'Ready to Trade' && !m.isArchived);
  const pendingMatches = matches.filter((m) => m.status === 'Pending Response' && !m.isArchived);
  const finalizedMatches = matches.filter((m) => m.status === 'Trade Finalized');
  const archivedMatches = matches.filter((m) => m.isArchived || m.status === 'Trade Finalized' || m.status === 'Trade Rejected');

  const displayedMatches = matches.filter((m) => {
    if (filterTab === 'ready') return m.status === 'Ready to Trade' && !m.isArchived;
    if (filterTab === 'pending') return m.status === 'Pending Response' && !m.isArchived;
    if (filterTab === 'finalized') return m.status === 'Trade Finalized';
    if (filterTab === 'archived') return m.isArchived || m.status === 'Trade Finalized' || m.status === 'Trade Rejected';
    return true;
  });

  const renderConditionPill = (condition?: ItemCondition) => {
    const cond = condition || 'Like New';
    const color = cond === 'New' 
      ? 'bg-emerald-600' 
      : cond === 'Like New' 
      ? 'bg-sky-600' 
      : cond === '2nd Hand' 
      ? 'bg-amber-600' 
      : 'bg-purple-600';
    return (
      <span className={`px-2 py-0.5 rounded-full ${color} text-white font-semibold text-[11px] shadow-sm`}>
        {cond}
      </span>
    );
  };

  return (
    <div className={`pb-36 pt-8 sm:pt-10 px-5 sm:px-8 lg:px-10 max-w-6xl mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Title Header */}
      <div className="mb-8">
        <div className="mb-7">
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white">
            Trade Matches
          </h1>
          <p className="text-[15px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
            Manage active negotiations, online partner presence, and finalized exchanges.
          </p>
        </div>

        {/* Minimal Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-7">
          <div className={`p-5 rounded-2xl border fb-card ${
            isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Total Matches</div>
            <div className="text-[28px] leading-8 font-bold mt-2 text-emerald-600 dark:text-emerald-400">{matches.length}</div>
          </div>
          <div className={`p-5 rounded-2xl border fb-card ${
            isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Ready to Trade</div>
            <div className="text-[28px] leading-8 font-bold mt-2 text-emerald-600 dark:text-emerald-400">{readyMatches.length}</div>
          </div>
          <div className={`p-5 rounded-2xl border fb-card ${
            isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Archived / Closed</div>
            <div className="text-[28px] leading-8 font-bold mt-2 text-purple-500">{archivedMatches.length}</div>
          </div>
          <div className={`p-5 rounded-2xl border fb-card ${
            isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400">APC Student Security</div>
            <div className="text-sm font-semibold mt-2.5 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Verified Rams
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Matches', count: matches.length },
            { id: 'ready', label: 'Ready to Trade', count: readyMatches.length },
            { id: 'pending', label: 'Pending Response', count: pendingMatches.length },
            { id: 'finalized', label: 'Finalized Trades', count: finalizedMatches.length },
            { id: 'archived', label: 'Archived', count: archivedMatches.length },
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-[#242526] border border-slate-800 text-slate-400 hover:text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 fb-card'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive 
                    ? 'bg-emerald-700 text-white' 
                    : isDark 
                    ? 'bg-slate-800 text-slate-300' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matches Grid */}
      {displayedMatches.length === 0 ? (
        <div className={`p-14 text-center rounded-2xl border fb-card ${
          isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Handshake className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-40" />
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">No matches found in this category</h3>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Browse the marketplace and propose trades to initiate new barter pairings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedMatches.map((match) => {
            const isReady = match.status === 'Ready to Trade';
            const isFinalized = match.status === 'Trade Finalized';
            const isRejected = match.status === 'Trade Rejected';
            const partnerIsOnline = match.partner.isOnline !== undefined ? match.partner.isOnline : true;

            return (
              <div
                key={match.id}
                className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between fb-card ${
                  isDark 
                    ? 'bg-[#242526] border-slate-800 hover:border-emerald-500/40' 
                    : 'bg-white border-slate-200 hover:border-emerald-600/30'
                }`}
              >
                <div>
                  {/* Top Partner Profile with Real-Time Presence Indicator */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={match.partner.avatar}
                          alt={match.partner.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                        />
                        {partnerIsOnline ? (
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                          </span>
                        ) : (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base leading-tight truncate text-slate-900 dark:text-white">
                          {match.partner.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-[11px] border border-amber-500/25">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{match.partner.rating ? match.partner.rating.toFixed(1) : '5.0'}</span>
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {match.partner.trustScore}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {partnerIsOnline ? 'Online' : match.partner.lastActive || 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isFinalized
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                        : isRejected
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                        : isReady
                        ? isDark 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold'
                    }`}>
                      {match.status}
                    </span>
                  </div>

                  {/* Visual Items Exchanged Container */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between mb-4 ${
                    isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {/* Your item */}
                    <div className="flex-1 flex flex-col items-center text-center min-w-0">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">You Offer</div>
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2 shadow-xs">
                        <SafeImage
                          src={match.myOffering.images?.[0] || match.myOffering.imageUrl}
                          alt={match.myOffering.title}
                          title={match.myOffering.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1">
                          {renderConditionPill(match.myOffering.condition)}
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
                          src={match.theirOffering.images?.[0] || match.theirOffering.imageUrl}
                          alt={match.theirOffering.title}
                          title={match.theirOffering.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1">
                          {renderConditionPill(match.theirOffering.condition)}
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

                {/* Bottom Action Strip */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{match.matchedAt}</span>
                  </div>

                  <button
                    onClick={() => onOpenChat(match.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isFinalized ? 'View Archived Chat' : isRejected ? 'View Closed Chat' : 'Open Chat'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
