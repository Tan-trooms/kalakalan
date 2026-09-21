import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  UploadCloud, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowLeft, 
  LogIn, 
  ShieldCheck, 
  MapPin, 
  ArrowRightLeft, 
  Trash2, 
  Star, 
  Plus, 
  Clock, 
  Check,
  AlertCircle
} from 'lucide-react';
import { BarterItem, ItemCategory, ThemeMode, ItemCondition, UserProfile } from '../types';
import { CURRENT_USER, CATEGORIES } from '../data/mockData';
import { SVG_PRODUCT_COVERS } from '../data/productImages';
import { SafeImage } from './SafeImage';

interface UploadViewProps {
  theme: ThemeMode;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  onPostSuccess: (item: BarterItem) => void;
  onCancel?: () => void;
  editingItem?: BarterItem | null;
  onUpdateSuccess?: (item: BarterItem) => void;
}

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'CS Textbook (CLRS)',
    category: 'CS Textbooks' as ItemCategory,
    condition: 'New' as ItemCondition,
    usage: 'Never used (Brand New)',
    images: [
      SVG_PRODUCT_COVERS.clrs,
      'https://images.unsplash.com/photo-1532012164546-f432f2e3edd8?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Custom Keyboard',
    category: 'IT & Dev Hardware' as ItemCategory,
    condition: 'Like New' as ItemCondition,
    usage: '2 months',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Raspberry Pi Kit',
    category: 'IT & Dev Hardware' as ItemCategory,
    condition: 'Like New' as ItemCondition,
    usage: '3 months',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Tablet / Hardware',
    category: 'Electronics' as ItemCategory,
    condition: '2nd Hand' as ItemCondition,
    usage: '1 year',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    ],
  },
];

const CONDITION_OPTIONS: { condition: ItemCondition; label: string; desc: string; color: string }[] = [
  {
    condition: 'New',
    label: 'Brand New',
    desc: 'Sealed or completely unused, original box/tags',
    color: 'emerald',
  },
  {
    condition: 'Like New',
    label: 'Like New',
    desc: 'Flawless condition, zero to minimal cosmetic signs',
    color: 'sky',
  },
  {
    condition: '2nd Hand',
    label: '2nd Hand (Good)',
    desc: 'Normal cosmetic wear, 100% fully functional',
    color: 'amber',
  },
  {
    condition: 'Heavily Used',
    label: 'Heavily Used',
    desc: 'Noticeable cosmetic wear or blemishes, working order',
    color: 'purple',
  },
];

const USAGE_SUGGESTIONS = [
  'Never used (Brand New)',
  '< 1 Month',
  '2 - 3 Months',
  '6 Months',
  '1 Semester',
  '1 Year',
  '2+ Years',
];

