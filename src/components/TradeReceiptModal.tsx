import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowRightLeft, 
  Star, 
  Download, 
  Mail, 
  AlertTriangle, 
  Leaf, 
  Flame, 
  Share2, 
  Printer, 
  Archive,
  Sparkles,
  QrCode,
  Check
} from 'lucide-react';
import { ThemeMode } from '../types';
import { TradeReportModal, TradeReportData, TradeReportSubmitPayload } from './TradeReportModal';

export interface TradeReceiptData {
  transaction: {
    id: string;
    timestamp: string;
    status?: string;
  };
  currentUser: {
    name: string;
    avatar?: string;
    item: {
      name: string;
      condition: string;
      usageDuration: string;
      image?: string;
    };
    tradeStreak?: number;
  };
  partner: {
    name: string;
    avatar?: string;
    item: {
      name: string;
      condition: string;
      usageDuration: string;
      image?: string;
    };
  };
  meetup: {
    location: string;
    time: string;
    confirmedNote?: string;
  };
}

interface TradeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
  receiptData?: Partial<TradeReceiptData>;
}

export const TradeReceiptModal: React.FC<TradeReceiptModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  receiptData,
}) => {
  // Interactive state
  const [accuracyRating, setAccuracyRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submittedDispute, setSubmittedDispute] = useState<TradeReportSubmitPayload | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  // Dynamic fallback data matching APC Kalakalan barter schema
  const data: TradeReceiptData = {
    transaction: {
      id: receiptData?.transaction?.id || '#KLK-8492-APC',
      timestamp: receiptData?.transaction?.timestamp || 'September 9, 2026 | 3:38 PM',
      status: receiptData?.transaction?.status || 'VERIFIED & COMPLETED',
    },
    currentUser: {
      name: receiptData?.currentUser?.name || 'Tristan G.',
      avatar: receiptData?.currentUser?.avatar,
      item: {
        name: receiptData?.currentUser?.item?.name || 'UniFi 8-Port PoE Switch',
        condition: receiptData?.currentUser?.item?.condition || '2nd Hand',
        usageDuration: receiptData?.currentUser?.item?.usageDuration || '1 Year',
        image: receiptData?.currentUser?.item?.image,
      },
      tradeStreak: receiptData?.currentUser?.tradeStreak ?? 3,
    },
    partner: {
      name: receiptData?.partner?.name || 'Jordan W.',
      avatar: receiptData?.partner?.avatar,
      item: {
        name: receiptData?.partner?.item?.name || '2x 4TB WD Red Plus NAS Drives',
        condition: receiptData?.partner?.item?.condition || '2nd Hand',
        usageDuration: receiptData?.partner?.item?.usageDuration || '6 Months',
        image: receiptData?.partner?.item?.image,
      },
    },
    meetup: {
      location: receiptData?.meetup?.location || 'Asia Pacific College - Cafeteria',
      time: receiptData?.meetup?.time || '2:00 PM',
      confirmedNote: receiptData?.meetup?.confirmedNote || 'Both parties clicked "Finalize Trade"',
    },
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDownloadPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showNotification(`Receipt ${data.transaction.id}.pdf generated & downloaded`);
      try {
        window.print();
      } catch {
        // Fallback for environments where window.print is blocked
      }
    }, 600);
  };

  const handleEmailReceipt = () => {
    showNotification(`Digital receipt dispatched to registered student email.`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedRating(true);
    showNotification('Thank you! Trader rating recorded on the campus ledger.');
  };

  const handleDisputeSuccess = (payload: TradeReportSubmitPayload) => {
    setSubmittedDispute(payload);
    showNotification(`Dispute ticket ${payload.ticketId} filed successfully.`);
  };

  const reportModalData: TradeReportData = {
    transaction: {
      id: data.transaction.id,
      timestamp: data.transaction.timestamp,
    },
    partner: {
      name: data.partner.name,
      avatar: data.partner.avatar,
      item: {
        name: data.partner.item.name,
        condition: data.partner.item.condition,
        usageDuration: data.partner.item.usageDuration,
        image: data.partner.item.image,
      },
    },
    currentUser: {
      name: data.currentUser.name,
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 pointer-events-none">
          <div className="p-3 rounded-2xl bg-emerald-800 text-white shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-emerald-500/40 animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Grab-Style Receipt Card */}
      <div className={`relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl z-10 my-4 border transition-colors flex flex-col ${
        isDark ? 'bg-[#0a0f1d] text-slate-100 border-slate-800' : 'bg-white text-slate-900 border-slate-200'
      }`}>
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Archive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>OFFICIAL TRADE LEDGER</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Utility */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Download Receipt as PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Email Utility */}
            <button
              type="button"
              onClick={handleEmailReceipt}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Send to student email"
            >
              <Mail className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">Email</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close receipt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="overflow-y-auto max-h-[82vh] p-5 sm:p-7 space-y-6">
          
          {/* TASK 1: HEADER SECTION (Grab-Style Header) */}
          <div className="text-center space-y-2 pb-4 border-b border-dashed border-slate-300 dark:border-slate-800">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{data.transaction.status}</span>
            </div>

            {/* App Brand & Tagline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-slate-900 dark:text-white uppercase font-mono">
                KALAKALAN
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
                Trade securely. Trade locally.
              </p>
            </div>

            {/* Transaction ID & Timestamp */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <div>
                <span className="font-semibold text-slate-400 dark:text-slate-500">TX ID: </span>
                <span className="font-bold text-slate-900 dark:text-slate-200">{data.transaction.id}</span>
              </div>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.transaction.timestamp}</span>
              </div>
            </div>
          </div>

          {/* TASK 1: THE EXCHANGE (Two-Column Flex Layout) */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>The Exchange Record</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Peer-to-Peer Verified
              </span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* Column 1: Current User */}
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{data.currentUser.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">YOU</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Provided</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {data.currentUser.item.name}
                  </h4>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[10px] shadow-2xs">
                      {data.currentUser.item.condition}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                      Used: <strong className="text-slate-700 dark:text-slate-300">{data.currentUser.item.usageDuration}</strong>
                    </span>
                  </div>
                </div>

                {/* Direct Swap Indicator for Small Screens */}
                <div className="md:hidden flex justify-center -my-2 text-emerald-500">
                  <ArrowRightLeft className="w-4 h-4 rotate-90" />
                </div>

                {/* Column 2: Trade Partner */}
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{data.partner.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Received</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {data.partner.item.name}
                  </h4>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[10px] shadow-2xs">
                      {data.partner.item.condition}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                      Used: <strong className="text-slate-700 dark:text-slate-300">{data.partner.item.usageDuration}</strong>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* TASK 1: MEETUP DETAILS */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Handover &amp; Meetup Verification
            </div>

            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-slate-400 font-medium">Agreed Location: </span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.meetup.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="flex-1">
                  <span className="text-slate-400 font-medium">Agreed Time: </span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.meetup.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Confirmation: {data.meetup.confirmedNote}
                </span>
              </div>
            </div>
          </div>

          {/* TASK 2: INTERACTIVE POST-TRADE FEATURES */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Rate Your Trader Experience
              </h3>
              {hasSubmittedRating && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Submitted
                </span>
              )}
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              {/* Metric 1: Item Accuracy */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/50">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Item Accuracy
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Was the condition exactly as described?
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={hasSubmittedRating}
                      onClick={() => setAccuracyRating(star)}
                      className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer disabled:cursor-default"
                    >
                      <Star className={`w-5 h-5 ${
                        star <= accuracyRating 
                          ? 'fill-amber-400 text-amber-500' 
                          : 'text-slate-300 dark:text-slate-700'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric 2: Punctuality */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/50">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {data.partner.name}'s Punctuality
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Did they arrive at the agreed time and spot?
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={hasSubmittedRating}
                      onClick={() => setPunctualityRating(star)}
                      className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer disabled:cursor-default"
                    >
                      <Star className={`w-5 h-5 ${
                        star <= punctualityRating 
                          ? 'fill-amber-400 text-amber-500' 
                          : 'text-slate-300 dark:text-slate-700'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {!hasSubmittedRating ? (
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  Submit Trader Review
                </button>
              ) : (
                <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium py-1">
                  Ratings: Accuracy ({accuracyRating}★) • Punctuality ({punctualityRating}★)
                </div>
              )}
            </form>

            {/* Dispute / Report Button */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  {submittedDispute ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Dispute Active ({submittedDispute.ticketId})</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report an Issue</span>
                    </button>
                  )}
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Active for 24-48 hours after trade to flag defective or non-working items.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {submittedDispute ? submittedDispute.ticketId : 'TICKET: #DSP-WINDOW-48H'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* TASK 3: GAMIFICATION & SAFETY FOOTER */}
          <div className="space-y-3 pt-2">
            
            {/* Eco-Stats Banner */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              isDark 
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <span>Campus Eco-Impact</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-black">
                    <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                    {data.currentUser.tradeStreak} STREAK
                  </span>
                </div>
                <p className="text-xs font-medium text-emerald-800/90 dark:text-emerald-200/90 mt-0.5 leading-snug">
                  By bartering this item, you helped reduce campus e-waste! You are on a {data.currentUser.tradeStreak}-trade streak.
                </p>
              </div>
            </div>

            {/* Safe-Zone Guidelines Boilerplate */}
            <div className={`p-3.5 rounded-2xl border text-[11px] leading-relaxed ${
              isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <p className="font-medium">
                Please inspect items thoroughly before leaving the campus meetup spot. This digital receipt serves as official proof of a mutually agreed and finalized barter on the Kalakalan platform. This conversation is now archived.
              </p>
            </div>

          </div>

          {/* Bottom Receipt Barcode Mock / Export Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-dashed border-slate-300 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              <QrCode className="w-4 h-4 text-slate-400" />
              <span>DIGITAL HASH: 8f92-apc-ram-ledger</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic 48-Hour Dispute Resolution Modal */}
      <TradeReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        theme={theme}
        reportData={reportModalData}
        onSubmitSuccess={handleDisputeSuccess}
      />
    </div>
  );
};
