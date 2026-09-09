import React, { useState, useRef } from 'react';
import { 
  X, 
  AlertTriangle, 
  UploadCloud, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Clock 
} from 'lucide-react';
import { ThemeMode } from '../types';

export interface TradeReportData {
  transaction: {
    id: string;
    timestamp?: string;
  };
  partner: {
    name: string;
    avatar?: string;
    item: {
      name: string;
      condition?: string;
      usageDuration?: string;
      image?: string;
    };
  };
  currentUser?: {
    name?: string;
  };
}

export interface TradeReportSubmitPayload {
  ticketId: string;
  transactionId: string;
  partnerName: string;
  itemName: string;
  primaryReason: string;
  description: string;
  evidenceImages: string[];
  preferredOutcome: string;
  submittedAt: string;
}

export interface TradeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
  reportData: TradeReportData;
  onSubmitSuccess?: (payload: TradeReportSubmitPayload) => void;
}

const PRIMARY_REASONS = [
  'Item is defective or not working.',
  'Item condition was misrepresented.',
  'Safety or conduct concern during the meetup.',
  'Other.',
];

export const TradeReportModal: React.FC<TradeReportModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  reportData,
  onSubmitSuccess,
}) => {
  const [primaryReason, setPrimaryReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [preferredOutcome, setPreferredOutcome] = useState<string>('');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<TradeReportSubmitPayload | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const transactionId = reportData?.transaction?.id || '#KLK-8492-APC';
  const partnerItemName = reportData?.partner?.item?.name || 'Item Received';
  const partnerName = reportData?.partner?.name || 'Trade Partner';

  const handleFilesSelect = (files: FileList | File[]) => {
    const fileList = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileList.length === 0) return;

    const availableSlots = 3 - evidenceImages.length;
    if (availableSlots <= 0) {
      setErrors((prev) => ({ ...prev, images: 'You can attach a maximum of 3 visual evidence photos.' }));
      return;
    }

    const filesToRead = fileList.slice(0, availableSlots);
    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setEvidenceImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, reader.result as string];
          });
          setErrors((prev) => {
            const next = { ...prev };
            delete next.images;
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEvidenceImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!primaryReason.trim()) {
      newErrors.primaryReason = 'Please select a primary reason for filing this dispute.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please explain the issue or defect in detail.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Please provide a more detailed explanation (minimum 15 characters).';
    }

    if (!preferredOutcome.trim()) {
      newErrors.preferredOutcome = 'Please describe your preferred resolution for our campus admins.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const generatedTicketId = `#DSP-${Date.now().toString().slice(-6)}-APC`;
    const payload: TradeReportSubmitPayload = {
      ticketId: generatedTicketId,
      transactionId,
      partnerName,
      itemName: partnerItemName,
      primaryReason,
      description: description.trim(),
      evidenceImages,
      preferredOutcome: preferredOutcome.trim(),
      submittedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket(payload);
      if (onSubmitSuccess) {
        onSubmitSuccess(payload);
      }
    }, 600);
  };

  const handleResetAndClose = () => {
    setPrimaryReason('');
    setDescription('');
    setPreferredOutcome('');
    setEvidenceImages([]);
    setErrors({});
    setSubmittedTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={submittedTicket ? handleResetAndClose : onClose} 
      />

      {/* Modal Dialog Card */}
      <div className={`relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl z-10 my-4 border transition-colors flex flex-col ${
        isDark ? 'bg-[#0b1224] text-slate-100 border-slate-800' : 'bg-white text-slate-900 border-slate-200'
      }`}>
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Dispute Resolution • 48h Window
            </span>
          </div>

          <button
            type="button"
            onClick={submittedTicket ? handleResetAndClose : onClose}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close dispute form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[82vh] p-5 sm:p-6 space-y-5">
          
          {submittedTicket ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/40 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Trade Issue Filed Successfully
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Your dispute has been logged with the Campus Student Welfare Council.
                </p>
              </div>

              {/* Ticket Details Summary Card */}
              <div className={`p-4 rounded-2xl border text-left space-y-2.5 max-w-md mx-auto text-xs ${
                isDark ? 'bg-slate-900/70 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 font-mono">
                  <span className="font-bold text-slate-400">DISPUTE TICKET:</span>
                  <span className="font-bold text-rose-500">{submittedTicket.ticketId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Transaction:</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">{submittedTicket.transactionId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reported Item:</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{submittedTicket.itemName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Primary Reason:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{submittedTicket.primaryReason}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Evidence Attached:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{submittedTicket.evidenceImages.length} photos</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Admin review scheduled within 24 hours.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Return to Receipt
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE REPORT FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. Form Header & Auto-filled Data */}
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Report a Trade Issue
                </h2>
                <div className="mt-2 p-3 rounded-2xl border flex items-center gap-2.5 text-xs bg-slate-100/70 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
                  <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0 font-medium text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Regarding Transaction: </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{transactionId}</span>
                    <span className="mx-1.5 text-slate-400">|</span>
                    <span className="font-semibold">Item: </span>
                    <span className="font-bold text-slate-900 dark:text-white truncate">{partnerItemName}</span>
                  </div>
                </div>
              </div>

              {/* 2. Issue Categorization (Primary Reason) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Primary Reason <span className="text-rose-500">*</span>
                </label>

                {/* Radio list layout */}
                <div className="space-y-2">
                  {PRIMARY_REASONS.map((reason) => {
                    const isSelected = primaryReason === reason;
                    return (
                      <label
                        key={reason}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? isDark
                              ? 'bg-rose-500/10 border-rose-500/60 text-white'
                              : 'bg-rose-50 border-rose-400 text-rose-950'
                            : isDark
                            ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="primaryReason"
                          value={reason}
                          checked={isSelected}
                          onChange={(e) => {
                            setPrimaryReason(e.target.value);
                            if (errors.primaryReason) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.primaryReason;
                                return next;
                              });
                            }
                          }}
                          className="w-4 h-4 accent-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold">{reason}</span>
                      </label>
                    );
                  })}
                </div>

                {errors.primaryReason && (
                  <p className="text-[11px] font-semibold text-rose-500 mt-1">
                    {errors.primaryReason}
                  </p>
                )}
              </div>

              {/* 3. Evidence & Details: Description Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="report-description"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Problem Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {description.length} chars
                  </span>
                </div>
                <textarea
                  id="report-description"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.description;
                        return next;
                      });
                    }
                  }}
                  placeholder="Explain the problem in detail (e.g. device does not boot, missing accessories that were agreed upon, physical defect not mentioned in the post)..."
                  className={`w-full p-3 rounded-2xl text-xs border outline-none transition-colors ${
                    errors.description 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : isDark
                      ? 'bg-slate-900/80 border-slate-800 text-white focus:border-rose-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-rose-500'
                  }`}
                />
                {errors.description && (
                  <p className="text-[11px] font-semibold text-rose-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* 3. Evidence & Details: Photo Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Attach Evidence Photos
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {evidenceImages.length} / 3 images
                  </span>
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (evidenceImages.length < 3) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                    evidenceImages.length >= 3
                      ? 'opacity-50 cursor-not-allowed border-slate-300 dark:border-slate-800'
                      : isDragging
                      ? 'border-rose-500 bg-rose-500/10'
                      : isDark
                      ? 'border-slate-800 bg-slate-900/40 hover:border-rose-500/60 hover:bg-slate-900/80'
                      : 'border-slate-300 bg-slate-50 hover:border-rose-400 hover:bg-slate-100/80'
                  }`}
                >
                  <UploadCloud className="w-6 h-6 text-rose-500" />
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {evidenceImages.length >= 3 
                      ? 'Maximum of 3 evidence photos reached' 
                      : 'Drop visual proof photos here or click to browse'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Supports JPG, PNG, WEBP (Visual proof of defect or misrepresentation)
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={evidenceImages.length >= 3}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFilesSelect(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>

                {errors.images && (
                  <p className="text-[11px] font-semibold text-rose-500">
                    {errors.images}
                  </p>
                )}

                {/* Preview Thumbnail Grid */}
                {evidenceImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {evidenceImages.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group bg-slate-950"
                      >
                        <img
                          src={imgSrc}
                          alt={`Evidence proof ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="p-1 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/60 text-white">
                          Proof #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Resolution & Submission: Preferred Outcome */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="report-outcome"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Preferred Resolution / Outcome <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="report-outcome"
                  rows={2}
                  value={preferredOutcome}
                  onChange={(e) => {
                    setPreferredOutcome(e.target.value);
                    if (errors.preferredOutcome) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.preferredOutcome;
                        return next;
                      });
                    }
                  }}
                  placeholder="e.g., Please mediate a reverse trade so I get my item back, or I just want this user warned for misrepresenting condition..."
                  className={`w-full p-3 rounded-2xl text-xs border outline-none transition-colors ${
                    errors.preferredOutcome 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : isDark
                      ? 'bg-slate-900/80 border-slate-800 text-white focus:border-rose-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-rose-500'
                  }`}
                />
                {errors.preferredOutcome && (
                  <p className="text-[11px] font-semibold text-rose-500">
                    {errors.preferredOutcome}
                  </p>
                )}
              </div>

              {/* Disclaimer Text */}
              <div className="p-3 rounded-2xl border text-[11px] leading-relaxed bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <p>
                  Filing a false report violates community guidelines. Platform admins will review this ticket within 24 hours.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isDark 
                      ? 'hover:bg-slate-800 text-slate-300' 
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting Ticket...' : 'Submit Report'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
