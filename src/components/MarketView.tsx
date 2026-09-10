import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck, 
  ArrowRightLeft,
  Maximize2,
  Star,
  PanelLeft,
  PanelLeftClose,
  X
} from 'lucide-react';
import { BarterItem, ItemCategory, ThemeMode, ItemCondition, UserProfile } from '../types';
import { SafeImage } from './SafeImage';
import { ImageLightboxModal } from './ImageLightboxModal';
import { MarketSidebar, SortOption } from './MarketSidebar';

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
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [onlyMyListings, setOnlyMyListings] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; title: string; initialIndex: number } | null>(null);
  // Notion-style filter sidebar.
  // pinned = docked in-layout on desktop. Unpinned = hidden, with
  // hover-the-left-edge to peek (desktop) or the panel button (mobile drawer).
  const [pinned, setPinned] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kalakalan_market_sidebar_pinned');
      if (saved !== null) return saved === '1';
      const open = localStorage.getItem('kalakalan_market_sidebar_open');
      if (open !== null) return open === '1';
    } catch { /* ignore */ }
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  // Transient overlay (mobile drawer / toggled-open panel while unpinned).
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kalakalan_market_sidebar_pinned', pinned ? '1' : '0');
    } catch { /* ignore */ }
  }, [pinned]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setPeeking(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const collapseSidebar = () => {
    setPinned(false);
    setSidebarOpen(false);
    setPeeking(false);
  };

  // Pin header button: dock / undock, always settling transient state
  // so the panel never ends up shown twice or stuck open.
  const handleTogglePin = () => {
    setPinned((v) => !v);
    setSidebarOpen(false);
    setPeeking(false);
  };

  const isDesktopViewport = () =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

  // Feed panel button: on desktop it docks/undocks with the pin state,
  // on mobile it simply opens/closes the drawer.
  const handleToggleSidebar = () => {
    if (isDesktopViewport()) {
      if (pinned) {
        collapseSidebar();
      } else {
        setSidebarOpen((v) => !v);
        setPeeking(false);
      }
    } else {
      setSidebarOpen((v) => !v);
      setPeeking(false);
    }
  };

  // Floating panel is visible while peeking, plus on mobile whenever
  // open (the docked copy is CSS-hidden below lg).
  const overlayVisible = sidebarOpen || peeking;

  const resetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedCondition('All');
    setSearchQuery('');
    setSortBy('newest');
    setOnlyMyListings(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'All Categories' ||
    selectedCondition !== 'All' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'newest' ||
    onlyMyListings;

  const activeFilterCount =
    (selectedCategory !== 'All Categories' ? 1 : 0) +
    (selectedCondition !== 'All' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0) +
    (sortBy !== 'newest' ? 1 : 0) +
    (onlyMyListings ? 1 : 0);

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
          <span className={`inline-flex items-center gap-1.5 font-semibold tracking-tight rounded-full shadow-sm bg-emerald-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-[13px]' : 'px-3 py-1 text-xs'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span>Brand New</span>
          </span>
        );
      case 'Like New':
        return (
          <span className={`inline-flex items-center gap-1.5 font-semibold tracking-tight rounded-full shadow-sm bg-sky-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-[13px]' : 'px-3 py-1 text-xs'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span>Like New</span>
          </span>
        );
      case '2nd Hand':
        return (
          <span className={`inline-flex items-center gap-1.5 font-semibold tracking-tight rounded-full shadow-sm bg-amber-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-[13px]' : 'px-3 py-1 text-xs'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span>2nd Hand</span>
          </span>
        );
      case 'Heavily Used':
        return (
          <span className={`inline-flex items-center gap-1.5 font-semibold tracking-tight rounded-full shadow-sm bg-purple-600 text-white ${
            isSpotlight ? 'px-3.5 py-1.5 text-[13px]' : 'px-3 py-1 text-xs'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span>Heavily Used</span>
          </span>
        );
    }
  };

  const getPrimaryImage = (item: BarterItem) => {
    if (item.images && item.images.length > 0) return item.images[0];
    return item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
  };

  const renderSidebar = (idSuffix = '') => (
    <MarketSidebar
      theme={theme}
      isDark={isDark}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      selectedCondition={selectedCondition}
      onSelectCondition={setSelectedCondition}
      sortBy={sortBy}
      onSortChange={setSortBy}
      onlyMyListings={onlyMyListings}
      onToggleMyListings={() => setOnlyMyListings((v) => !v)}
      currentUser={currentUser}
      myListingCount={myListingCount}
      resultCount={filteredItems.length}
      totalCount={items.length}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={resetFilters}
      pinned={pinned}
      onTogglePin={handleTogglePin}
      onHoverLeave={() => setPeeking(false)}
      idSuffix={idSuffix}
    />
  );

  return (
    <div className={`pb-36 pt-6 sm:pt-8 px-5 sm:px-8 lg:px-10 max-w-[1400px] mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Hover edge — peek at the floating sidebar like Notion (desktop, undocked) */}
      {!pinned && !sidebarOpen && (
        <div
          className="fixed left-0 top-16 bottom-0 w-4 z-30 hidden sm:block"
          onMouseEnter={() => setPeeking(true)}
          onMouseLeave={(e) => {
            // Leaving the strip toward the panel keeps the peek alive;
            // leaving anywhere else ends it (also covers off-window).
            const target = e.relatedTarget as Node | null;
            if (!target || !overlayRef.current?.contains(target)) {
              setPeeking(false);
            }
          }}
          aria-hidden
        />
      )}

      {/* Backdrop for the overlay sidebar (mobile — hidden on desktop via lg:hidden) */}
      {overlayVisible && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => { setSidebarOpen(false); setPeeking(false); }}
        />
      )}

      <div className="flex items-start gap-6">
        {/* Docked sidebar — desktop only */}
        {pinned && (
          <div className="hidden lg:block w-72 xl:w-80 shrink-0">
            <div className="sticky top-[5.5rem] h-[calc(100vh-12rem)]">
              {renderSidebar('-docked')}
            </div>
          </div>
        )}

        {/* Floating overlay sidebar — hover-peek, toggled panel, or mobile drawer */}
        <div
          ref={overlayRef}
          className={`fixed left-3 top-[4.25rem] bottom-24 lg:top-20 lg:bottom-28 w-[300px] max-w-[85vw] z-40 transition-all duration-200 ${
          overlayVisible ? 'translate-x-0 opacity-100' : '-translate-x-[110%] opacity-0 pointer-events-none'
        } ${pinned ? 'lg:-translate-x-[110%] lg:opacity-0 lg:pointer-events-none' : ''}`}>
          {renderSidebar()}
        </div>

        {/* Main Barter Market Feed */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Slim feed header — sidebar toggle + live filter chips */}
          <div className={`p-3 sm:p-3.5 rounded-2xl border fb-card flex items-center gap-2.5 flex-wrap ${
            isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={handleToggleSidebar}
              title={pinned || overlayVisible ? 'Hide sidebar' : 'Show filters sidebar'}
              aria-label={pinned || overlayVisible ? 'Hide filters sidebar' : 'Show filters sidebar'}
              className={`p-2.5 rounded-xl transition-colors shrink-0 relative ${
                isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {pinned || overlayVisible ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeft className="w-5 h-5" />
              )}
              {hasActiveFilters && !pinned && !overlayVisible && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                {onlyMyListings ? 'Your Active Listings' : 'Available Listings'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {filteredItems.length} of {items.length}
                {hasActiveFilters ? ` • ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} on` : ' • unfiltered'}
              </p>
            </div>
            {/* Active filter chips */}
            {searchQuery.trim() !== '' && (
              <button
                onClick={() => setSearchQuery('')}
                className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="truncate max-w-[140px]">“{searchQuery.trim()}”</span>
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
            {selectedCategory !== 'All Categories' && (
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 transition-all"
              >
                <span className="truncate max-w-[140px]">{selectedCategory}</span>
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
            {selectedCondition !== 'All' && (
              <button
                onClick={() => setSelectedCondition('All')}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 transition-all"
              >
                <span>{selectedCondition}</span>
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
            {onlyMyListings && (
              <button
                onClick={() => setOnlyMyListings(false)}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white transition-all"
              >
                <span>Mine only</span>
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 px-1"
              >
                Reset all
              </button>
            )}
          </div>
        {/* Spotlight Featured Match (When not searching & not filtered to My Listings) */}
        {topMatch && !searchQuery && selectedCategory === 'All Categories' && selectedCondition === 'All' && !onlyMyListings && (
          <div
            onClick={() => onSelectItem(topMatch)}
            className={`rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-300 hover:shadow-lg fb-card ${
              isDark 
                ? 'bg-[#242526] border-slate-800 hover:border-emerald-500/40' 
                : 'bg-white border-slate-200 hover:border-emerald-600/30'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 relative h-60 sm:h-72 lg:h-[320px] bg-slate-950 overflow-hidden">
                <SafeImage
                  src={getPrimaryImage(topMatch)}
                  alt={topMatch.title}
                  title={topMatch.title}
                  category={topMatch.category}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                
                {/* Spotlight Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Featured
                  </span>
                  {topMatch.images && topMatch.images.length > 1 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-md flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      {topMatch.images.length} photos
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  {renderConditionBadge(topMatch.condition, true)}
                </div>

                {/* Usage Duration tag on spotlight */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-emerald-200 backdrop-blur-md flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Used: {topMatch.usageDuration}</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[13px] text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide text-xs">
                      {topMatch.category}
                    </span>
                    <div className="flex items-center gap-1.5 font-normal">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{topMatch.location}</span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white block leading-tight whitespace-normal break-words">
                    {topMatch.title}
                  </h2>

                  <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-normal break-words line-clamp-3">
                    {topMatch.description}
                  </p>

                  <div className={`p-4 rounded-xl flex items-start gap-3 whitespace-normal break-words ${
                    isDark 
                      ? 'bg-emerald-950/20 text-emerald-200' 
                      : 'bg-emerald-50 text-emerald-950'
                  }`}>
                    <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-sm leading-relaxed">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Looking for: </span>
                      <span className="font-normal text-slate-800 dark:text-slate-200">{topMatch.wantedItems}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-1 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={topMatch.owner.avatar}
                      alt={topMatch.owner.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                        <span>{topMatch.owner.name}</span>
                        {currentUser && currentUser.id === topMatch.owner.id && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-bold">YOU</span>
                        )}
                      </div>
                      <div className="text-xs font-normal flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="inline-flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{topMatch.owner.rating ? topMatch.owner.rating.toFixed(1) : '5.0'}</span>
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
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
                    className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-sm"
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
          {filteredItems.length === 0 ? (
            <div className={`p-10 sm:p-14 text-center rounded-2xl border fb-card ${
              isDark ? 'bg-[#242526] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-50" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {onlyMyListings ? "You haven't posted any listings yet" : "No barter listings match your criteria"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                {onlyMyListings
                  ? "Post items you no longer need to arrange swaps with students across campus."
                  : "Try adjusting your search query, selecting a different condition rating, or clearing your filters."}
              </p>
              
              <div className="mt-6 flex items-center justify-center gap-2">
                {onlyMyListings ? (
                  <button
                    onClick={onOpenUpload}
                    className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Listing</span>
                  </button>
                ) : (
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {filteredItems.map((item) => {
                const isOwner = !!currentUser && currentUser.id === item.owner.id;
                const imageList = item.images && item.images.length > 0 ? item.images : [item.imageUrl || ''];
                
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`group rounded-2xl overflow-hidden fb-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isOwner
                        ? isDark
                          ? 'bg-[#242526] border-2 border-emerald-500/40'
                          : 'bg-white border-2 border-emerald-500/40'
                        : isDark 
                        ? 'bg-[#242526] border border-slate-800' 
                        : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className="flex-1 flex flex-col min-h-0">
                      {/* Image Frame with Multiple Image Badge */}
                      <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden shrink-0">
                        <SafeImage
                          src={imageList[0]}
                          alt={item.title}
                          title={item.title}
                          category={item.category}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        
                        {/* Top-Right: Condition Badge */}
                        <div className="absolute top-3 right-3">
                          {renderConditionBadge(item.condition)}
                        </div>

                        {/* Top-Left: Multi-Image Indicator / Owner Badge / Lightbox expand */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {isOwner && (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-sm">
                              YOU
                            </span>
                          )}
                          {imageList.length > 1 && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/70 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                              <Camera className="w-3.5 h-3.5" />
                              {imageList.length}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxData({ images: imageList, title: item.title, initialIndex: 0 });
                            }}
                            className="p-2 rounded-full bg-black/70 hover:bg-emerald-600 text-white backdrop-blur-md transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer"
                            title="Expand uncropped photo"
                            aria-label="Expand uncropped photo"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom-Left: Usage Duration Pill */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/70 text-emerald-200 backdrop-blur-md flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="truncate max-w-[140px]">{item.usageDuration}</span>
                          </span>
                        </div>

                        {/* Bottom-Right: Like Heart for non-owners */}
                        {!isOwner && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLike(item.id);
                            }}
                            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 shadow-sm hover:scale-110 active:scale-90 transition-transform backdrop-blur-xs"
                            aria-label="Like item"
                          >
                            <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                          </button>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 min-h-0">
                        <div className="space-y-2">
                          {/* 1. Category & Location Row */}
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide text-[11px]">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-1 font-normal text-slate-500 dark:text-slate-400 text-xs truncate max-w-[130px]">
                              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </div>

                          {/* 2. Item Title (Clamped to 2 lines max) */}
                          <h4 className="font-semibold text-[15px] tracking-tight text-slate-900 dark:text-white block leading-snug line-clamp-2 break-words">
                            {item.title}
                          </h4>

                          {/* 3. Wants line */}
                          <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400 min-w-0">
                            <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div className="truncate min-w-0 break-words">
                              <span className="font-medium text-emerald-700 dark:text-emerald-400">Wants: </span>
                              <span className="text-slate-600 dark:text-slate-300 font-normal">{item.wantedItems}</span>
                            </div>
                          </div>
                        </div>

                        {/* 4. Bottom Row: Owner Info & Quick Action */}
                        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm mt-auto">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={item.owner.avatar}
                              alt={item.owner.name}
                              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/20"
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-200 text-[13px] truncate max-w-[110px]">
                              {item.owner.name}
                            </span>
                          </div>

                          {/* Owner Quick Controls vs Trust Score */}
                          {isOwner ? (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {onEditItem && (
                                <button
                                  type="button"
                                  onClick={() => onEditItem(item)}
                                  className="p-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-slate-950 transition-colors"
                                  title="Edit listing"
                                >
                                  <Edit3 className="w-4 h-4" />
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
                                  className="p-2 rounded-full bg-rose-500/15 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-colors"
                                  title="Delete listing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>{item.owner.rating ? item.owner.rating.toFixed(1) : '5.0'}</span>
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                ({item.owner.completedTrades})
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
        </div>{/* /product feed */}
      </div>{/* /feed column (flex-1) */}
      </div>{/* /flex: sidebar + feed */}

      {/* Floating Action Button (+) for Mobile Only */}
      <button
        id="fab-upload-barter"
        onClick={onOpenUpload}
        aria-label="Post a new barter"
        className="fixed right-5 bottom-24 z-20 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg flex items-center justify-center transition-all duration-200 sm:hidden cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
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
