import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRightLeft, ShieldCheck, MapPin, QrCode, Star, Sparkles } from 'lucide-react';
import { TradeMatch, ThemeMode } from '../types';

interface TradeFinalizeModalProps {
  match: TradeMatch | null;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onConfirmFinalize: (matchId: string) => void;
}

export const TradeFinalizeModal: React.FC<TradeFinalizeModalProps> = ({
  match,
  isOpen,
  onClose,
  theme,
  onConfirmFinalize,
}) => {
  if (!isOpen || !match) return null;

  const [step, setStep] = useState<'review' | 'success'>('review');
  const [rating, setRating] = useState(5);
  const [checkedChecks, setCheckedChecks] = useState({
    condition: true,
    location: true,
    terms: true,
  });

  const isDark = theme === 'dark';

  const handleFinalize = () => {
    setStep('success');
    onConfirmFinalize(match.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl z-10 p-6 ${
        isDark ? 'bg-[#0e172e] text-slate-100 border border-slate-800' : 'bg-white text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'review' ? (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Secure Barter Finalization
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Finalize Trade Agreement
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Both traders confirm the exchange of items at fair tier equivalence.
              </p>
            </div>

            {/* Visual Exchange comparison */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* My item */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-1.5 bg-slate-800 border border-slate-700">
                  <img src={match.myOffering.imageUrl} alt={match.myOffering.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{match.myOffering.title}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Tier {match.myOffering.tier}</div>
              </div>

              <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ArrowRightLeft className="w-5 h-5" />
              </div>

              {/* Their item */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-1.5 bg-slate-800 border border-slate-700">
                  <img src={match.theirOffering.imageUrl} alt={match.theirOffering.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{match.theirOffering.title}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Tier {match.theirOffering.tier}</div>
              </div>
            </div>

            {/* Meetup summary */}
            <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
              isDark ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Agreed Meetup: Student Union Campus Center (2:00 PM)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-5.5 font-medium">
                Trader: {match.partner.name} • {match.partner.trustScore}
              </div>
            </div>

            {/* Safety checklist */}
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={checkedChecks.condition}
                  onChange={(e) => setCheckedChecks({ ...checkedChecks, condition: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>I have verified the condition and details of the traded item.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={checkedChecks.location}
                  onChange={(e) => setCheckedChecks({ ...checkedChecks, location: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>I agree to the designated safe campus exchange spot.</span>
              </label>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleFinalize}
              disabled={!checkedChecks.condition || !checkedChecks.location}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                checkedChecks.condition && checkedChecks.location
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.99]'
                  : 'opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirm & Finalize Barter
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Barter Finalized!</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                You and {match.partner.name} have successfully confirmed this trade.
              </p>
            </div>

            {/* Verification QR Checkpoint */}
            <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <QrCode className="w-24 h-24 text-emerald-600 dark:text-emerald-400 mb-2" />
              <div className="text-xs font-mono font-bold tracking-widest text-slate-700 dark:text-slate-300">
                TRADE ID: #KK-{match.id.toUpperCase()}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Show this QR at the campus handover point.
              </div>
            </div>

            {/* Rate trader */}
            <div>
              <div className="text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                Rate your trading experience with {match.partner.name}
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md"
            >
              Done & Return to Market
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
