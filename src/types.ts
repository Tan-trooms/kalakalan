export type ItemCondition = 'New' | 'Like New' | '2nd Hand' | 'Heavily Used';

// Retained as alias during refactor for safe transitions
export type ValueTier = 1 | 2 | 3;

export type ItemCategory = 
  | 'All Categories'
  | 'IT & Dev Hardware'
  | 'CS Textbooks'
  | 'Electronics'
  | 'Textbooks'
  | 'Cameras'
  | 'Furniture'
  | 'Plants & Home'
  | 'Bags & Apparel'
  | 'Instruments';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  initials?: string;
  trustScore: 'High Trust' | 'Verified Trader' | 'Rising Trader';
  rating: number;
  completedTrades: number;
  location: string;
  studentId?: string;
  joinedDate?: string;
  department?: string;
  bio?: string;
  isOnline?: boolean;
  lastActive?: string;
}

export type AuthMode = 'login' | 'signup' | 'forgot';

export interface BarterItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  usageDuration: string;
  images: string[];
  imageUrl?: string; // Backwards-compatible accessor for primary image
  owner: UserProfile;
  location: string;
  wantedItems: string;
  createdAt: string;
  updatedAt?: string;
  isLiked?: boolean;
  status?: 'active' | 'pending' | 'traded';
}

export interface TradeOffering {
  title: string;
  images: string[];
  imageUrl?: string;
  condition: ItemCondition;
  usageDuration?: string;
  tier?: ValueTier;
}

export interface TradeMatch {
  id: string;
  partner: UserProfile;
  matchedAt: string;
  createdAt: string; // Timestamp for chat thread creation
  status: 'Ready to Trade' | 'Pending Response' | 'Trade Finalized' | 'Trade Rejected';
  isArchived?: boolean; // Archived state for finalized or rejected trades
  myOffering: TradeOffering;
  theirOffering: TradeOffering;
  unreadCount?: number;
  lastMessage?: string;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
  timestamp: string;
  createdAt: string; // Timestamp for individual message
  isEdited?: boolean;
  isDeleted?: boolean;
  isSystemEvent?: boolean;
  systemEventType?: 'trade_updated' | 'terms_accepted' | 'trade_finalized' | 'trade_rejected' | 'initiated';
}

export type ActiveTab = 'market' | 'upload' | 'matches' | 'chat';
export type ThemeMode = 'light' | 'dark';
