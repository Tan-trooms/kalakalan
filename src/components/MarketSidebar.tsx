import React from 'react';
import {
  Search,
  UserCheck,
  Pin,
  PinOff,
  RotateCcw,
  ArrowUpDown,
  LayoutGrid,
} from 'lucide-react';
import { ItemCategory, ItemCondition, ThemeMode, UserProfile } from '../types';
import { CATEGORIES } from '../data/mockData';

export type SortOption = 'newest' | 'trust' | 'condition';

interface MarketSidebarProps {
  theme: ThemeMode;
  isDark: boolean;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedCategory: ItemCategory;
  onSelectCategory: (c: ItemCategory) => void;
  selectedCondition: ItemCondition | 'All';
  onSelectCondition: (c: ItemCondition | 'All') => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  onlyMyListings: boolean;
  onToggleMyListings: () => void;
  currentUser?: UserProfile | null;
  myListingCount: number;
  resultCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  // Notion-style visibility controls
  // NOTE: no hover-enter here on purpose — peeks are triggered only by the
  // left-edge strip. Entering the panel itself must never open it, or the
  // header button re-opens the panel from under the cursor (hover race).
  pinned: boolean;
  onTogglePin: () => void;
  onHoverLeave: () => void;
  /** Suffix for DOM ids so docked + overlay instances never collide. */
  idSuffix?: string;
}

const CONDITION_OPTIONS: (ItemCondition | 'All')[] = ['All', 'New', 'Like New', '2nd Hand', 'Heavily Used'];

const SORT_OPTIONS: { id: SortOption; label: string; hint: string }[] = [
  { id: 'newest', label: 'Newest first', hint: 'Recently listed' },
  { id: 'trust', label: 'High Trust', hint: 'Top rated traders' },
  { id: 'condition', label: 'Best Condition', hint: 'New → Used' },
];

export const MarketSidebar: React.FC<MarketSidebarProps> = ({
  theme,
  isDark,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
  sortBy,
  onSortChange,
  onlyMyListings,
  onToggleMyListings,
  currentUser,
  myListingCount,
  resultCount,
  totalCount,
  hasActiveFilters,
  onResetFilters,
  onTogglePin,
  pinned,
  onHoverLeave,
  idSuffix = '',
}) => {
  void theme;

  const searchInputId = `input-market-search${idSuffix}`;

  const sectionLabel = 'text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2';

  const rowBase =
    'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all text-left active:scale-[0.99]';

  const rowIdle = isDark
    ? 'text-slate-300 hover:bg-slate-800'
    : 'text-slate-600 hover:bg-slate-100';

  const rowActive = isDark
    ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
    : 'bg-emerald-100/80 text-emerald-900 font-semibold';

  return (
    <aside
      id="market-filter-sidebar"
      onMouseLeave={onHoverLeave}
      className={`h-full flex flex-col overflow-hidden rounded-2xl border fb-card transition-colors duration-200 ${
        isDark ? 'bg-[#242526] border-slate-700/60' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header — Notion workspace row: title + pin (dock / undock) */}
      <div className={`flex items-center gap-1.5 px-3 pt-3 pb-2.5 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
          }`}>
            <LayoutGrid className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold truncate leading-tight text-slate-900 dark:text-white">
              Marketplace Filters
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              {resultCount} of {totalCount} listings
            </p>
          </div>
        </div>
        <button
          onClick={onTogglePin}
          title={pinned ? 'Undock sidebar' : 'Pin sidebar (dock it)'}
          aria-label={pinned ? 'Undock sidebar' : 'Pin sidebar'}
          aria-pressed={pinned}
          className={`p-2 rounded-lg transition-colors ${
            pinned
              ? isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
              : isDark ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          {pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Scrollable filter sections — Notion-style grouped rows */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
        {/* Search */}
        <section className="space-y-1.5">
          <h3 className={sectionLabel}>Search</h3>
          <div className={`flex items-center gap-2 px-3 h-10 rounded-xl border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-700 focus-within:border-emerald-500 text-white'
              : 'bg-[#f0f2f5] border-transparent focus-within:bg-white focus-within:border-emerald-600 text-slate-900'
          }`}>
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search items, traders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 font-normal"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* My listings */}
        {currentUser && (
          <section className="space-y-1.5">
            <h3 className={sectionLabel}>My stuff</h3>
            <button
              onClick={onToggleMyListings}
              className={`${rowBase} ${onlyMyListings ? rowActive : rowIdle}`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">My Listings</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                onlyMyListings
                  ? 'bg-emerald-600 text-white'
                  : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {myListingCount}
              </span>
            </button>
          </section>
        )}

        {/* Condition */}
        <section className="space-y-1.5">
          <h3 className={sectionLabel}>Condition</h3>
          <div className="space-y-0.5">
            {CONDITION_OPTIONS.map((cond) => {
              const isSelected = selectedCondition === cond;
              return (
                <button
                  key={cond}
                  onClick={() => onSelectCondition(cond)}
                  className={`${rowBase} ${isSelected ? rowActive : rowIdle}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    cond === 'New' ? 'bg-emerald-500'
                    : cond === 'Like New' ? 'bg-sky-500'
                    : cond === '2nd Hand' ? 'bg-amber-500'
                    : cond === 'Heavily Used' ? 'bg-purple-500'
                    : 'bg-slate-400'
                  }`} />
                  <span className="flex-1 truncate">{cond === 'All' ? 'All conditions' : cond}</span>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Sort */}
        <section className="space-y-1.5">
          <h3 className={`${sectionLabel} flex items-center gap-1`}>
            <ArrowUpDown className="w-3 h-3" /> Sort by
          </h3>
          <div className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = sortBy === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSortChange(opt.id)}
                  className={`${rowBase} ${isSelected ? rowActive : rowIdle}`}
                >
                  <span className="flex-1 min-w-0">
                    <span className="block truncate">{opt.label}</span>
                    <span className="block text-[11px] font-normal text-slate-400 truncate">{opt.hint}</span>
                  </span>
                  {isSelected && <span className="text-xs shrink-0">✓</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-1.5">
          <h3 className={sectionLabel}>Categories</h3>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`${rowBase} ${isSelected ? rowActive : rowIdle}`}
                >
                  <span className="flex-1 truncate">{cat}</span>
                  {isSelected && <span className="text-xs shrink-0">✓</span>}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer — reset */}
      <div className={`p-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        {hasActiveFilters ? (
          <button
            onClick={onResetFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4" />
            Reset all filters
          </button>
        ) : (
          <p className="text-center text-[11px] text-slate-400 px-2 leading-relaxed">
            {pinned
              ? 'Pinned — tap the pin to undock me.'
              : 'Floating — tap the pin to dock me.'}
          </p>
        )}
      </div>
    </aside>
  );
};
