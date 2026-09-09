import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  ArrowRightLeft, 
  Send, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Sparkles,
  Camera,
  UserCheck,
  Maximize2,
  Star
} from 'lucide-react';
import { BarterItem, ThemeMode, ItemCondition, UserProfile } from '../types';
import { SafeImage } from './SafeImage';
import { ImageLightboxModal } from './ImageLightboxModal';

interface ItemDetailModalProps {
  item: BarterItem | null;
  theme: ThemeMode;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onToggleLike: (itemId: string) => void;
  onProposeTrade: (targetItem: BarterItem, offeringTitle: string, offeringCondition: ItemCondition) => void;
  onEditItem?: (item: BarterItem) => void;
  onDeleteItem?: (itemId: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  theme,
  currentUser,
  onClose,
  onToggleLike,
  onProposeTrade,
  onEditItem,
  onDeleteItem,
}) => {
  if (!item) return null;

  const isDark = theme === 'dark';
  const isOwner = !!currentUser && currentUser.id === item.owner.id;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [offeringTitle, setOfferingTitle] = useState('');
  const [offeringCondition, setOfferingCondition] = useState<ItemCondition>('Like New');
  const [isSent, setIsSent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Normalize images array
  const images = (item.images && item.images.length > 0) 
    ? item.images 
    : [item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'];

  const currentImage = images[activeImageIndex] || images[0];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringTitle.trim()) return;

    onProposeTrade(item, offeringTitle.trim(), offeringCondition);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowProposalForm(false);
      onClose();
    }, 1200);
  };

  const handleDelete = () => {
    if (onDeleteItem) {
      onDeleteItem(item.id);
      onClose();
    }
  };

  const renderConditionBadge = (cond: ItemCondition) => {
    switch (cond) {
      case 'New':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md bg-emerald-600 text-white">
            Brand New
          </span>
        );
      case 'Like New':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md bg-sky-600 text-white">
            Like New
          </span>
        );
      case '2nd Hand':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md bg-amber-600 text-white">
            2nd Hand
          </span>
        );
      case 'Heavily Used':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md bg-purple-600 text-white">
            Heavily Used
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className={`relative w-full max-w-lg md:max-w-4xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col md:flex-row ${
        isDark ? 'bg-[#0B132B] text-slate-100 border border-slate-800' : 'bg-white text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Top Image Gallery */}
        <div className="relative h-72 sm:h-80 md:h-auto md:w-5/12 bg-slate-950 overflow-hidden shrink-0 flex flex-col justify-between group">
          <div
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
            title="Click to view uncropped full image"
          >
            <SafeImage
              src={currentImage}
              alt={item.title}
              title={item.title}
              category={item.category}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 md:from-black/50" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {renderConditionBadge(item.condition)}
              {isOwner && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide shadow-md bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  YOUR LISTING
                </span>
              )}
            </div>

            {/* Click to expand uncropped badge / button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="absolute top-4 right-14 px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/20 transition-colors shadow-lg cursor-pointer"
              title="Expand uncropped photo"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand</span>
              {images.length > 1 && (
                <span className="text-slate-300">({activeImageIndex + 1}/{images.length})</span>
              )}
            </button>

            {/* Image Navigation Arrows */}
            {images.length > 1 && (
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white pointer-events-auto backdrop-blur-xs transition-all active:scale-95"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white pointer-events-auto backdrop-blur-xs transition-all active:scale-95"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Favorite Heart (for non-owners) */}
            {!isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(item.id);
                }}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white text-slate-800 hover:scale-110 active:scale-95 shadow-lg transition-transform z-10"
              >
                <Heart className={`w-5 h-5 ${item.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
              </button>
            )}

            {/* Usage Duration tag on photo bottom-left */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-black/75 text-emerald-300 backdrop-blur-md flex items-center gap-1.5 border border-emerald-500/30">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Used: {item.usageDuration}</span>
              </span>
            </div>
          </div>

          {/* Thumbnail Strip for Multi-Images */}
          {images.length > 1 && (
            <div className="p-2 bg-slate-950/90 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-emerald-500 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right / Modal Body */}
        <div className="p-6 sm:p-8 md:w-7/12 overflow-y-auto space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                <span>{item.category}</span>
                <span>•</span>
                <span>{item.condition}</span>
                <span>•</span>
                <span>{item.usageDuration}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h2>

              <div className="flex items-center gap-3 mt-2.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {item.location}
                </span>
                <span>•</span>
                <span>Listed {item.createdAt}</span>
              </div>
            </div>

            {/* Owner Info & Trust Metrics */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 dark:text-white">
                    <span className="truncate">{item.owner.name}</span>
                    {isOwner ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black shrink-0">YOU</span>
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black text-xs border border-amber-500/30 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{item.owner.rating ? item.owner.rating.toFixed(1) : '5.0'} Overall Rating</span>
                    </span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                      • {item.owner.trustScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{item.owner.completedTrades} Barters</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Ram
                </div>
              </div>
            </div>

            {/* Condition & Usage Highlights Box */}
            <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-4 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'
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

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
                Item Description &amp; Details
              </h4>
              <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {item.description}
              </p>
            </div>

            {/* Desired Trade / Wanted items */}
            <div className={`p-4 rounded-2xl border ${
              isDark 
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' 
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                Trader is Looking For
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {item.wantedItems}
              </p>
            </div>
          </div>

          {/* Bottom Actions Section: OWNER CONTROLS vs PROPOSE BARTER */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {isOwner ? (
              /* Owner CRUD Actions (Edit & Delete) */
              <div>
                {showDeleteConfirm ? (
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
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
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
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
                      <span>Listing Management (You are the owner)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (onEditItem) {
                            onClose();
                            onEditItem(item);
                          }
                        }}
                        className="flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Listing</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="py-3.5 px-4 rounded-2xl font-bold text-sm bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Non-Owner Trade Proposal Section */
              showProposalForm ? (
                <form onSubmit={handleSendProposal} className={`p-5 rounded-3xl border space-y-4 ${
                  isDark ? 'bg-slate-900 border-emerald-500/40' : 'bg-white border-emerald-300 shadow-sm'
                }`}>
                  <h4 className="text-base font-bold flex items-center justify-between text-slate-900 dark:text-white">
                    <span>Propose Your Item in Exchange</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Target: {item.condition}
                    </span>
                  </h4>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-1.5">
                      What item will you offer to {item.owner.name}? *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Raspberry Pi 4 Kit, Mechanical Keyboard, or CS Textbook"
                      value={offeringTitle}
                      onChange={(e) => setOfferingTitle(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl text-base border outline-none transition-all ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500' 
                          : 'bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-1.5">
                      Select Your Item's Condition
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['New', 'Like New', '2nd Hand', 'Heavily Used'] as ItemCondition[]).map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setOfferingCondition(c)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                            offeringCondition === c
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : isDark
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isSent ? (
                    <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-base shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                      Barter Proposal Sent! Opening Chat...
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowProposalForm(false)}
                        className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold border transition-colors ${
                          isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-2 py-3 px-5 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        Send Barter Proposal
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <button
                  onClick={() => setShowProposalForm(true)}
                  className="w-full py-4 px-5 rounded-2xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                  <span>Propose a Barter Exchange</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Uncropped Image Lightbox Modal */}
      <ImageLightboxModal
        images={images}
        initialIndex={activeImageIndex}
        title={item.title}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
};
