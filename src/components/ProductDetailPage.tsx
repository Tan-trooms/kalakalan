import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  ArrowRightLeft, 
  Check, 
  Send, 
  Sparkles, 
  Calendar, 
  Tag, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { BarterItem, ThemeMode, ValueTier } from '../types';
import { SafeImage } from './SafeImage';

interface ProductDetailPageProps {
  item: BarterItem;
  theme: ThemeMode;
  onBack: () => void;
  onToggleLike?: (itemId: string) => void;
  onProposeTrade?: (targetItem: BarterItem, offeringTitle: string, offeringTier: ValueTier) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  theme,
  onBack,
  onToggleLike,
  onProposeTrade,
}) => {
  const isDark = theme === 'dark';

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [offeringTitle, setOfferingTitle] = useState('');
  const [offeringTier, setOfferingTier] = useState<ValueTier>(item.tier);
  const [isSent, setIsSent] = useState(false);

  // Simulated gallery images for demo with item's primary image
  const galleryImages = [
    item.imageUrl,
    item.imageUrl,
    item.imageUrl,
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringTitle.trim()) return;

    if (onProposeTrade) {
      onProposeTrade(item, offeringTitle.trim(), offeringTier);
    }
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowProposalForm(false);
    }, 1500);
  };

  const renderTierBadge = (tier: ValueTier) => {
    if (tier === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Tier 1 (&lt;₱2.5k)
        </span>
      );
    }
    if (tier === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          Tier 2 (₱2.5k - ₱7.5k)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
        <span className="w-2 h-2 rounded-full bg-indigo-500" />
        Tier 3 (₱7.5k+)
      </span>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-[#060D1F] text-slate-100' : 'bg-slate-50/70 text-slate-900'
    }`}>
      {/* 1. Sticky Top Navigation & Actions Bar */}
      <div className={`sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors ${
        isDark 
          ? 'bg-[#0B132B]/90 border-slate-800/80 text-white' 
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${
              isDark 
                ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              title="Share listing"
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                copiedLink 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : isDark 
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Favorite / Like Button */}
            {onToggleLike && (
              <button
                onClick={() => onToggleLike(item.id)}
                title={item.isLiked ? 'Remove from favorites' : 'Save to favorites'}
                className={`p-2 rounded-xl border transition-all ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
                    : 'bg-white border-slate-200 hover:bg-slate-100 shadow-2xs'
                }`}
              >
                <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Container (Spacious Layout) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Visuals & Thumbnail Gallery (approx 60% on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image Container */}
            <div className={`relative w-full rounded-3xl overflow-hidden border shadow-sm aspect-4/3 sm:aspect-16/10 bg-slate-950 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <SafeImage
                src={galleryImages[activeImageIndex] || item.imageUrl}
                alt={item.title}
                title={item.title}
                category={item.category}
                className="w-full h-full object-cover"
              />

              {/* Badges on Main Image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {renderTierBadge(item.tier)}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/10 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Barter Verified
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery (Placeholder for multi-photo support) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {galleryImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-900 ${
                    activeImageIndex === idx
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <SafeImage
                    src={imgSrc}
                    alt={`${item.title} preview ${idx + 1}`}
                    title={item.title}
                    category={item.category}
                    className="w-full h-full object-cover"
                  />
                  {idx > 0 && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      #{idx + 1}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Safety & Exchange Guidelines Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'
            }`}>
              <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-200">APC Campus Barter Protocol: </span>
                Meet your trade partner in designated campus common areas (Library Hub, Cafeteria, or Student Lounge) to inspect items before finalizing your exchange.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details, Specifications, & Sticky Action Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Row: Category & Location */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{item.location}</span>
              </div>
            </div>

            {/* Title: Large, Un-clamped H1 */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight whitespace-normal break-words">
                {item.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Posted {item.createdAt}</span>
                <span>•</span>
                <span>Tier {item.tier} Parity Value</span>
              </div>
            </div>

            {/* Target Trade Box: Prominent Styled Box */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${
              isDark 
                ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200' 
                : 'bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-2xs'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                <ArrowRightLeft className="w-4 h-4 shrink-0" />
                <span>Looking to Trade For</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug whitespace-normal break-words">
                {item.wantedItems}
              </p>
            </div>

            {/* Description: Full, Un-clamped Paragraph Area */}
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Item Description &amp; Condition</span>
              </h3>
              <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-line break-words ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {item.description}
              </div>
            </div>

            {/* 3. Sticky User Profile Block & Trade Action Container */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
              isDark 
                ? 'bg-[#0B132B] border-slate-800 shadow-md' 
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {/* User Profile Block */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={item.owner.avatar}
                      alt={item.owner.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base text-slate-900 dark:text-white truncate">
                        {item.owner.name}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Trust Rating ★ {item.owner.trustScore}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    {item.owner.completedTrades} Trades
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Verified Trader
                  </div>
                </div>
              </div>

              {/* Trade Proposal Action / Form */}
              <div className="pt-5">
                {showProposalForm ? (
                  <form onSubmit={handleSendProposal} className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Propose Your Exchange Item</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Tier {item.tier} Target</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        What item will you offer to {item.owner.name}? *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mechanical Keyboard, CS Textbook, Arduino Starter Kit"
                        value={offeringTitle}
                        onChange={(e) => setOfferingTitle(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                            : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        Select Offering Value Tier
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { tier: 1 as ValueTier, label: 'Tier 1 (<₱2.5k)' },
                          { tier: 2 as ValueTier, label: 'Tier 2 (₱2.5k-₱7.5k)' },
                          { tier: 3 as ValueTier, label: 'Tier 3 (₱7.5k+)' },
                        ].map((t) => (
                          <button
                            type="button"
                            key={t.tier}
                            onClick={() => setOfferingTier(t.tier)}
                            className={`py-2 px-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                              offeringTier === t.tier
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : isDark
                                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isSent ? (
                      <div className="p-3.5 bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-md">
                        <CheckCircle2 className="w-5 h-5" />
                        Proposal Sent! Connecting with trader...
                      </div>
                    ) : (
                      <div className="flex gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowProposalForm(false)}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                            isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Proposal</span>
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  <button
                    id="btn-product-propose-trade"
                    onClick={() => setShowProposalForm(true)}
                    className="w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                    <span>Propose Trade</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
