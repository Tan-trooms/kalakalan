import React, { useState } from 'react';
import { Search, MapPin, Heart, Plus, SlidersHorizontal, ArrowUpDown, ShoppingCart, Sparkles, Filter, CheckCircle2, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { BarterItem, ItemCategory, ThemeMode, ValueTier } from '../types';
import { CATEGORIES } from '../data/mockData';
import { SafeImage } from './SafeImage';

interface MarketViewProps {
  items: BarterItem[];
  theme: ThemeMode;
  onSelectItem: (item: BarterItem) => void;
  onToggleLike: (itemId: string) => void;
  onOpenUpload: () => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  items,
  theme,
  onSelectItem,
  onToggleLike,
  onOpenUpload,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('All Categories');
  const [selectedTier, setSelectedTier] = useState<ValueTier | 0>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'trust' | 'tier'>('newest');

  const isDark = theme === 'dark';

  // Filter items based on category, tier, and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesTier = selectedTier === 0 || item.tier === selectedTier;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wantedItems.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTier && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'trust') {
      const scoreA = parseFloat(a.owner.trustScore) || 0;
      const scoreB = parseFloat(b.owner.trustScore) || 0;
      return scoreB - scoreA;
    }
    if (sortBy === 'tier') {
      return b.tier - a.tier;
    }
    return 0; // default order
  });

  // Top match & freshly listed splits
  const topMatch = filteredItems.find((i) => i.tier === 3) || filteredItems[0];
  const secondaryMatches = filteredItems.filter((i) => i.id !== topMatch?.id).slice(0, 3);
  const freshlyListed = filteredItems.filter((i) => i.id !== topMatch?.id);

  const renderTierBadge = (tier: ValueTier, isSpotlight = false) => {
    if (tier === 1) {
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-xl backdrop-blur-md border shadow-xs ${
          isSpotlight
            ? 'px-3.5 py-1.5 text-sm bg-emerald-500/25 text-emerald-950 dark:text-emerald-200 border-emerald-400/40'
            : 'px-3 py-1 text-xs bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-500/30'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Tier 1 (&lt;₱2.5k)</span>
        </span>
      );
    }
    if (tier === 2) {
      return (
        <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-xl backdrop-blur-md border shadow-xs ${
          isSpotlight
            ? 'px-3.5 py-1.5 text-sm bg-sky-500/25 text-sky-950 dark:text-sky-200 border-sky-400/40'
            : 'px-3 py-1 text-xs bg-sky-500/20 text-sky-900 dark:text-sky-200 border-sky-500/30'
        }`}>
          <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
          <span>Tier 2 (₱2.5k–₱7.5k)</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-xl backdrop-blur-md border shadow-xs ${
        isSpotlight
          ? 'px-3.5 py-1.5 text-sm bg-indigo-500/25 text-indigo-950 dark:text-indigo-200 border-indigo-400/40'
          : 'px-3 py-1 text-xs bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 border-indigo-500/30'
      }`}>
        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
        <span>Tier 3 (₱7.5k+)</span>
      </span>
    );
  };

  return (
    <div className={`pb-16 pt-1 sm:pt-1.5 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Compact Search & Filter Toolbar directly below Navbar */}
      <div className={`mb-2 p-1.5 sm:p-2 rounded-xl border transition-all ${
        isDark 
          ? 'bg-[#0B132B] border-slate-800 shadow-sm' 
          : 'bg-white border-slate-200 shadow-2xs'
      }`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5">
          {/* Search Input */}
          <div className={`flex-1 h-8 flex items-center gap-2 px-2.5 rounded-lg border transition-all ${
            isDark 
              ? 'bg-slate-900 border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 text-white' 
              : 'bg-slate-50 border-slate-200 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-500/15 text-slate-900'
          }`}>
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              id="input-market-search"
              type="text"
              placeholder="Search items, textbooks, gadgets, wanted trades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter controls row */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {/* Tier Filter Buttons */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-8">
              {[
                { id: 0, label: 'All' },
                { id: 1, label: 'Tier 1' },
                { id: 2, label: 'Tier 2' },
                { id: 3, label: 'Tier 3' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(t.id as ValueTier | 0)}
                  className={`px-2 h-full rounded-md text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap active:scale-95 ${
                    selectedTier === t.id
                      ? isDark
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-xs'
                        : 'bg-emerald-600 text-white font-extrabold shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`h-8 text-[11px] font-bold py-0 px-2 rounded-lg border outline-none cursor-pointer transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600'
              }`}
            >
              <option value="newest">Newest</option>
              <option value="trust">High Trust</option>
              <option value="tier">High Tier</option>
            </select>
          </div>
        </div>

        {/* Ultra-Slim Category Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 mt-1 border-t border-slate-200/60 dark:border-slate-800 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-bold'
                      : 'bg-emerald-100 text-emerald-950 border border-emerald-600 font-bold'
                    : isDark
                    ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-700 border border-transparent hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Barter Market Feed */}
      <div className="space-y-3">
        {/* Spotlight Featured Match (When not searching) */}
        {topMatch && !searchQuery && selectedCategory === 'All Categories' && selectedTier === 0 && (
          <div
            onClick={() => onSelectItem(topMatch)}
            className={`rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-lg ${
              isDark 
                ? 'bg-gradient-to-br from-[#0e172e] to-[#0a1122] border-slate-800 hover:border-emerald-500/50' 
                : 'bg-white border-slate-200/90 shadow-2xs hover:border-emerald-600/50'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 relative h-44 sm:h-48 lg:h-52 bg-slate-950 overflow-hidden">
                <SafeImage
                  src={topMatch.imageUrl}
                  alt={topMatch.title}
                  title={topMatch.title}
                  category={topMatch.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  {renderTierBadge(topMatch.tier, true)}
                </div>
              </div>

              <div className="lg:col-span-7 p-3.5 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1.5">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                      {topMatch.category}
                    </span>
                    <div className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{topMatch.location}</span>
                    </div>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-snug whitespace-normal break-words mb-2">
                    {topMatch.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-normal break-words mb-3">
                    {topMatch.description}
                  </p>

                  <div className={`p-2.5 rounded-xl border flex items-start gap-2 whitespace-normal break-words ${
                    isDark 
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs leading-snug">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">Looking for: </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{topMatch.wantedItems}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={topMatch.owner.avatar}
                      alt={topMatch.owner.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/30"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{topMatch.owner.name}</div>
                      <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        ★ {topMatch.owner.trustScore}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(topMatch);
                    }}
                    className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Propose Trade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Feed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Available Listings
              </h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {filteredItems.length}
              </span>
            </div>

            {selectedCategory !== 'All Categories' && (
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className={`p-6 text-center rounded-2xl border ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-1.5 opacity-50" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">No barter listings found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
                Try adjusting your search query or selecting a different category or value tier.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedTier(0);
                }}
                className="mt-2.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isDark 
                      ? 'bg-[#0B132B]' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Image Frame */}
                    <div className="relative w-full aspect-square bg-slate-950 overflow-hidden shrink-0">
                      <SafeImage
                        src={item.imageUrl}
                        alt={item.title}
                        title={item.title}
                        category={item.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        {renderTierBadge(item.tier)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(item.id);
                        }}
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs hover:scale-110 active:scale-90 transition-transform backdrop-blur-xs"
                        aria-label="Like item"
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      </button>
                    </div>

                    {/* Content Body */}
                    <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5 min-h-0">
                      <div className="space-y-1">
                        {/* 1. Category & Location Row */}
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400 text-[10px] truncate max-w-[110px]">
                            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        </div>

                        {/* 2. Item Title (Clamped to 2 lines max) */}
                        <h4 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white block leading-snug line-clamp-2 break-words">
                          {item.title}
                        </h4>

                        {/* 3. Minimalist "Wants" line (1 line clamped / truncate) */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 pt-0.5 min-w-0">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="truncate min-w-0 text-xs break-words">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Wants: </span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.wantedItems}</span>
                          </div>
                        </div>
                      </div>

                      {/* 4. Small User Avatar row at the very bottom */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mt-auto">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img
                            src={item.owner.avatar}
                            alt={item.owner.name}
                            className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/20"
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate max-w-[90px]">
                            {item.owner.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                          ★ {item.owner.trustScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (+) for Mobile Only */}
      <button
        id="fab-upload-barter"
        onClick={onOpenUpload}
        aria-label="Post a new barter"
        className="fixed right-6 bottom-20 z-20 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-200 sm:hidden"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
