import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Heart, 
  Plus, 
  Sparkles, 
  Clock, 
  Camera, 
  Edit3, 
  Trash2, 
  UserCheck, 
  ShieldCheck, 
  ArrowRightLeft,
  Maximize2,
  Star
} from 'lucide-react';
import { BarterItem, ItemCategory, ThemeMode, ItemCondition, UserProfile } from '../types';
import { CATEGORIES } from '../data/mockData';
import { SafeImage } from './SafeImage';
import { ImageLightboxModal } from './ImageLightboxModal';

interface MarketViewProps {
  items: BarterItem[];
  theme: ThemeMode;
  currentUser?: UserProfile | null;
  onSelectItem: (item: BarterItem) => void;
  onToggleLike: (itemId: string) => void;
  onOpenUpload: () => void;
  onEditItem?: (item: BarterItem) => void;
  onDeleteItem?: (itemId: string) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  items,
  theme,
  currentUser,
  onSelectItem,
  onToggleLike,
  onOpenUpload,
  onEditItem,
  onDeleteItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('All Categories');
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'trust' | 'condition'>('newest');
  const [onlyMyListings, setOnlyMyListings] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; title: string; initialIndex: number } | null>(null);

  const isDark = theme === 'dark';

  const myListingCount = currentUser 
    ? items.filter((item) => item.owner.id === currentUser.id).length 
    : 0;

  // Filter items based on category, condition, search query, and ownership
  const filteredItems = items.filter((item) => {
    if (onlyMyListings && currentUser && item.owner.id !== currentUser.id) {
      return false;
    }
    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesCondition =
      selectedCondition === 'All' || item.condition === selectedCondition;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wantedItems.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.usageDuration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCondition && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'trust') {
      const trustWeightA = a.owner.trustScore === 'High Trust' ? 3 : a.owner.trustScore === 'Verified Trader' ? 2 : 1;
      const trustWeightB = b.owner.trustScore === 'High Trust' ? 3 : b.owner.trustScore === 'Verified Trader' ? 2 : 1;
      const scoreA = (a.owner.rating || 4.5) * 10 + trustWeightA;
      const scoreB = (b.owner.rating || 4.5) * 10 + trustWeightB;
      return scoreB - scoreA;
    }
    if (sortBy === 'condition') {
      const order: Record<ItemCondition, number> = {
        'New': 4,
        'Like New': 3,
        '2nd Hand': 2,
        'Heavily Used': 1,
      };
      return (order[b.condition] || 0) - (order[a.condition] || 0);
    }
    return 0; // default newest
  });

  // Top spotlight match (only if viewing all and not searching)
  const topMatch = filteredItems.find((i) => i.condition === 'New' || i.condition === 'Like New') || filteredItems[0];

  const renderConditionBadge = (condition: ItemCondition, isSpotlight = false) => {
    switch (condition) {
      case 'New':
        return (
          <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-xl shadow-md border border-emerald-400/50 bg-emerald-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse" />
            <span>Brand New</span>
          </span>
        );
      case 'Like New':
        return (
          <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-xl shadow-md border border-sky-400/50 bg-sky-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>Like New</span>
          </span>
        );
      case '2nd Hand':
        return (
          <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-xl shadow-md border border-amber-400/50 bg-amber-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>2nd Hand</span>
          </span>
        );
      case 'Heavily Used':
        return (
          <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight rounded-xl shadow-md border border-purple-400/50 bg-purple-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>Heavily Used</span>
          </span>
        );
    }
  };

  const getPrimaryImage = (item: BarterItem) => {
    if (item.images && item.images.length > 0) return item.images[0];
    return item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
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
              placeholder="Search items, textbooks, gadgets, condition, duration..."
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
            {/* My Listings Toggle (Only visible if logged in) */}
            {currentUser && (
              <button
                onClick={() => setOnlyMyListings(!onlyMyListings)}
                className={`px-2.5 h-8 rounded-lg text-xs font-bold border flex items-center gap-1.5 shrink-0 transition-all ${
                  onlyMyListings
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>My Listings ({myListingCount})</span>
              </button>
            )}

            {/* Condition Filter Buttons */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-8">
              {(['All', 'New', 'Like New', '2nd Hand', 'Heavily Used'] as const).map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-2 h-full rounded-md text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap active:scale-95 ${
                    selectedCondition === cond
                      ? isDark
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-xs'
                        : 'bg-emerald-600 text-white font-extrabold shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cond}
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
              <option value="condition">Best Condition</option>
            </select>
          </div>
        </div>

        {/* Category Navigation Strip */}
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
        {/* Spotlight Featured Match (When not searching & not filtered to My Listings) */}
        {topMatch && !searchQuery && selectedCategory === 'All Categories' && selectedCondition === 'All' && !onlyMyListings && (
          <div
            onClick={() => onSelectItem(topMatch)}
            className={`rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-lg ${
              isDark 
                ? 'bg-gradient-to-br from-[#0e172e] to-[#0a1122] border-slate-800 hover:border-emerald-500/50' 
                : 'bg-white border-slate-200/90 shadow-2xs hover:border-emerald-600/50'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 relative h-48 sm:h-52 lg:h-60 bg-slate-950 overflow-hidden">
                <SafeImage
                  src={getPrimaryImage(topMatch)}
                  alt={topMatch.title}
                  title={topMatch.title}
                  category={topMatch.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Spotlight Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                  {topMatch.images && topMatch.images.length > 1 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-md flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {topMatch.images.length} photos
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  {renderConditionBadge(topMatch.condition, true)}
                </div>

                {/* Usage Duration tag on spotlight */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-emerald-300 backdrop-blur-md flex items-center gap-1 border border-emerald-500/20">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Used: {topMatch.usageDuration}</span>
                  </span>
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

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-normal break-words mb-3 line-clamp-3">
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
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                        <span>{topMatch.owner.name}</span>
                        {currentUser && currentUser.id === topMatch.owner.id && (
                          <span className="text-[9px] px-1 rounded bg-emerald-500 text-slate-950 font-black">YOU</span>
                        )}
                      </div>
                      <div className="text-[10px] font-bold flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{topMatch.owner.rating ? topMatch.owner.rating.toFixed(1) : '5.0'}</span>
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{topMatch.owner.trustScore}</span>
                        </span>
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
                    {currentUser && currentUser.id === topMatch.owner.id ? 'Manage Listing' : 'Propose Trade'}
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
                {onlyMyListings ? 'Your Active Listings' : 'Available Listings'}
              </h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {filteredItems.length}
              </span>
            </div>

            {(selectedCategory !== 'All Categories' || selectedCondition !== 'All' || onlyMyListings) && (
              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setSelectedCondition('All');
                  setOnlyMyListings(false);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl border ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {onlyMyListings ? "You haven't posted any listings yet" : "No barter listings match your criteria"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {onlyMyListings
                  ? "Post items you no longer need to arrange swaps with students across campus."
                  : "Try adjusting your search query, selecting a different condition rating, or clearing your filters."}
              </p>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                {onlyMyListings ? (
                  <button
                    onClick={onOpenUpload}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Listing</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Categories');
                      setSelectedCondition('All');
                      setOnlyMyListings(false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
              {filteredItems.map((item) => {
                const isOwner = !!currentUser && currentUser.id === item.owner.id;
                const imageList = item.images && item.images.length > 0 ? item.images : [item.imageUrl || ''];
                
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isOwner
                        ? isDark
                          ? 'bg-[#0B132B] border-2 border-emerald-500/40'
                          : 'bg-white border-2 border-emerald-500/50'
                        : isDark 
                        ? 'bg-[#0B132B]' 
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex-1 flex flex-col min-h-0">
                      {/* Image Frame with Multiple Image Badge */}
                      <div className="relative w-full aspect-square bg-slate-950 overflow-hidden shrink-0">
                        <SafeImage
                          src={imageList[0]}
                          alt={item.title}
                          title={item.title}
                          category={item.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Top-Right: Condition Badge */}
                        <div className="absolute top-2 right-2">
                          {renderConditionBadge(item.condition)}
                        </div>

                        {/* Top-Left: Multi-Image Indicator / Owner Badge / Lightbox expand */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {isOwner && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-500 text-slate-950 shadow-xs">
                              YOU
                            </span>
                          )}
                          {imageList.length > 1 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-md flex items-center gap-1 shadow-xs border border-white/10">
                              <Camera className="w-3 h-3" />
                              {imageList.length}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxData({ images: imageList, title: item.title, initialIndex: 0 });
                            }}
                            className="p-1.5 rounded-md bg-black/70 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/15 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer"
                            title="Expand uncropped photo"
                            aria-label="Expand uncropped photo"
                          >
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Bottom-Left: Usage Duration Pill */}
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-emerald-300 backdrop-blur-md flex items-center gap-1 border border-emerald-500/20">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            <span className="truncate max-w-[120px]">{item.usageDuration}</span>
                          </span>
                        </div>

                        {/* Bottom-Right: Like Heart for non-owners */}
                        {!isOwner && (
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
                        )}
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

                          {/* 3. Wants line */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 pt-0.5 min-w-0">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div className="truncate min-w-0 text-xs break-words">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">Wants: </span>
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{item.wantedItems}</span>
                            </div>
                          </div>
                        </div>

                        {/* 4. Bottom Row: Owner Info & Quick Action */}
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

                          {/* Owner Quick Controls vs Trust Score */}
                          {isOwner ? (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              {onEditItem && (
                                <button
                                  type="button"
                                  onClick={() => onEditItem(item)}
                                  className="p-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-slate-950 transition-colors"
                                  title="Edit listing"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {onDeleteItem && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Delete "${item.title}"?`)) {
                                      onDeleteItem(item.id);
                                    }
                                  }}
                                  className="p-1 rounded-md bg-rose-500/15 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-colors"
                                  title="Delete listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-[11px] border border-amber-500/25 shadow-2xs">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                <span>{item.owner.rating ? item.owner.rating.toFixed(1) : '5.0'}</span>
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                ({item.owner.completedTrades} trades)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (+) for Mobile Only */}
      <button
        id="fab-upload-barter"
        onClick={onOpenUpload}
        aria-label="Post a new barter"
        className="fixed right-6 bottom-20 z-20 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-200 sm:hidden cursor-pointer"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Click-to-Expand Uncropped Image Lightbox Modal */}
      <ImageLightboxModal
        images={lightboxData?.images || []}
        title={lightboxData?.title}
        initialIndex={lightboxData?.initialIndex || 0}
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
      />
    </div>
  );
};
