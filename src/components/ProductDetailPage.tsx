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
  CheckCircle2,
  Clock,
  Camera,
  Edit3,
  Trash2,
  AlertTriangle,
  UserCheck,
  Star
} from 'lucide-react';
import { BarterItem, ThemeMode, ItemCondition, UserProfile } from '../types';
import { SafeImage } from './SafeImage';

interface ProductDetailPageProps {
  item: BarterItem;
  theme: ThemeMode;
  currentUser?: UserProfile | null;
  onBack: () => void;
  onToggleLike?: (itemId: string) => void;
  onProposeTrade?: (targetItem: BarterItem, offeringTitle: string, offeringCondition: ItemCondition) => void;
  onEditItem?: (item: BarterItem) => void;
  onDeleteItem?: (itemId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  item,
  theme,
  currentUser,
  onBack,
  onToggleLike,
  onProposeTrade,
  onEditItem,
  onDeleteItem,
}) => {
  const isDark = theme === 'dark';
  const isOwner = !!currentUser && currentUser.id === item.owner.id;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [offeringTitle, setOfferingTitle] = useState('');
  const [offeringCondition, setOfferingCondition] = useState<ItemCondition>('Like New');
  const [isSent, setIsSent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use the item's images array
  const galleryImages = (item.images && item.images.length > 0) 
    ? item.images 
    : [item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'];

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
      onProposeTrade(item, offeringTitle.trim(), offeringCondition);
    }
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowProposalForm(false);
    }, 1500);
  };

  const handleDelete = () => {
    if (onDeleteItem) {
      onDeleteItem(item.id);
      onBack();
    }
  };

  const renderConditionBadge = (condition: ItemCondition) => {
    switch (condition) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Brand New
          </span>
        );
      case 'Like New':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Like New
          </span>
        );
      case '2nd Hand':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            2nd Hand
          </span>
        );
      case 'Heavily Used':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Heavily Used
          </span>
        );
    }
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

            {/* Favorite / Like Button (non-owners) */}
            {!isOwner && onToggleLike && (
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

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Visuals & Thumbnail Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image Container */}
            <div className={`relative w-full rounded-3xl overflow-hidden border shadow-sm aspect-4/3 sm:aspect-16/10 bg-slate-950 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <SafeImage
                src={galleryImages[activeImageIndex] || galleryImages[0]}
                alt={item.title}
                title={item.title}
                category={item.category}
                className="w-full h-full object-cover"
              />

              {/* Badges on Main Image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {renderConditionBadge(item.condition)}
                {isOwner && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    YOUR LISTING
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/10 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Barter Verified
                </span>
              </div>

              {/* Multi-Photo Counter */}
              {galleryImages.length > 1 && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-md flex items-center gap-1 border border-white/10">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{activeImageIndex + 1} / {galleryImages.length}</span>
                </div>
              )}

              {/* Usage Duration tag at bottom-left */}
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-black/80 text-emerald-300 backdrop-blur-md flex items-center gap-1.5 border border-emerald-500/30">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Used: {item.usageDuration}</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {galleryImages.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-900 cursor-pointer ${
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
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Campus Protocol Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'
            }`}>
              <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-200">APC Campus Barter Protocol: </span>
                Meet your trade partner in designated campus common areas (Library Hub, Cafeteria, or Student Lounge) to inspect items and confirm conditions before finalizing your exchange.
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

            {/* Title: Large H1 */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight whitespace-normal break-words">
                {item.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Posted {item.createdAt}</span>
                <span>•</span>
                <span>{item.condition}</span>
                <span>•</span>
                <span>Used: {item.usageDuration}</span>
              </div>
            </div>

            {/* Condition & Usage Highlights Card */}
            <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-4 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Condition Rating
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                  {item.condition}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Usage Duration
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {item.usageDuration}
                </span>
              </div>
            </div>

            {/* Target Trade Box */}
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

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Item Description &amp; Details</span>
              </h3>
              <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-line break-words ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {item.description}
              </div>
            </div>

            {/* Sticky User Profile Block & Trade / Owner Action Container */}
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
                      {isOwner ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">YOU</span>
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-[11px] border border-amber-500/25">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{item.owner.rating ? item.owner.rating.toFixed(1) : '5.0'} Overall Rating</span>
                      </span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">• {item.owner.trustScore}</span>
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

              {/* Action Area: OWNER CONTROLS vs PROPOSE TRADE */}
              <div className="pt-5">
                {isOwner ? (
                  /* Owner Controls */
                  showDeleteConfirm ? (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span>Delete this marketplace listing?</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        This action will permanently delete "{item.title}" from Kalakalan. It cannot be recovered.
                      </p>
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          Yes, Delete Listing
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className={`px-4 py-2 rounded-xl border font-bold text-xs transition-all ${
                            isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        You are the owner of this active listing.
                      </div>
                      <div className="flex items-center gap-3">
                        {onEditItem && (
                          <button
                            type="button"
                            onClick={() => onEditItem(item)}
                            className="flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Listing</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="py-3.5 px-4 rounded-2xl font-bold text-sm bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  /* Non-owner trade proposal */
                  showProposalForm ? (
                    <form onSubmit={handleSendProposal} className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>Propose Your Exchange Item</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Target: {item.condition}
                        </span>
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
                          Select Your Offering Condition
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(['New', 'Like New', '2nd Hand', 'Heavily Used'] as ItemCondition[]).map((c) => (
                            <button
                              type="button"
                              key={c}
                              onClick={() => setOfferingCondition(c)}
                              className={`py-2 px-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                                offeringCondition === c
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : isDark
                                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {c}
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
                            className="flex-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
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
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