export const UploadView: React.FC<UploadViewProps> = ({
  theme,
  currentUser,
  onOpenAuthModal,
  onPostSuccess,
  onCancel,
  editingItem,
  onUpdateSuccess,
}) => {
  const isDark = theme === 'dark';
  const isEditing = !!editingItem;

  const [title, setTitle] = useState(editingItem?.title || '');
  const [description, setDescription] = useState(editingItem?.description || '');
  const [wantedItems, setWantedItems] = useState(editingItem?.wantedItems || '');
  const [condition, setCondition] = useState<ItemCondition | null>(editingItem?.condition || null);
  const [usageDuration, setUsageDuration] = useState(editingItem?.usageDuration || '');
  const [category, setCategory] = useState<ItemCategory | ''>(editingItem?.category || '');
  const [images, setImages] = useState<string[]>(() => {
    if (editingItem?.images && editingItem.images.length > 0) {
      return [...editingItem.images];
    }
    if (editingItem?.imageUrl) {
      return [editingItem.imageUrl];
    }
    return [SAMPLE_PRESET_IMAGES[1].images[0]];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [conditionError, setConditionError] = useState<string | null>(null);
  const [wantedItemsError, setWantedItemsError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // When editingItem changes, update form fields
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setWantedItems(editingItem.wantedItems);
      setCondition(editingItem.condition || null);
      setUsageDuration(editingItem.usageDuration || '');
      setCategory(editingItem.category || '');
      setImages(editingItem.images?.length ? [...editingItem.images] : editingItem.imageUrl ? [editingItem.imageUrl] : []);
      setDescriptionError(null);
      setConditionError(null);
      setWantedItemsError(null);
    }
  }, [editingItem]);

  const handleFilesSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
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
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const item = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [item, ...rest];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setDescriptionError(null);
    setConditionError(null);
    setWantedItemsError(null);

    let hasError = false;

    if (!description.trim()) {
      setDescriptionError('Please provide a description before publishing.');
      hasError = true;
    }

    if (!wantedItems.trim()) {
      setWantedItemsError('Please specify what you want in exchange before publishing.');
      hasError = true;
    }

    if (!condition) {
      setConditionError('Please select an item condition.');
      hasError = true;
    }

    if (!title.trim()) {
      setValidationError('Please provide a listing title.');
      hasError = true;
    } else if (!usageDuration.trim()) {
      setValidationError('Please specify how long this item has been used (Usage Duration).');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (!currentUser && onOpenAuthModal) {
      onOpenAuthModal('login');
      return;
    }

    const activeImages = images.length > 0 ? images : [SAMPLE_PRESET_IMAGES[1].images[0]];
    const activeOwner = currentUser || CURRENT_USER;

    setIsSubmitting(true);

    if (isEditing && editingItem && onUpdateSuccess) {
      const updatedItem: BarterItem = {
        ...editingItem,
        title: title.trim(),
        description: description.trim(),
        category: (category as ItemCategory) || 'CS Textbooks',
        condition: condition as ItemCondition,
        usageDuration: usageDuration.trim(),
        images: activeImages,
        imageUrl: activeImages[0],
        wantedItems: wantedItems.trim(),
        updatedAt: 'Just now',
      };

      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessToast(true);
        setTimeout(() => {
          onUpdateSuccess(updatedItem);
        }, 600);
      }, 500);
      return;
    }

    const newItem: BarterItem = {
      id: `item-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: (category as ItemCategory) || 'CS Textbooks',
      condition: condition as ItemCondition,
      usageDuration: usageDuration.trim(),
      images: activeImages,
      imageUrl: activeImages[0],
      owner: activeOwner,
      location: activeOwner.location || 'Student Union / Campus Center',
      wantedItems: wantedItems.trim(),
      createdAt: 'Just now',
      isLiked: false,
      status: 'active',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        onPostSuccess(newItem);
      }, 600);
    }, 500);
  };

  const currentCover = images[0] || SAMPLE_PRESET_IMAGES[1].images[0];

  const renderConditionPill = (c: ItemCondition | null) => {
    if (!c) {
      return (
        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-950/70 text-slate-300 backdrop-blur-md border border-white/15">
          Select Condition
        </span>
      );
    }
    switch (c) {
      case 'New':
        return (
          <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-xs">
            New
          </span>
        );
      case 'Like New':
        return (
          <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-sky-500 text-slate-950 shadow-xs">
            Like New
          </span>
        );
      case '2nd Hand':
        return (
          <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 shadow-xs">
            2nd Hand
          </span>
        );
      case 'Heavily Used':
        return (
          <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-purple-500 text-white shadow-xs">
            Heavily Used
          </span>
        );
    }
  };

  return (
    <div className={`pb-36 pt-6 sm:pt-8 px-5 sm:px-8 lg:px-10 max-w-4xl mx-auto w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Title & Subtitle */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isEditing ? 'Edit Barter Listing' : 'Post an Item for Barter'}
            </h1>
            {isEditing && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Editing
              </span>
            )}
          </div>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {isEditing
              ? 'Update item specifications, condition rating, photos, and desired swaps.'
              : 'List items you no longer need and arrange fair swaps with fellow APC students.'}
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            type="button"
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              Sign in with your verified campus account to manage listings, build your Trust Score, and get faster trade responses.
            </div>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={() => onOpenAuthModal('login')}
              type="button"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in to Account</span>
            </button>
          )}
        </div>
      )}

      {/* Error alert if validation fails */}
      {validationError && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout on Desktop */}
      <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Management & Live Marketplace Card Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Multiple Image Upload Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                Item Photos ({images.length})
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Cover: 1st image
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
              onClick={() => fileInputRef.current?.click()}
              className={`relative p-4 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFilesSelect(e.target.files)}
                className="hidden"
              />

              <div className="text-center space-y-2 py-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select multiple photos or <span className="text-emerald-600 dark:text-emerald-400 underline">browse</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Drop files here. PNG, JPG, or WEBP supported.
                </p>
              </div>
            </div>

            {/* Thumbnail Gallery of Uploaded Images */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Manage Photos:
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-xs bg-slate-950"
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Primary Cover Badge */}
                      {idx === 0 ? (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black flex items-center gap-1 shadow-md">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          COVER
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 hover:bg-emerald-600 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Make Cover
                        </button>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add more button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-xs font-bold transition-all ${
                      isDark 
                        ? 'border-slate-800 hover:border-emerald-500/60 text-slate-400 hover:text-emerald-400 bg-slate-900/30' 
                        : 'border-slate-300 hover:border-emerald-600 text-slate-600 hover:text-emerald-700 bg-slate-50'
                    }`}
                  >
                    <Plus className="w-5 h-5 mb-1" />
                    <span>Add Photo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Sample Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Or pick a sample template:</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImages([...preset.images]);
                      setCategory(preset.category);
                      setCondition(preset.condition);
                      setUsageDuration(preset.usage);
                      setConditionError(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 shrink-0 transition-all ${
                      isDark
                        ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-emerald-600'
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
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
              Live Marketplace Preview
            </label>
            <div className={`rounded-3xl overflow-hidden border transition-all ${
              isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <SafeImage
                  src={currentCover}
                  alt={title || 'Item Preview'}
                  title={title || 'Item Preview'}
                  category={category || undefined}
                  className="w-full h-full object-cover"
                />
                
                {/* Condition Badge in Preview */}
                <div className="absolute top-3 right-3">
                  {renderConditionPill(condition)}
                </div>

                {/* Category & Photo Count */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950/70 text-white backdrop-blur-md border border-white/15">
                    {category || 'Choose a Category'}
                  </span>
                  {images.length > 1 && (
                    <span className="px-2 py-1 rounded-xl text-xs font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {images.length}
                    </span>
                  )}
                </div>

                {/* Usage Duration tag at bottom left of preview image */}
                {usageDuration && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-black/75 text-emerald-300 backdrop-blur-md flex items-center gap-1 border border-emerald-500/30">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {usageDuration}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2.5">
                <h4 className="font-bold text-lg tracking-tight truncate text-slate-900 dark:text-white leading-snug">
                  {title.trim() || 'Untitled Listing'}
                </h4>
                <p className="text-sm line-clamp-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {description.trim() || 'Enter item details and condition description on the right.'}
                </p>
                <div className={`p-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 border ${
                  isDark ? 'bg-emerald-950/25 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}>
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Looking for: </span>
                    <span>{wantedItems.trim() || 'What you want in return'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* Item Title */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
              Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Introduction to Algorithms (CLRS 4th Ed) or Raspberry Pi 4 Kit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full py-3 px-4 rounded-2xl text-base border outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className={`w-full py-3 px-4 rounded-2xl text-base border outline-none cursor-pointer ${
                !category ? (isDark ? 'text-slate-400' : 'text-slate-500') : ''
              } ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' 
                  : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-600'
              }`}
            >
              <option value="" disabled>
                Choose a Category
              </option>
              {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Selection (Replaces Tiers) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                Item Condition *
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Accurate condition builds trade trust
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONDITION_OPTIONS.map((opt) => {
                const isSelected = condition === opt.condition;
                return (
                  <div
                    key={opt.condition}
                    onClick={() => {
                      setCondition(opt.condition);
                      setConditionError(null);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'border-emerald-500 bg-emerald-500/15 shadow-xs ring-1 ring-emerald-500/30'
                          : 'border-emerald-600 bg-emerald-50 shadow-xs ring-1 ring-emerald-600/30'
                        : conditionError
                        ? 'border-red-500/60 bg-red-500/5 hover:border-red-500'
                        : isDark
                        ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {opt.desc}
                    </div>
                  </div>
                );
              })}
            </div>
            {conditionError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                Please select an item condition before publishing.
              </p>
            )}
          </div>

          {/* Required Usage Duration Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                Usage Duration * <span className="text-emerald-600 dark:text-emerald-400 font-semibold">(Required)</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                e.g., 3 months, 1 year, unopened
              </span>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 months, 1 semester, or Brand new / Never used"
                  value={usageDuration}
                  onChange={(e) => setUsageDuration(e.target.value)}
                  className={`w-full py-3 pl-10 pr-4 rounded-2xl text-base border outline-none transition-all ${
                    !usageDuration.trim() && validationError
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500' 
                      : 'bg-white border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Quick suggestion chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-semibold">Quick pick:</span>
                {USAGE_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setUsageDuration(sug)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      usageDuration === sug
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                        : isDark
                        ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wanted Items */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
              What do you want in exchange? (Desired Trade Items) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Open to Linear Algebra book, Keychron keyboard, or Arduino sensor kit"
              value={wantedItems}
              onChange={(e) => {
                setWantedItems(e.target.value);
                if (wantedItemsError && e.target.value.trim()) {
                  setWantedItemsError(null);
                }
              }}
              className={`w-full py-3 px-4 rounded-2xl text-base border outline-none transition-all ${
                wantedItemsError
                  ? 'border-red-500 ring-1 ring-red-500/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : isDark 
                  ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 text-slate-900 placeholder:text-slate-400'
              }`}
            />
            {wantedItemsError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                Please specify what you want in exchange before publishing.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
              Description &amp; Condition Details *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe condition, edition, included accessories, and meetup preferences..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (descriptionError && e.target.value.trim()) {
                  setDescriptionError(null);
                }
              }}
              className={`w-full py-3 px-4 rounded-2xl text-base border outline-none transition-all resize-none ${
                descriptionError
                  ? 'border-red-500 ring-1 ring-red-500/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : isDark 
                  ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500' 
                  : 'bg-white border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 text-slate-900 placeholder:text-slate-400'
              }`}
            />
            {descriptionError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                Please provide a description before publishing.
              </p>
            )}
          </div>

          {/* Submit / Save Button */}
          <div className="pt-2 flex gap-3">
            {isEditing && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`py-3.5 px-6 rounded-2xl font-bold text-sm border transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] ${
                isSubmitting
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <span>{isEditing ? 'Saving changes...' : 'Publishing listing...'}</span>
              ) : isEditing ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Save Listing Changes</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
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
