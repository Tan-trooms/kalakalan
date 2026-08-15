import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, UploadCloud, X, Sparkles, Image as ImageIcon, ArrowLeft, LogIn, ShieldCheck, MapPin, ArrowRightLeft } from 'lucide-react';
import { BarterItem, ItemCategory, ThemeMode, ValueTier, UserProfile } from '../types';
import { CURRENT_USER, CATEGORIES } from '../data/mockData';
import { SVG_PRODUCT_COVERS } from '../data/productImages';
import { SafeImage } from './SafeImage';

interface UploadViewProps {
  theme: ThemeMode;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  onPostSuccess: (item: BarterItem) => void;
  onCancel?: () => void;
}

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'CS Textbook (CLRS)',
    url: SVG_PRODUCT_COVERS.clrs,
    tier: 1 as ValueTier,
    category: 'CS Textbooks' as ItemCategory,
  },
  {
    name: 'Keychron Keyboard',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    tier: 2 as ValueTier,
    category: 'IT & Dev Hardware' as ItemCategory,
  },
  {
    name: 'Tablet / Hardware',
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    tier: 3 as ValueTier,
    category: 'Electronics' as ItemCategory,
  },
];

export const UploadView: React.FC<UploadViewProps> = ({
  theme,
  currentUser,
  onOpenAuthModal,
  onPostSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wantedItems, setWantedItems] = useState('');
  const [selectedTier, setSelectedTier] = useState<ValueTier>(2);
  const [category, setCategory] = useState<ItemCategory>('CS Textbooks');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!currentUser && onOpenAuthModal) {
      onOpenAuthModal('login');
      return;
    }

    setIsSubmitting(true);

    const fallbackImg = imagePreview || SAMPLE_PRESET_IMAGES[selectedTier - 1].url;
    const activeOwner = currentUser || CURRENT_USER;

    const newItem: BarterItem = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Well maintained item ready for fair barter exchange on campus.',
      category,
      tier: selectedTier,
      imageUrl: fallbackImg,
      owner: activeOwner,
      location: activeOwner.location || 'Student Union / Campus Center',
      wantedItems: wantedItems.trim() || 'Open to equal tier trades',
      createdAt: 'Just now',
      isLiked: false,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        onPostSuccess(newItem);
      }, 800);
    }, 600);
  };

  const currentPreviewImage = imagePreview || SAMPLE_PRESET_IMAGES[selectedTier - 1].url;
  const activeOwner = currentUser || CURRENT_USER;

  return (
    <div className={`pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Title & Subtitle */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Post an Item for Barter
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            List items you no longer need and request fair exchanges with fellow students.
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Guest Notice */}
      {!currentUser && (
        <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="text-xs">
            <div className="font-bold text-sm">Posting as Guest</div>
            <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Sign in with your verified campus account to build your Trust Score and get faster trade responses.
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in to Account</span>
            </button>
          )}
        </div>
      )}

      {/* 2-Column Responsive Layout on Desktop */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Dropzone & Live Marketplace Card Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Image Upload Box */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Item Photo
            </label>
            
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-60 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : imagePreview
                  ? isDark
                    ? 'border-slate-700 bg-slate-900'
                    : 'border-slate-300 bg-white'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-2">
                    <Camera className="w-5 h-5" />
                    <span>Change Photo</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold">
                    Drop your image here or <span className="text-emerald-600 dark:text-emerald-400 underline">browse</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Or pick a quick sample cover:</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImagePreview(preset.url);
                      setCategory(preset.category);
                      setSelectedTier(preset.tier);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 shrink-0 transition-all ${
                      imagePreview === preset.url
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : isDark
                        ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Marketplace Preview
            </label>
            <div className={`rounded-2xl overflow-hidden border transition-all ${
              isDark ? 'bg-[#111c38] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <SafeImage
                  src={currentPreviewImage}
                  alt={title || 'Item Preview'}
                  title={title || 'Item Preview'}
                  category={category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-xs ${
                    selectedTier === 1 ? 'bg-emerald-600' : selectedTier === 2 ? 'bg-sky-600' : 'bg-indigo-600'
                  }`}>
                    Tier {selectedTier}
                  </span>
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {category}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="font-bold text-base tracking-tight truncate">
                  {title.trim() || 'Untitled Listing'}
                </h4>
                <p className="text-xs line-clamp-2 text-slate-400">
                  {description.trim() || 'Enter item details and condition description on the right.'}
                </p>
                <div className={`p-2 rounded-lg text-[11px] font-medium truncate ${
                  isDark ? 'bg-slate-900 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  <span className="font-bold">Want: </span>
                  {wantedItems.trim() || 'What you want in return'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Form Fields */}
        <div className="lg:col-span-7 space-y-5">
          {/* Item Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Introduction to Algorithms (CLRS 4th Ed) or Raspberry Pi 4 Kit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm border outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white' 
                  : 'bg-white border-slate-200 focus:border-emerald-600 text-slate-900'
              }`}
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm border outline-none cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Value Tier Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Value Tier Classification
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { tier: 1 as ValueTier, name: 'Tier 1', range: 'Under $50', desc: 'Textbooks, cables, tools' },
                { tier: 2 as ValueTier, name: 'Tier 2', range: '$50 - $150', desc: 'Keyboards, dev kits, parts' },
                { tier: 3 as ValueTier, name: 'Tier 3', range: '$150+', desc: 'Laptops, GPUs, displays' },
              ].map((t) => (
                <div
                  key={t.tier}
                  onClick={() => setSelectedTier(t.tier)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedTier === t.tier
                      ? isDark
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-emerald-600 bg-emerald-50'
                      : isDark
                      ? 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{t.name}</span>
                    {selectedTier === t.tier && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{t.range}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wanted Items */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              What do you want in exchange? (Desired Trade Items) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Open to Linear Algebra book, Keychron keyboard, or Arduino sensor kit"
              value={wantedItems}
              onChange={(e) => setWantedItems(e.target.value)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm border outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white' 
                  : 'bg-white border-slate-200 focus:border-emerald-600 text-slate-900'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Description &amp; Condition Details
            </label>
            <textarea
              rows={4}
              placeholder="Describe condition, edition, included accessories, and meetup preferences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full py-2.5 px-4 rounded-xl text-sm border outline-none transition-all resize-none ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white' 
                  : 'bg-white border-slate-200 focus:border-emerald-600 text-slate-900'
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className={`w-full py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] ${
                title.trim() && !isSubmitting
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span>Publishing listing...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Barter Listing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
