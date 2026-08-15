import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  ThemeMode, 
  BarterItem, 
  TradeMatch, 
  ChatMessage, 
  ItemCategory,
  ValueTier,
  UserProfile,
  AuthMode
} from './types';
import { 
  INITIAL_ITEMS, 
  CYBERPUNK_ITEMS, 
  INITIAL_MATCHES, 
  INITIAL_MESSAGES,
  CURRENT_USER,
  DEMO_ACCOUNTS 
} from './data/mockData';
import { sanitizeToDrawingAvatar, DRAWING_AVATARS } from './data/avatars';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Drawer } from './components/Drawer';
import { MarketView } from './components/MarketView';
import { UploadView } from './components/UploadView';
import { MatchesView } from './components/MatchesView';
import { ChatView } from './components/ChatView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { TradeFinalizeModal } from './components/TradeFinalizeModal';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('market');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('kalakalan_theme');
    return (saved as ThemeMode) || 'light';
  });
  const [isCyberMode, setIsCyberMode] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // User Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kalakalan_current_user');
    if (!saved) return CURRENT_USER;
    try {
      const parsed: UserProfile = JSON.parse(saved);
      return { ...parsed, avatar: sanitizeToDrawingAvatar(parsed.avatar || parsed.name) };
    } catch {
      return CURRENT_USER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [items, setItems] = useState<BarterItem[]>(() => {
    const saved = localStorage.getItem('kalakalan_items_v2');
    if (!saved) return INITIAL_ITEMS;
    try {
      const parsed: BarterItem[] = JSON.parse(saved);
      const initialItemMap = new Map(INITIAL_ITEMS.map((it) => [it.id, it]));
      const existingIds = new Set(parsed.map((i) => i.id));
      const combined = [...parsed];
      INITIAL_ITEMS.forEach((it) => {
        if (!existingIds.has(it.id)) combined.push(it);
      });
      return combined.map((item) => {
        const defaultItem = initialItemMap.get(item.id);
        return {
          ...item,
          imageUrl: defaultItem ? defaultItem.imageUrl : item.imageUrl,
          owner: {
            ...item.owner,
            avatar: sanitizeToDrawingAvatar(item.owner?.avatar || item.owner?.name),
          },
        };
      });
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [cyberItems, setCyberItems] = useState<BarterItem[]>(CYBERPUNK_ITEMS);

  const [matches, setMatches] = useState<TradeMatch[]>(() => {
    const saved = localStorage.getItem('kalakalan_matches_v2');
    if (!saved) return INITIAL_MATCHES;
    try {
      const parsed: TradeMatch[] = JSON.parse(saved);
      const initialMatchMap = new Map(INITIAL_MATCHES.map((m) => [m.id, m]));
      const existingIds = new Set(parsed.map((m) => m.id));
      const combined = [...parsed];
      INITIAL_MATCHES.forEach((m) => {
        if (!existingIds.has(m.id)) combined.push(m);
      });
      return combined.map((m) => {
        const defaultMatch = initialMatchMap.get(m.id);
        return {
          ...m,
          myOffering: defaultMatch ? defaultMatch.myOffering : m.myOffering,
          theirOffering: defaultMatch ? defaultMatch.theirOffering : m.theirOffering,
          partner: {
            ...m.partner,
            avatar: sanitizeToDrawingAvatar(m.partner?.avatar || m.partner?.name),
          },
        };
      });
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('kalakalan_messages_v2');
    if (!saved) return INITIAL_MESSAGES;
    try {
      const parsed: Record<string, ChatMessage[]> = JSON.parse(saved);
      const sanitized: Record<string, ChatMessage[]> = { ...INITIAL_MESSAGES, ...parsed };
      Object.entries(sanitized).forEach(([key, msgs]) => {
        sanitized[key] = msgs.map((msg) => ({
          ...msg,
          senderAvatar: msg.senderAvatar
            ? sanitizeToDrawingAvatar(msg.senderAvatar || msg.senderName)
            : undefined,
        }));
      });
      return sanitized;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [activeMatchId, setActiveMatchId] = useState<string>('match-1');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<BarterItem | null>(null);
  const [finalizeMatch, setFinalizeMatch] = useState<TradeMatch | null>(null);

  // Sync theme with document class & localStorage
  useEffect(() => {
    localStorage.setItem('kalakalan_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync user with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kalakalan_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kalakalan_current_user');
    }
  }, [currentUser]);

  // Sync items with localStorage
  useEffect(() => {
    localStorage.setItem('kalakalan_items_v2', JSON.stringify(items));
  }, [items]);

  // Sync matches & messages
  useEffect(() => {
    localStorage.setItem('kalakalan_matches_v2', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('kalakalan_messages_v2', JSON.stringify(messages));
  }, [messages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleCyberMode = () => {
    setIsCyberMode((prev) => {
      const next = !prev;
      if (next) setTheme('dark');
      return next;
    });
  };

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile, msg?: string) => {
    setCurrentUser(user);
    showToast(msg || `Signed in as ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of Kalakalan');
  };

  const handleSelectAccount = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`Switched active profile to ${user.name}`);
  };

  const handleToggleLike = (itemId: string) => {
    const updater = (list: BarterItem[]) =>
      list.map((item) =>
        item.id === itemId ? { ...item, isLiked: !item.isLiked } : item
      );
    setItems(updater);
    setCyberItems(updater);
  };

  const handlePostSuccess = (newItem: BarterItem) => {
    setItems((prev) => [newItem, ...prev]);
    setActiveTab('market');
    showToast(`Listing "${newItem.title}" published!`);
  };

  const handleInitiateTrade = (
    targetItem: BarterItem,
    offeringTitle: string,
    offeringTier: ValueTier
  ) => {
    const activeOwner = currentUser || CURRENT_USER;
    const newMatchId = `match-${Date.now()}`;
    const newMatch: TradeMatch = {
      id: newMatchId,
      partner: targetItem.owner,
      matchedAt: 'Just now',
      status: 'Ready to Trade',
      myOffering: {
        title: offeringTitle,
        imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
        tier: offeringTier,
      },
      theirOffering: {
        title: targetItem.title,
        imageUrl: targetItem.imageUrl,
        tier: targetItem.tier,
      },
      unreadCount: 1,
      lastMessage: `Trade proposal initiated for ${targetItem.title}.`,
    };

    const initialChatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      matchId: newMatchId,
      senderId: activeOwner.id,
      senderName: activeOwner.name,
      senderAvatar: activeOwner.avatar,
      text: `Hi ${targetItem.owner.name}! I'm interested in trading my ${offeringTitle} (Tier ${offeringTier}) for your ${targetItem.title}. Does that work for you?`,
      timestamp: 'Just now',
    };

    setMatches((prev) => [newMatch, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newMatchId]: [
        {
          id: `msg-sys-${Date.now()}`,
          matchId: newMatchId,
          senderId: 'system',
          senderName: 'System',
          timestamp: 'TODAY',
          isSystemEvent: true,
          systemEventType: 'initiated',
        },
        initialChatMessage,
      ],
    }));

    setActiveMatchId(newMatchId);
    setActiveTab('chat');
    showToast(`Trade proposal sent to ${targetItem.owner.name}!`);
  };

  const handleSendMessage = (matchId: string, text: string, imageUrl?: string) => {
    const activeOwner = currentUser || CURRENT_USER;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: activeOwner.id,
      senderName: activeOwner.name,
      senderAvatar: activeOwner.avatar,
      text: text || undefined,
      imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg],
    }));

    // Simulate friendly partner response after 1.5 seconds if this is an active trade conversation
    setTimeout(() => {
      const activePartner = matches.find((m) => m.id === matchId)?.partner;
      if (activePartner && activePartner.id !== activeOwner.id) {
        const partnerReply: ChatMessage = {
          id: `msg-rep-${Date.now()}`,
          matchId,
          senderId: activePartner.id,
          senderName: activePartner.name,
          senderAvatar: activePartner.avatar,
          text: `Thanks for the update! Looking forward to meeting up at the campus center to check everything.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => ({
          ...prev,
          [matchId]: [...(prev[matchId] || []), partnerReply],
        }));
      }
    }, 1500);
  };

  const handleFinalizeTrade = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId) || matches[0];
    setFinalizeMatch(match);
  };

  const handleConfirmFinalize = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, status: 'Trade Finalized' } : m
      )
    );

    // Add system notification to message thread
    setMessages((prev) => ({
      ...prev,
      [matchId]: [
        ...(prev[matchId] || []),
        {
          id: `msg-fin-${Date.now()}`,
          matchId,
          senderId: 'system',
          senderName: 'System',
          text: 'Trade successfully finalized! Exchange verified.',
          timestamp: 'Just now',
          isSystemEvent: true,
          systemEventType: 'trade_finalized',
        },
      ],
    }));
    showToast('Barter confirmed and verified!');
  };

  const currentMatch = matches.find((m) => m.id === activeMatchId) || matches[0];
  const currentMessages = messages[activeMatchId] || [];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#060a17]' : 'bg-slate-100'
    } flex flex-col`}>
      <div className={`w-full min-h-screen relative flex flex-col transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#060a17]' : 'bg-[#f8fafc]'
      }`}>
        {/* Floating Feedback Toast */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
            <div className="p-3.5 rounded-2xl bg-emerald-800 text-white shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top duration-200 border border-emerald-600/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="truncate flex-1">{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Global Responsive Navigation Header */}
        <Header
          theme={theme}
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          currentUser={currentUser}
          unreadMatches={matches.filter((m) => m.unreadCount).length}
          unreadMessages={2}
          onToggleTheme={toggleTheme}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenAuthModal={handleOpenAuth}
          isCyberMode={isCyberMode}
          onToggleCyberMode={toggleCyberMode}
        />

        {/* Tab Views */}
        <main className="flex-1 relative w-full">
          {activeTab === 'market' && (
            <MarketView
              items={items}
              cyberItems={cyberItems}
              theme={theme}
              isCyberMode={isCyberMode}
              onSelectItem={(item) => setSelectedItemForDetail(item)}
              onToggleLike={handleToggleLike}
              onOpenUpload={() => setActiveTab('upload')}
            />
          )}

          {activeTab === 'upload' && (
            <UploadView
              theme={theme}
              currentUser={currentUser}
              onOpenAuthModal={handleOpenAuth}
              onPostSuccess={handlePostSuccess}
              onCancel={() => setActiveTab('market')}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesView
              matches={matches}
              theme={theme}
              onOpenChat={(matchId) => {
                setActiveMatchId(matchId);
                setActiveTab('chat');
              }}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              match={currentMatch}
              allMatches={matches}
              messages={currentMessages}
              theme={theme}
              onToggleTheme={toggleTheme}
              onBack={() => setActiveTab('matches')}
              onSelectMatch={(mId) => setActiveMatchId(mId)}
              onSendMessage={handleSendMessage}
              onFinalizeTrade={handleFinalizeTrade}
            />
          )}
        </main>

        {/* Bottom Navigation for Mobile Only */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          theme={theme}
          unreadMatches={matches.filter((m) => m.unreadCount).length}
          unreadMessages={2}
        />

        {/* Side Menu Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          theme={theme}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuth}
          onLogout={handleLogout}
          onSelectAccount={handleSelectAccount}
          isCyberMode={isCyberMode}
          onToggleCyberMode={toggleCyberMode}
          onSelectCategory={() => {}}
          selectedCategory="All Categories"
        />

        {/* Item Detail Modal */}
        <ItemDetailModal
          item={selectedItemForDetail}
          theme={theme}
          onClose={() => setSelectedItemForDetail(null)}
          onToggleLike={handleToggleLike}
          onProposeTrade={handleInitiateTrade}
        />

        {/* Finalize Trade Confirmation Modal */}
        <TradeFinalizeModal
          match={finalizeMatch}
          isOpen={!!finalizeMatch}
          onClose={() => setFinalizeMatch(null)}
          theme={theme}
          onConfirmFinalize={handleConfirmFinalize}
        />

        {/* Login & Sign Up Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          theme={theme}
          initialMode={authModalMode}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
}
