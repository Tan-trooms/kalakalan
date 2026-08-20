import React, { useState } from 'react';
import { X, Heart, ShieldCheck, MapPin, ArrowRightLeft, Send, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import { BarterItem, ThemeMode, ValueTier } from '../types';
import { SafeImage } from './SafeImage';

interface ItemDetailModalProps {
  item: BarterItem | null;
  theme: ThemeMode;
  onClose: () => void;
  onToggleLike: (itemId: string) => void;
  onProposeTrade: (targetItem: BarterItem, offeringTitle: string, offeringTier: ValueTier) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  theme,
  onClose,
  onToggleLike,
  onProposeTrade,
}) => {
  if (!item) return null;

  const [showProposalForm, setShowProposalForm] = useState(false);
  const [offeringTitle, setOfferingTitle] = useState('');
  const [offeringTier, setOfferingTier] = useState<ValueTier>(item.tier);
  const [isSent, setIsSent] = useState(false);

  const isDark = theme === 'dark';

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringTitle.trim()) return;

    onProposeTrade(item, offeringTitle.trim(), offeringTier);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowProposalForm(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className={`relative w-full max-w-lg md:max-w-4xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col md:flex-row ${
        isDark ? 'bg-[#0B132B] text-slate-100 border border-slate-800' : 'bg-white text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Top Image Frame */}
        <div className="relative h-64 sm:h-72 md:h-auto md:w-5/12 bg-slate-950 overflow-hidden shrink-0">
          <SafeImage
            src={item.imageUrl}
            alt={item.title}
            title={item.title}
            category={item.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 md:hidden" />

          {/* Tier Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${
              item.tier === 1
                ? 'bg-emerald-600 text-white'
                : item.tier === 2
                ? 'bg-sky-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}>
              Tier {item.tier}
            </span>
          </div>

          {/* Favorite Heart */}
          <button
            onClick={() => onToggleLike(item.id)}
            className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white text-slate-800 hover:scale-110 active:scale-95 shadow-lg transition-transform"
          >
            <Heart className={`w-5 h-5 ${item.isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
          </button>
        </div>

        {/* Right / Modal Body */}
        <div className="p-6 sm:p-8 md:w-7/12 overflow-y-auto space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                <span>{item.category}</span>
                <span>•</span>
                <span>Tier {item.tier} Parity</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{item.title}</h2>

              <div className="flex items-center gap-3 mt-2.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {item.location}
                </span>
                <span>•</span>
                <span>Listed {item.createdAt}</span>
              </div>
            </div>

            {/* Owner Info & Trust Score */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-base text-slate-900 dark:text-white">
                    <span>{item.owner.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">
                    Trust Rating ★ {item.owner.trustScore}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-sm text-slate-900 dark:text-slate-200">{item.owner.completedTrades} Completed</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Student</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
                Item Description &amp; Condition
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

          {/* Proposal Action Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {showProposalForm ? (
              <form onSubmit={handleSendProposal} className={`p-5 rounded-3xl border space-y-4 ${
                isDark ? 'bg-slate-900 border-emerald-500/40' : 'bg-white border-emerald-300 shadow-sm'
              }`}>
                <h4 className="text-base font-bold flex items-center justify-between text-slate-900 dark:text-white">
                  <span>Propose Your Item in Exchange</span>
                  <span className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">Tier {item.tier} Barter</span>
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
                    Select Your Offering's Value Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { tier: 1 as ValueTier, label: 'Tier 1 (<₱2.5k)' },
                      { tier: 2 as ValueTier, label: 'Tier 2 (₱2.5k-₱7.5k)' },
                      { tier: 3 as ValueTier, label: 'Tier 3 (₱7.5k+)' },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.tier}
                        onClick={() => setOfferingTier(t.tier)}
                        className={`py-2.5 px-2 rounded-2xl text-xs font-bold border text-center transition-all ${
                          offeringTier === t.tier
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {t.label}
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
                      className="flex-2 py-3 px-5 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
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
                className="w-full py-4 px-5 rounded-2xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <ArrowRightLeft className="w-5 h-5" />
                <span>Propose a Barter Exchange</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
