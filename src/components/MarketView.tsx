import React, { useState } from 'react';
import { Search, MapPin, Heart, Plus, SlidersHorizontal, ArrowUpDown, ShoppingCart, Sparkles, Filter, CheckCircle2, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { BarterItem, ItemCategory, ThemeMode, ValueTier } from '../types';
import { CATEGORIES } from '../data/mockData';
import { SafeImage } from './SafeImage';

interface MarketViewProps {
  items: BarterItem[];
  cyberItems?: BarterItem[];
  theme: ThemeMode;
  isCyberMode?: boolean;
  onSelectItem: (item: BarterItem) => void;
  onToggleLike: (itemId: string) => void;
  onOpenUpload: () => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  items,
  cyberItems = [],
  theme,
  isCyberMode = false,
  onSelectItem,
  onToggleLike,
  onOpenUpload,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('All Categories');
  const [selectedTier, setSelectedTier] = useState<ValueTier | 0>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'trust' | 'tier'>('newest');

  const isDark = theme === 'dark';

  const activePool = isCyberMode ? cyberItems : items;

  // Filter items based on category, tier, and search query
  const filteredItems = activePool.filter((item) => {
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

  const renderTierBadge = (tier: ValueTier, isCyber = false) => {
    if (isCyber) {
      return (
        <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-xs">
          TIER {tier}
        </span>
      );
    }
    if (tier === 1) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-xs">
          Tier 1 (under $50)
        </span>
      );
    }
    if (tier === 2) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-600 text-white shadow-xs">
          Tier 2 ($50 - $150)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-xs">
        Tier 3 ($150+)
      </span>
    );
  };

  return (
    <div className={`pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Top Banner / Marketplace Headline */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isCyberMode ? 'font-mono text-emerald-400' : isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {isCyberMode ? 'NEURAL BARTER EXCHANGE' : 'Campus Barter Marketplace'}
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {isCyberMode 
              ? 'Decentralized peer-to-peer hardware & data exchange network' 
              : 'Direct peer-to-peer student item exchange • Zero cash required • Verified campus traders'}
          </p>
        </div>

        {/* Quick Post Button for Tablet/Desktop */}
        <button
          onClick={onOpenUpload}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-sm hover:shadow-emerald-500/20 active:scale-95 transition-all shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>List Item to Trade</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className={`p-4 rounded-2xl border mb-6 transition-all ${
        isDark 
          ? 'bg-[#0f1b38]/70 border-slate-800' 
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 lg:col-span-5 relative">
            <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
              isDark 
                ? 'bg-slate-900/90 border-slate-700/80 focus-within:border-emerald-500 text-white' 
                : 'bg-slate-50 border-slate-200 focus-within:border-emerald-600 text-slate-900'
            }`}>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                id="input-market-search"
                type="text"
                placeholder={isCyberMode ? "Search neural assets, rigs, gear..." : "Search items, textbooks, hardware, wanted trades..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tier Selector Pills */}
          <div className="md:col-span-6 lg:col-span-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1 hidden sm:inline">Tier:</span>
            {[
              { id: 0, label: 'All Tiers' },
              { id: 1, label: 'Tier 1' },
              { id: 2, label: 'Tier 2' },
              { id: 3, label: 'Tier 3' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id as ValueTier | 0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTier === t.id
                    ? isDark
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-emerald-700 text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-12 lg:col-span-3 flex items-center justify-end gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`text-xs font-semibold py-1.5 px-2.5 rounded-lg border outline-none cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="newest">Featured &amp; Newest</option>
              <option value="trust">Trader Trust Score</option>
              <option value="tier">Value Tier (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 mt-3 border-t border-slate-200/40 dark:border-slate-800/80 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-semibold shadow-xs'
                      : 'bg-emerald-50 text-emerald-900 border-2 border-emerald-600 font-semibold shadow-2xs'
                    : isDark
                    ? 'bg-slate-900/60 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-700 border border-transparent hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cyber Mode Feed (Widescreen Grid) */}
      {isCyberMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`rounded-2xl overflow-hidden border transition-all cursor-pointer group hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between ${
                isDark ? 'bg-[#0f1b38]/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Image banner */}
              <div>
                <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title}
                    title={item.title}
                    category={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    {renderTierBadge(item.tier, true)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 text-white backdrop-blur-xs hover:scale-110 active:scale-95 transition-transform border border-white/10"
                  >
                    <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
                  </button>
                </div>

                {/* Card info */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {item.location}
                    </span>
                  </div>

                  <h3 className="font-bold text-base tracking-tight leading-snug group-hover:text-emerald-400 transition-colors font-mono">
                    {item.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Bid / Exchange Bar */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    CREDIT VALUE
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-400">
                    {item.creditPrice || '350.00 CR'}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-xs"
                >
                  ACQUIRE
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Standard Campus Barter Market Feed (Widescreen Grid) */
        <div className="space-y-8">
          {/* FEATURED SPOTLIGHT BANNER (Desktop Widescreen Spotlight) */}
          {topMatch && !searchQuery && selectedCategory === 'All Categories' && (
            <div
              onClick={() => onSelectItem(topMatch)}
              className={`rounded-3xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-[#111c38] to-[#0d162d] border-slate-800 hover:border-emerald-500/50 hover:shadow-emerald-500/5' 
                  : 'bg-white border-slate-200 shadow-sm hover:border-emerald-600/50'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-6 relative h-64 lg:h-80 bg-slate-900 overflow-hidden">
                  <SafeImage
                    src={topMatch.imageUrl}
                    alt={topMatch.title}
                    title={topMatch.title}
                    category={topMatch.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      Featured Campus Match
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    {renderTierBadge(topMatch.tier)}
                  </div>
                </div>

                <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                        {topMatch.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{topMatch.location}</span>
                      </div>
                    </div>

                    <h2 className="text-xl lg:text-2xl font-bold tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {topMatch.title}
                    </h2>

                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {topMatch.description}
                    </p>

                    {/* Wanted Barter Badge */}
                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Looking to trade for:
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {topMatch.wantedItems}
                      </p>
                    </div>
                  </div>

                  {/* Trader Info & Action */}
                  <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={topMatch.owner.avatar}
                        alt={topMatch.owner.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                      <div>
                        <div className="text-sm font-bold">{topMatch.owner.name}</div>
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Trust Score {topMatch.owner.trustScore}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(topMatch);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      Propose Trade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MAIN ALL ITEMS GRID (Responsive 4 Columns on PC) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Available Barter Listings
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredItems.length} items
                </span>
              </div>

              {selectedCategory !== 'All Categories' && (
                <button
                  onClick={() => setSelectedCategory('All Categories')}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
                <h3 className="font-bold text-base">No items found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query or selecting a different category or value tier.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedTier(0);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                      isDark 
                        ? 'bg-[#111c38] border-slate-800 hover:border-emerald-500/50 hover:shadow-emerald-500/5' 
                        : 'bg-white border-slate-200 shadow-xs hover:border-emerald-600/40 hover:shadow-slate-200'
                    }`}
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                        <SafeImage
                          src={item.imageUrl}
                          alt={item.title}
                          title={item.title}
                          category={item.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 right-2.5">
                          {renderTierBadge(item.tier)}
                        </div>
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/10">
                            {item.category}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(item.id);
                          }}
                          className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-sm hover:scale-110 active:scale-90 transition-transform"
                          aria-label="Like item"
                        >
                          <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                        </button>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-base tracking-tight truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </h4>

                        <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {item.description}
                        </p>

                        {/* Wanted Trade preview */}
                        <div className={`p-2 rounded-lg text-[11px] font-medium truncate ${
                          isDark ? 'bg-slate-900/80 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          <span className="font-bold">Want: </span>
                          {item.wantedItems}
                        </div>
                      </div>
                    </div>

                    {/* Trader Footnote */}
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.owner.avatar}
                          alt={item.owner.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <span className="truncate font-semibold max-w-[90px]">{item.owner.name}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                          ★ {item.owner.trustScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button (+) for Mobile Only */}
      <button
        id="fab-upload-barter"
        onClick={onOpenUpload}
        aria-label="Post a new barter"
        className="fixed right-6 bottom-20 z-20 w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-200 sm:hidden"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
