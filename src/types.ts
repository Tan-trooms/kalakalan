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
}

export type AuthMode = 'login' | 'signup' | 'forgot';

export interface BarterItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  tier: ValueTier;
  imageUrl: string;
  owner: UserProfile;
  location: string;
  wantedItems: string;
  createdAt: string;
  isLiked?: boolean;
}

export interface TradeMatch {
  id: string;
  partner: UserProfile;
  matchedAt: string;
  status: 'Ready to Trade' | 'Pending Response' | 'Trade Finalized';
  myOffering: {
    title: string;
    imageUrl: string;
    tier: ValueTier;
  };
  theirOffering: {
    title: string;
    imageUrl: string;
    tier: ValueTier;
  };
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
  isSystemEvent?: boolean;
  systemEventType?: 'trade_updated' | 'terms_accepted' | 'trade_finalized' | 'initiated';
}

export type ActiveTab = 'market' | 'upload' | 'matches' | 'chat';
export type ThemeMode = 'light' | 'dark';
