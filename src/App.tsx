import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  ThemeMode, 
  BarterItem, 
  TradeMatch, 
  ChatMessage, 
  ItemCategory,
  ItemCondition,
  UserProfile,
  AuthMode
} from './types';
import { 
  INITIAL_ITEMS, 
  INITIAL_MATCHES, 
  INITIAL_MESSAGES, 
  CURRENT_USER, 
  DEMO_ACCOUNTS 
} from './data/mockData';
import { sanitizeToDrawingAvatar } from './data/avatars';
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
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('market');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('kalakalan_theme');
    return (saved as ThemeMode) || 'light';
  });
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

  // Items State with backward compatibility migration from v2 or fresh initialization
  const [items, setItems] = useState<BarterItem[]>(() => {
    const saved = localStorage.getItem('kalakalan_items_v3');
    if (!saved) {
      const legacy = localStorage.getItem('kalakalan_items_v2');
      if (!legacy) return INITIAL_ITEMS;
      try {
        const parsedLegacy = JSON.parse(legacy);
        const initialMap = new Map(INITIAL_ITEMS.map((it) => [it.id, it]));
        return parsedLegacy.map((item: any) => {
          const defaultItem = initialMap.get(item.id);
          const images = defaultItem?.images || (item.images && item.images.length > 0 ? item.images : [item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80']);
          const condition: ItemCondition = defaultItem?.condition || item.condition || (item.tier === 1 ? 'New' : item.tier === 2 ? 'Like New' : '2nd Hand');
          const usageDuration = defaultItem?.usageDuration || item.usageDuration || '6 months';
          return {
            ...item,
            images,
            imageUrl: images[0],
            condition,
            usageDuration,
            owner: {
              ...item.owner,
              avatar: sanitizeToDrawingAvatar(item.owner?.avatar || item.owner?.name),
            },
          };
        });
      } catch {
        return INITIAL_ITEMS;
      }
    }
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
        const images = (item.images && item.images.length > 0) ? item.images : (defaultItem?.images || [item.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80']);
        const condition: ItemCondition = item.condition || defaultItem?.condition || 'Like New';
        const usageDuration = item.usageDuration || defaultItem?.usageDuration || '3 months';
        return {
          ...item,
          images,
          imageUrl: images[0] || item.imageUrl,
          condition,
          usageDuration,
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

  const [matches, setMatches] = useState<TradeMatch[]>(() => {
    const saved = localStorage.getItem('kalakalan_matches_v3');
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
          createdAt: m.createdAt || defaultMatch?.createdAt || new Date().toISOString(),
          isArchived: m.isArchived ?? defaultMatch?.isArchived ?? false,
          myOffering: defaultMatch ? defaultMatch.myOffering : m.myOffering,
          theirOffering: defaultMatch ? defaultMatch.theirOffering : m.theirOffering,
          partner: {
            ...m.partner,
            avatar: sanitizeToDrawingAvatar(m.partner?.avatar || m.partner?.name),
            isOnline: m.partner?.isOnline ?? defaultMatch?.partner.isOnline ?? true,
            lastActive: m.partner?.lastActive ?? defaultMatch?.partner.lastActive ?? 'Just now',
          },
        };
      });
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('kalakalan_messages_v3');
    if (!saved) return INITIAL_MESSAGES;
    try {
      const parsed: Record<string, ChatMessage[]> = JSON.parse(saved);
      const sanitized: Record<string, ChatMessage[]> = { ...INITIAL_MESSAGES, ...parsed };
      Object.entries(sanitized).forEach(([key, msgs]) => {
        sanitized[key] = msgs.map((msg) => ({
          ...msg,
          createdAt: msg.createdAt || new Date().toISOString(),
          isEdited: msg.isEdited ?? false,
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

  // CRUD Editing Item State
  const [editingItem, setEditingItem] = useState<BarterItem | null>(null);

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
    localStorage.setItem('kalakalan_items_v3', JSON.stringify(items));
  }, [items]);

  // Sync matches & messages
  useEffect(() => {
    localStorage.setItem('kalakalan_matches_v3', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('kalakalan_messages_v3', JSON.stringify(messages));
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
    setItems((list) =>
      list.map((item) =>
        item.id === itemId ? { ...item, isLiked: !item.isLiked } : item
      )
    );
  };

  // CRUD: CREATE
  const handlePostSuccess = (newItem: BarterItem) => {
    setItems((prev) => [newItem, ...prev]);
    setActiveTab('market');
    showToast(`Listing "${newItem.title}" published!`);
  };

  // CRUD: INITIATE EDIT
  const handleStartEditItem = (item: BarterItem) => {
    setEditingItem(item);
    setSelectedItemForDetail(null);
    setActiveTab('upload');
  };

  // CRUD: UPDATE
  const handleUpdateItem = (updatedItem: BarterItem) => {
    setItems((prev) =>
      prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
    );
    if (selectedItemForDetail?.id === updatedItem.id) {
      setSelectedItemForDetail(updatedItem);
    }
    setEditingItem(null);
    setActiveTab('market');
    showToast(`Listing "${updatedItem.title}" updated successfully!`);
  };

  // CRUD: DELETE
  const handleDeleteItem = (itemId: string) => {
    const target = items.find((i) => i.id === itemId);
    const title = target ? target.title : 'Listing';
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    if (selectedItemForDetail?.id === itemId) {
      setSelectedItemForDetail(null);
    }
    if (editingItem?.id === itemId) {
      setEditingItem(null);
    }
    showToast(`"${title}" deleted from marketplace.`);
  };

  const handleInitiateTrade = (
    targetItem: BarterItem,
    offeringTitle: string,
    offeringCondition: ItemCondition
  ) => {
    const activeOwner = currentUser || CURRENT_USER;
    const newMatchId = `match-${Date.now()}`;
    const offeringImages = [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
    ];

    const targetImages = (targetItem.images && targetItem.images.length > 0)
      ? targetItem.images
      : [targetItem.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'];

    const newMatch: TradeMatch = {
      id: newMatchId,
      partner: targetItem.owner,
      matchedAt: 'Just now',
      createdAt: new Date().toISOString(),
      status: 'Ready to Trade',
      isArchived: false,
      myOffering: {
        title: offeringTitle,
        images: offeringImages,
        imageUrl: offeringImages[0],
        condition: offeringCondition,
        usageDuration: 'Used',
      },
      theirOffering: {
        title: targetItem.title,
        images: targetImages,
        imageUrl: targetImages[0],
        condition: targetItem.condition,
        usageDuration: targetItem.usageDuration,
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
      text: `Hi ${targetItem.owner.name}! I'm interested in trading my ${offeringTitle} (${offeringCondition}) for your ${targetItem.title} (${targetItem.condition}). Does that work for you?`,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      isEdited: false,
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
          createdAt: new Date().toISOString(),
          isSystemEvent: true,
          systemEventType: 'initiated',
        },
        initialChatMessage,
      ],
    }));

    setActiveMatchId(newMatchId);
    setActiveTab('chat');
    showToast(`Trade proposal sent to ${targetItem.owner.name}!`);

    // Simulated typing delay for partner to evaluate offer fairness
    setTimeout(() => {
      const offeredCondition = offeringCondition;
      const requestedCondition = targetItem.condition;
      const replyText = evaluateTradeFairness(offeredCondition, requestedCondition, '', true);

      const partnerDecisionMsg: ChatMessage = {
        id: `msg-rep-${Date.now()}`,
        matchId: newMatchId,
        senderId: targetItem.owner.id,
        senderName: targetItem.owner.name,
        senderAvatar: targetItem.owner.avatar,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        isEdited: false,
      };

      setMessages((prev) => ({
        ...prev,
        [newMatchId]: [...(prev[newMatchId] || []), partnerDecisionMsg],
      }));
    }, 1200);
  };

  const evaluateTradeFairness = (
    offeredCondition: ItemCondition | string,
    requestedCondition: ItemCondition | string,
    messageText: string = '',
    isOfferSubmission: boolean = false
  ): string => {
    const text = messageText.toLowerCase().trim();

    // 0. Automatic Simulation Response: "pwede mag tanong?" -> "Never Grow Old?"
    const normalizedInput = text
      .replace(/[?!.,;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const isAskingPwedeMagTanong =
      normalizedInput === 'pwede mag tanong' ||
      normalizedInput === 'pwede magtanong' ||
      normalizedInput === 'pwede ba mag tanong' ||
      normalizedInput === 'pwede ba magtanong' ||
      normalizedInput === 'pwede po mag tanong' ||
      normalizedInput === 'pwede po magtanong' ||
      normalizedInput === 'pwede bang mag tanong' ||
      normalizedInput === 'pwede bang magtanong' ||
      normalizedInput === 'pwede po bang magtanong' ||
      normalizedInput === 'pwede po bang mag tanong' ||
      /\bpwede\b.*?\bmag\s*tanong\b/i.test(text) ||
      /\bpede\b.*?\bmag\s*tanong\b/i.test(text) ||
      text.includes('pwede mag tanong') ||
      text.includes('pwede magtanong');

    if (isAskingPwedeMagTanong) {
      return 'Never Grow Old?';
    }

    // 1. Negative Sentiment & Rejection / Cancellation Check
    if (
      /\b(no|nope|don't\s+want|dont\s+want|don't\s+like|dont\s+like|no\s+thanks|no\s+thank\s+you|cancel|reject|nevermind|never\s+mind|pass|not\s+interested|not\s+into\s+it|decline)\b/i.test(text) ||
      text.includes("don't want") ||
      text.includes("dont want") ||
      text.includes("don't like") ||
      text.includes("dont like") ||
      text.includes("no thanks") ||
      text.includes("nevermind") ||
      text.includes("not interested")
    ) {
      return "Oh, no worries at all! Feel free to hit the 'Reject Trade' button, or let me know if you want to swap for something else instead.";
    }

    // 2. Initial Offer Submission / Condition Evaluation
    if (isOfferSubmission) {
      const conditionRanks: Record<string, number> = {
        'New': 4,
        'Like New': 3,
        '2nd Hand': 2,
        'Heavily Used': 1,
      };
      const offeredRank = conditionRanks[offeredCondition] || 2;
      const requestedRank = conditionRanks[requestedCondition] || 2;

      if (offeredRank >= requestedRank - 1) {
        return `I just checked your offer! The ${offeredCondition} condition sounds like a fair match for my ${requestedCondition} item. Are you free to meet up at the APC Cafeteria or the campus library later today to inspect and swap?`;
      } else {
        return `Hey, thanks for the offer! Since my item is in ${requestedCondition} condition, could you share more details about the working condition and usage history of your item before we arrange a meetup?`;
      }
    }

    // 3. Greetings
    if (/\b(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))\b/i.test(text)) {
      return "Hey! Thanks for reaching out. I'm definitely interested in this barter. Are you free to meet up on campus sometime soon?";
    }

    // 4. Meetups & Location/Time
    if (/\b(meet|where|when|place|location|cafeteria|library|canteen|court|gym|hall)\b/i.test(text)) {
      const campusMeetupSuggestions = [
        "I can meet you on the 7th floor at the Library, or down at the 1st-floor Cafeteria across from Multipurpose Hall 1. Which works better for you?",
        "How about we meet on the 3rd floor at the Student Activities Office? It's a quiet spot to sit down and check the item.",
        "I'm heading up to the 11th-floor covered court soon, but I can also meet near the 10th-floor Gym if you're around there.",
      ];
      return campusMeetupSuggestions[Math.floor(Math.random() * campusMeetupSuggestions.length)];
    }

    // 5. Condition & Working Status
    if (/\b(condition|working|issue|issues|damaged?|scratches?|test|inspect|duration|usage|used)\b/i.test(text)) {
      return "It's in great condition as described in my listing! We can inspect and test it together when we meet on campus.";
    }

    // 6. Affirmations, Confirmation & Ready to proceed
    if (
      /^(ready|all good|good|all set|let's do it|yes|sure|confirm|finalize)[.!]?$/i.test(text) ||
      /\b(ready\s+to\s+(trade|swap|finalize)|let's\s+finalize|confirm\s+trade|finalize\s+trade|all\s+good|all\s+set|let's\s+do\s+it|sounds\s+good|looks\s+good)\b/i.test(text)
    ) {
      return "Awesome! If everything looks good on your end, go ahead and click 'Confirm & Finalize Barter' and we can lock this in.";
    }

    // 7. Fair Trade comparisons
    if (/\b(fair|offer|swap|exchange|trade|deal)\b/i.test(text)) {
      return `Sounds like a solid trade! I am happy to swap with you. Let me know what time works best for your schedule.`;
    }

    // 8. Fallback Responses
    const fallbackResponses = [
      "Got it. Let me know if anything else comes up!",
      "Makes sense to me. Looking forward to our campus trade!",
      "Sounds good. I'll make sure the item is packaged and ready to go.",
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const handleSendMessage = (matchId: string, text: string, imageUrl?: string) => {
    const activeMatch = matches.find((m) => m.id === matchId);
    // UI Restriction: Cannot send messages if trade is finalized or rejected
    if (activeMatch && (activeMatch.status === 'Trade Finalized' || activeMatch.status === 'Trade Rejected')) {
      showToast('This conversation is locked because the trade is closed.');
      return;
    }

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
      createdAt: new Date().toISOString(),
      isEdited: false,
    };

    setMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg],
    }));

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              lastMessage: text || (imageUrl ? 'Shared an image' : m.lastMessage),
            }
          : m
      )
    );

    // Simulated partner auto-responder
    setTimeout(() => {
      const matchNow = matches.find((m) => m.id === matchId);
      if (matchNow && (matchNow.status === 'Trade Finalized' || matchNow.status === 'Trade Rejected')) {
        return;
      }
      const activePartner = activeMatch?.partner;
      if (activePartner && activePartner.id !== activeOwner.id) {
        const offeredCondition = activeMatch?.myOffering.condition || 'Like New';
        const requestedCondition = activeMatch?.theirOffering.condition || 'Like New';
        const threadMsgs = messages[matchId] || [];
        const isFirstMessage = threadMsgs.filter((m) => m.senderId === activeOwner.id).length <= 1;

        const replyText = evaluateTradeFairness(
          offeredCondition,
          requestedCondition,
          text || '',
          isFirstMessage && (text?.toLowerCase().includes('offer') || text?.toLowerCase().includes('trade') || text?.toLowerCase().includes('swap'))
        );

        const partnerReply: ChatMessage = {
          id: `msg-rep-${Date.now()}`,
          matchId,
          senderId: activePartner.id,
          senderName: activePartner.name,
          senderAvatar: activePartner.avatar,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString(),
          isEdited: false,
        };

        setMessages((prev) => ({
          ...prev,
          [matchId]: [...(prev[matchId] || []), partnerReply],
        }));

        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId ? { ...m, lastMessage: replyText } : m
          )
        );
      }
    }, 1200);
  };

  const handleEditMessage = (matchId: string, messageId: string, newText: string) => {
    setMessages((prev) => {
      const list = prev[matchId] || [];
      return {
        ...prev,
        [matchId]: list.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: newText, isEdited: true }
            : msg
        ),
      };
    });
    showToast('Message edited');
  };

  const handleDeleteMessage = (matchId: string, messageId: string) => {
    setMessages((prev) => {
      const list = prev[matchId] || [];
      return {
        ...prev,
        [matchId]: list.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                text: 'This message was deleted.',
                isDeleted: true,
                imageUrl: undefined,
                imageCaption: undefined,
              }
            : msg
        ),
      };
    });
    showToast('Message deleted');
  };

  const handleToggleArchive = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const nextArchived = !m.isArchived;
          showToast(nextArchived ? 'Conversation archived' : 'Conversation unarchived');
          return { ...m, isArchived: nextArchived };
        }
        return m;
      })
    );
  };

  const handleFinalizeTrade = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId) || matches[0];
    setFinalizeMatch(match);
  };

  const handleConfirmFinalize = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, status: 'Trade Finalized', isArchived: true } : m
      )
    );

    setMessages((prev) => ({
      ...prev,
      [matchId]: [
        ...(prev[matchId] || []),
        {
          id: `msg-fin-${Date.now()}`,
          matchId,
          senderId: 'system',
          senderName: 'System',
          text: 'Trade successfully finalized! Exchange verified. Chat thread is now locked.',
          timestamp: 'Just now',
          createdAt: new Date().toISOString(),
          isSystemEvent: true,
          systemEventType: 'trade_finalized',
        },
      ],
    }));
    showToast('Barter confirmed and verified! Chat thread locked.');
  };

  const handleRejectTrade = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, status: 'Trade Rejected', isArchived: true } : m
      )
    );

    setMessages((prev) => ({
      ...prev,
      [matchId]: [
        ...(prev[matchId] || []),
        {
          id: `msg-rej-${Date.now()}`,
          matchId,
          senderId: 'system',
          senderName: 'System',
          text: 'Trade proposal was rejected. Chat thread is now locked.',
          timestamp: 'Just now',
          createdAt: new Date().toISOString(),
          isSystemEvent: true,
          systemEventType: 'trade_rejected',
        },
      ],
    }));
    showToast('Trade proposal rejected. Chat thread locked.');
  };

  const currentMatch = matches.find((m) => m.id === activeMatchId) || matches[0];
  const currentMessages = messages[activeMatchId] || [];

  return (
    <div className={`transition-colors duration-200 ${
      activeTab === 'chat' ? 'h-[100dvh] overflow-hidden flex flex-col' : 'min-h-screen flex flex-col'
    } ${
      theme === 'dark' ? 'bg-[#18191a]' : 'bg-[#f0f2f5]'
    }`}>
      <div className={`w-full relative flex flex-col transition-colors duration-200 ${
        activeTab === 'chat' ? 'h-full min-h-0 overflow-hidden' : 'min-h-screen'
      } ${
        theme === 'dark' ? 'bg-[#18191a]' : 'bg-[#f0f2f5]'
      }`}>
        {/* Floating Feedback Toast */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 pointer-events-none">
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
          onChangeTab={(tab) => {
            if (tab !== 'upload') setEditingItem(null);
            setActiveTab(tab);
          }}
          currentUser={currentUser}
          unreadMatches={matches.filter((m) => m.unreadCount).length}
          unreadMessages={2}
          onToggleTheme={toggleTheme}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenAuthModal={handleOpenAuth}
        />

        {/* Tab Views */}
        <main className={`flex-1 min-h-0 relative w-full ${activeTab === 'chat' ? 'overflow-hidden flex flex-col' : ''}`}>
          {activeTab === 'market' && (
            <MarketView
              items={items}
              theme={theme}
              currentUser={currentUser}
              onSelectItem={(item) => setSelectedItemForDetail(item)}
              onToggleLike={handleToggleLike}
              onOpenUpload={() => {
                setEditingItem(null);
                setActiveTab('upload');
              }}
              onEditItem={handleStartEditItem}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {activeTab === 'upload' && (
            <UploadView
              theme={theme}
              currentUser={currentUser}
              editingItem={editingItem}
              onOpenAuthModal={handleOpenAuth}
              onPostSuccess={handlePostSuccess}
              onUpdateSuccess={handleUpdateItem}
              onCancel={() => {
                setEditingItem(null);
                setActiveTab('market');
              }}
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
              currentUser={currentUser}
              onToggleTheme={toggleTheme}
              onBack={() => setActiveTab('matches')}
              onSelectMatch={(mId) => setActiveMatchId(mId)}
              onSendMessage={handleSendMessage}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onFinalizeTrade={handleFinalizeTrade}
              onRejectTrade={handleRejectTrade}
              onToggleArchive={handleToggleArchive}
            />
          )}
        </main>

        {/* Bottom dock — mobile-first primary nav, floating on desktop; hidden in chat for max message viewport */}
        {activeTab !== 'chat' && (
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            if (tab !== 'upload') setEditingItem(null);
            setActiveTab(tab);
          }}
          theme={theme}
          unreadMatches={matches.filter((m) => m.unreadCount).length}
          unreadMessages={2}
        />
        )}

        {/* Side Menu Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          theme={theme}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuth}
          onLogout={handleLogout}
          onSelectAccount={handleSelectAccount}
          onSelectCategory={() => {}}
          selectedCategory="All Categories"
        />

        {/* Item Detail Modal */}
        <ItemDetailModal
          item={selectedItemForDetail}
          theme={theme}
          currentUser={currentUser}
          onClose={() => setSelectedItemForDetail(null)}
          onToggleLike={handleToggleLike}
          onProposeTrade={handleInitiateTrade}
          onEditItem={handleStartEditItem}
          onDeleteItem={handleDeleteItem}
        />

        {/* Finalize Trade Confirmation Modal */}
        <TradeFinalizeModal
          match={finalizeMatch}
          isOpen={!!finalizeMatch}
          onClose={() => setFinalizeMatch(null)}
          theme={theme}
          currentUser={currentUser}
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
