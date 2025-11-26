
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Camera, Zap, Menu, X, ArrowRight, Lock, Check, AlertTriangle, User, Mail, Send, CheckCircle, Loader2, Brain, ShieldAlert, Globe, Gift, Star, Trophy, Ban, ShoppingCart } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import AIChat from './components/AIChat';
import AuthModal from './components/AuthModal';
import CreditIcon from './components/CreditIcon';
import AdminPanel from './components/AdminPanel';
import { GalleryItem, Product, User as UserType, ViewState, PurchaseRecord, Mission } from './types';

// Updated Data for Gallery with Specific Brainrot Placeholders
const GALLERY_ITEMS: GalleryItem[] = [
  { 
    id: '1', 
    src: 'https://placehold.co/600x800/00ff00/000000/png?text=Los+Sphagettis', 
    alt: 'Los Sphagettis', 
    caption: 'LOS SPHAGETTIS ☢️' 
  },
  { 
    id: '2', 
    src: 'https://placehold.co/600x800/ff99cc/000000/png?text=Strawberry\nElephant', 
    alt: 'Strawberry Elephant', 
    caption: 'STRAWBERRY ELEPHANT OG' 
  },
  { 
    id: '3', 
    src: 'https://placehold.co/600x800/ffd700/000000/png?text=Los\nCombinations', 
    alt: 'Los Combinations', 
    caption: 'LOS COMBINATIONS' 
  },
  { 
    id: '4', 
    src: 'https://placehold.co/600x800/87cefa/000000/png?text=Las\nVaquitas', 
    alt: 'Las Vaquitas Saturnitas', 
    caption: 'LAS VAQUITAS SATURNITAS' 
  }
];

// Dummy Data for Shop
const SHOP_ITEMS: Product[] = [
  { 
    id: '1', 
    name: 'Pass 1', 
    price: '100', 
    priceValue: 100, 
    image: 'https://placehold.co/600x600/121212/FFFFFF/png?text=ADMIN+ABUSE',
    rarity: 'Rare',
    description: 'Vantaggi inclusi: Admin Abuse Privato • Molta più fortuna durante l\'Admin Abuse.'
  },
  { 
    id: '2', 
    name: 'Pass 2', 
    price: '200', 
    priceValue: 200,
    image: 'https://placehold.co/600x600/FFD700/000000/png?text=QUEST+TIME',
    rarity: 'Legendary',
    description: 'Vantaggi: quest time senza og'
  },
  { 
    id: '3', 
    name: 'Pass 3', 
    price: '500', 
    priceValue: 500,
    image: 'https://placehold.co/600x600/0000FF/0000FF/png?text=', // Empty text because we use overlay
    rarity: 'Mythic',
    description: 'Vantaggi: quest time con og'
  },
];

// DATA FOR NEW "SHOP BRAINROT" (UPDATED: Rainbow removed, Prices increased to old rainbow price)
const SHOP_BRAINROT_ITEMS: Product[] = [
  { 
    id: 'br-1', 
    name: 'Karkirkarkur', 
    price: '100', // Was rainbow price
    priceValue: 100, 
    image: 'https://placehold.co/600x600/ffffff/000000/png?text=KARKIRKARKUR+COMBINATION',
    rarity: 'SECRET',
    description: ''
  },
  { 
    id: 'br-2', 
    name: 'Spooky and Pumpky', 
    price: '200', // Was rainbow price
    priceValue: 200, 
    image: 'https://placehold.co/600x600/ff7518/000000/png?text=SPOOKY+AND+PUMPKY',
    rarity: 'SECRET',
    description: ''
  },
  { 
    id: 'br-3', 
    name: 'Mieteteira Bicicleteira', 
    price: '250', // Was rainbow price
    priceValue: 250, 
    image: 'https://placehold.co/600x600/000000/333333/png?text=SECRET',
    rarity: 'SECRET',
    description: ''
  },
  { 
    id: 'br-4', 
    name: 'Strawberry Elephant', 
    price: '1000', // Was rainbow price
    priceValue: 1000, 
    image: 'https://placehold.co/600x600/ff99cc/000000/png?text=STRAWBERRY+ELEPHANT',
    rarity: 'OG',
    description: ''
  },
  { 
    id: 'br-5', 
    name: 'Meowl', 
    price: '1200', // Was rainbow price
    priceValue: 1200, 
    image: 'https://placehold.co/600x600/663399/ffffff/png?text=MEOWL',
    rarity: 'OG',
    description: ''
  },
];

// POOLS
const RECURRING_MISSIONS: Omit<Mission, 'id' | 'isCompleted' | 'isClaimed' | 'type'>[] = [
  { title: "Visita il Negozio Item", reward: 50, actionType: 'visit_shop' },
  { title: "Chiedi qualcosa all'AI", reward: 50, actionType: 'chat_ai' },
];

interface Notification {
  message: string;
  type: 'error' | 'success';
}

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const [user, setUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [onlineUsers, setOnlineUsers] = useState(0); 
  
  // Email Form State
  const [emailBody, setEmailBody] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);

  // --- MISSION SYSTEM LOGIC ---

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Check for existing session in LOCAL STORAGE for persistence
  useEffect(() => {
    const sessionUser = localStorage.getItem('current_user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }

    // UPDATE: Real Users Count
    const updateRealUserCount = () => {
      const storedUsers = localStorage.getItem('app_users');
      if (storedUsers) {
        const usersArray = JSON.parse(storedUsers);
        setOnlineUsers(usersArray.length);
      } else {
        setOnlineUsers(0);
      }
    };

    updateRealUserCount();
    // Poll every few seconds to check for new registrations and DB updates (like admin forced gold or ban)
    const interval = setInterval(() => {
        updateRealUserCount();
        checkForExternalUpdates();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Effect to manage Daily Missions initialization and updates
  useEffect(() => {
    if (user) {
        manageDailyMissions(user);
    }
    // Added user.nextMissionIsGold to dependencies to react to Admin trigger
  }, [user?.username, user?.lastMissionDate, user?.nextMissionIsGold]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    setMobileMenuOpen(false);
    setCurrentView('home');
  };

  const checkForExternalUpdates = () => {
      const currentUserStr = localStorage.getItem('current_user');
      if (!currentUserStr) return;
      
      const sessionUser = JSON.parse(currentUserStr);
      const storedUsersStr = localStorage.getItem('app_users');
      
      if (storedUsersStr) {
          const users: UserType[] = JSON.parse(storedUsersStr);
          const dbUser = users.find(u => u.username === sessionUser.username);
          
          if (dbUser) {
             // 1. CHECK BAN STATUS (Real-time kick)
             if (dbUser.isBanned) {
               handleLogout();
               showNotification(`SEI STATO BANNATO: ${dbUser.banReason || 'Accesso revocato.'}`, 'error');
               return;
             }

             // 2. Check if Admin added Gold Mission flag
             if (dbUser.nextMissionIsGold && !sessionUser.nextMissionIsGold) {
                 // Trigger immediate update to process the gold mission
                 const updatedState = { ...sessionUser, nextMissionIsGold: true, credits: dbUser.credits };
                 setUser(updatedState);
                 // We don't save nextMissionIsGold=true to localstorage here because the mission manager will consume it and save false immediately
             }
             
             // 3. Check credit sync (e.g. admin added credits)
             if (dbUser.credits !== sessionUser.credits) {
                 setUser(prev => prev ? ({ ...prev, credits: dbUser.credits }) : null);
                 localStorage.setItem('current_user', JSON.stringify({ ...sessionUser, credits: dbUser.credits }));
             }
          }
      }
  };

  const manageDailyMissions = (currentUser: UserType) => {
      const today = new Date().toISOString().split('T')[0];
      let updatedUser = { ...currentUser };
      let hasUpdates = false;

      // Ensure dailyMissions array exists
      if (!updatedUser.dailyMissions) updatedUser.dailyMissions = [];

      // --- 1. ADMIN FORCED GOLD MISSION (Instant Injection) ---
      if (updatedUser.nextMissionIsGold) {
          // Check if already has gold mission to avoid duplicates (though admin might want multiple, let's limit 1 pending)
          const hasUnclaimedGold = updatedUser.dailyMissions.some(m => m.type === 'gold' && !m.isClaimed);
          if (!hasUnclaimedGold) {
              const goldMission: Mission = {
                  id: `gold-mission-${Date.now()}`,
                  title: "ORO MISSION",
                  reward: 1000,
                  isCompleted: true, // Immediately completed
                  isClaimed: false,
                  type: 'gold'
              };
              // Add to top of list
              updatedUser.dailyMissions = [goldMission, ...updatedUser.dailyMissions];
              updatedUser.nextMissionIsGold = false; // Consumed
              hasUpdates = true;
              showNotification("ORO MISSION GENERATA DALL'ADMIN!", 'success');
          } else {
             // Just consume flag if duplicate
             updatedUser.nextMissionIsGold = false;
             hasUpdates = true;
          }
      }

      // --- 2. DAILY REFRESH ---
      if (updatedUser.lastMissionDate !== today) {
          const keptMissions = updatedUser.dailyMissions.filter(m => 
              (m.type === 'gold' && !m.isClaimed) ||
              (m.actionType === 'buy' && !m.isCompleted) 
          );
          
          const newMissions: Mission[] = [...keptMissions];
          
          // Slot 1: BUY MISSION (One time only in lifetime)
          if (!updatedUser.hasCompletedFirstBuy && !newMissions.some(m => m.actionType === 'buy')) {
             newMissions.push({
                 id: `mission-buy-lifetime`,
                 title: "Compra un oggetto",
                 reward: 50,
                 isCompleted: false,
                 isClaimed: false,
                 type: 'standard',
                 actionType: 'buy'
              });
          }

          // Slot 2: LOGIN MISSION (Every other day)
          const lastLoginDate = updatedUser.lastLoginMissionDate ? new Date(updatedUser.lastLoginMissionDate) : null;
          const todayDate = new Date(today);
          let shouldAddLogin = true;

          if (lastLoginDate) {
             const diffTime = Math.abs(todayDate.getTime() - lastLoginDate.getTime());
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
             if (diffDays <= 1) shouldAddLogin = false;
          }

          if (shouldAddLogin) {
              newMissions.push({
                  id: `mission-login-${today}`,
                  title: "Accedi al sito",
                  reward: 50,
                  isCompleted: true, 
                  isClaimed: false,
                  type: 'standard',
                  actionType: 'login'
              });
              updatedUser.lastLoginMissionDate = today;
          }

          // Slot 3: FILLER
          const standardCount = newMissions.filter(m => m.type !== 'gold').length;
          const needed = 2 - standardCount;

          for(let i=0; i<needed; i++) {
              const randomTemplate = RECURRING_MISSIONS[Math.floor(Math.random() * RECURRING_MISSIONS.length)];
              newMissions.push({
                  ...randomTemplate,
                  id: `mission-${today}-${i}-${Date.now()}`,
                  isCompleted: false,
                  isClaimed: false,
                  type: 'standard'
              } as Mission);
          }

          updatedUser.dailyMissions = newMissions;
          updatedUser.lastMissionDate = today;
          hasUpdates = true;
      }

      if (hasUpdates) {
          updateUserData(updatedUser);
      }
  };

  const completeMissionAction = (action: 'buy' | 'visit_shop' | 'chat_ai') => {
      if (!user || !user.dailyMissions) return;

      let changed = false;
      const newMissions = user.dailyMissions.map(m => {
          if (m.actionType === action && !m.isCompleted) {
              changed = true;
              return { ...m, isCompleted: true };
          }
          return m;
      });

      let updatedUser = { ...user, dailyMissions: newMissions };

      if (action === 'buy' && changed) {
          updatedUser.hasCompletedFirstBuy = true;
      }

      if (changed) {
          updateUserData(updatedUser);
          showNotification('Obiettivo Missione Raggiunto!', 'success');
      }
  };

  const claimMission = (missionId: string) => {
      if (!user || !user.dailyMissions) return;

      const mission = user.dailyMissions.find(m => m.id === missionId);
      if (!mission || !mission.isCompleted || mission.isClaimed) return;

      const newMissions = user.dailyMissions.map(m => 
          m.id === missionId ? { ...m, isClaimed: true } : m
      );

      let globalFlags = {};
      if (mission.actionType === 'buy') {
          globalFlags = { hasCompletedFirstBuy: true };
      }

      const updatedUser = {
          ...user,
          credits: user.credits + mission.reward,
          dailyMissions: newMissions,
          ...globalFlags
      };

      updateUserData(updatedUser);
      showNotification(`Riscattati ${mission.reward} Crediti!`, 'success');
  };

  const handleLogin = (loggedInUser: UserType, isNewUser: boolean = false) => {
    setUser(loggedInUser);
    localStorage.setItem('current_user', JSON.stringify(loggedInUser));

    if (isNewUser) {
      setTimeout(() => {
        setUser((currentUserState) => {
          const baseUser = currentUserState || loggedInUser;
          const updatedUser = { ...baseUser, credits: baseUser.credits + 100 };
          
          localStorage.setItem('current_user', JSON.stringify(updatedUser));
          const storedUsersStr = localStorage.getItem('app_users');
          if (storedUsersStr) {
            const users: UserType[] = JSON.parse(storedUsersStr);
            const dbUpdated = users.map(u => u.username === updatedUser.username ? updatedUser : u);
            localStorage.setItem('app_users', JSON.stringify(dbUpdated));
          }

          return updatedUser;
        });

        showNotification('grazie di esserti registrato, ecco a te 100 crediti', 'success');
      }, 5000);
    }
  };

  const showNotification = (message: string, type: 'error' | 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const updateUserData = (updatedUser: UserType) => {
    setUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    
    // Update local storage database
    const storedUsersStr = localStorage.getItem('app_users');
    if (storedUsersStr) {
      const users: UserType[] = JSON.parse(storedUsersStr);
      const updatedUsers = users.map(u => u.username === updatedUser.username ? updatedUser : u);
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    }
  };

  // Helper to check if user has bought a Brainrot item of a specific rarity
  const hasPurchasedRarity = (rarity: 'SECRET' | 'OG') => {
    if (!user || !user.history) return false;
    return user.history.some(record => {
      // Clean name logic kept for backward compatibility if user has old rainbow items
      const baseName = record.itemName.replace(' (Arcobaleno)', '');
      const item = SHOP_BRAINROT_ITEMS.find(p => p.name === baseName);
      return item && item.rarity === rarity;
    });
  };

  const addToCart = async (itemName: string, price: number, requiresCooldown: boolean = true) => {
    if (!user) {
      showNotification('Devi accedere per comprare!', 'error');
      return;
    }

    // CHECK COOLDOWN (Only for standard Passes)
    if (requiresCooldown) {
      const lastPurchase = localStorage.getItem('lastPurchaseTime');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (lastPurchase) {
        const lastTime = parseInt(lastPurchase, 10);
        if (now - lastTime < oneDay) {
          showNotification('errore 404: puoi comprare un oggetto al giorno', 'error');
          return;
        }
      }
    }

    // CHECK CREDITS
    if (user.credits < price) {
      showNotification('errore 9: crediti insufficenti', 'error');
      return;
    }

    // Process Purchase
    if (!cart.includes(itemName)) {
      // 1. Create Record
      const newPurchase: PurchaseRecord = {
        date: new Date().toLocaleString('it-IT'),
        itemName: itemName,
        price: price
      };

      // 2. Deduct Credits & Add to History
      const updatedUser = { 
        ...user, 
        credits: user.credits - price,
        history: [...(user.history || []), newPurchase]
      };
      
      updateUserData(updatedUser);

      // 3. Update visual state & cooldown (if applicable)
      setCart([...cart, itemName]);
      if (requiresCooldown) {
        localStorage.setItem('lastPurchaseTime', Date.now().toString());
      }

      // 4. Trigger Mission
      completeMissionAction('buy');

      // 5. Notification
      showNotification('Acquisto completato', 'success');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBody.trim()) return;
    
    setIsSendingMail(true);
    showNotification('Apertura app email...', 'success');

    const subject = `MESSAGGIO DA: ${user?.username || 'Guest'}`;
    const body = `${emailBody}\n\n(Inviato da Brainrot OP Store)`;
    window.location.href = `mailto:giulianivalerio2014@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setIsSendingMail(false);
    setEmailBody('');
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    
    if (view === 'home' || view === 'shop_brainrot') completeMissionAction('visit_shop'); 
  };
  
  return (
    <div className={`relative min-h-screen text-white selection:bg-purple-500 selection:text-white cursor-auto overflow-x-hidden font-sans ${!user ? 'h-screen overflow-hidden' : ''}`}>
      <FluidBackground />
      
      {/* AUTHENTICATION MODAL */}
      {!user && (
        <AuthModal onLogin={handleLogin} />
      )}

      {/* MAIN APP CONTENT */}
      <AnimatePresence>
        {user && (
          <motion.div 
            initial={{ filter: 'blur(20px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full"
          >
            
            <AIChat />

            {/* Notification Popup - CENTERED */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
                  animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-40%' }}
                  className={`fixed top-1/2 left-1/2 z-[100] w-[90vw] max-w-md px-8 py-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] border-2 font-heading font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-4 text-center backdrop-blur-xl ${
                    notification.type === 'error' 
                      ? 'bg-red-600/95 text-white border-red-500' 
                      : 'bg-green-600/95 text-white border-green-400'
                  }`}
                >
                  {notification.type === 'error' ? (
                    <AlertTriangle className="w-12 h-12 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-12 h-12" />
                  )}
                  <span className="text-xl md:text-2xl">{notification.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-6 mix-blend-difference pointer-events-none">
              
              {/* LEFT: Menu Button */}
              <div className="pointer-events-auto flex items-center gap-4">
                  <button 
                    className="text-white p-2 hover:text-purple-400 transition-colors"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="w-8 h-8" />
                  </button>
                  <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white hidden md:block">
                    {currentView === 'credits' ? 'MISSIONI & CREDITI' : 
                     currentView === 'admin' ? 'ADMIN ZONE' : 
                     currentView === 'shop_brainrot' ? 'SHOP BRAINROT' : 'OP STORE'}
                  </div>
              </div>

              {/* CENTER: Online Counter */}
              <div className="pointer-events-auto flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-1 rounded-full backdrop-blur-md">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                 <span className="font-mono font-bold text-sm text-green-400">{onlineUsers} UTENTI REGISTRATI</span>
              </div>
              
              {/* RIGHT: User Info */}
              <div className="pointer-events-auto flex gap-4 text-sm font-bold tracking-widest uppercase items-center">
                  <div className="flex items-center gap-4 text-white bg-white/10 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="hidden md:inline">{user.username}</span>
                      <span className="md:hidden">{user.username.length > 8 ? user.username.substring(0,6)+'..' : user.username}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/20" />
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span>{user.credits}</span>
                      <CreditIcon />
                    </div>
                  </div>
              </div>
            </nav>

            {/* SIDEBAR NAVIGATION DRAWER */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-0 left-0 bottom-0 z-[50] w-80 bg-black/95 border-r border-white/10 p-8 flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.2)]"
                  >
                    <div className="flex justify-between items-center mb-12">
                      <span className="font-heading font-bold text-2xl">MENU</span>
                      <button onClick={() => setMobileMenuOpen(false)}><X /></button>
                    </div>

                    <div className="flex flex-col gap-6">
                      <button 
                        onClick={() => navigateTo('home')}
                        className={`text-3xl font-heading font-bold uppercase text-left hover:text-purple-400 transition-colors ${currentView === 'home' ? 'text-purple-500' : 'text-white'}`}
                      >
                        Home
                      </button>
                      <button 
                        onClick={() => navigateTo('credits')}
                        className={`text-3xl font-heading font-bold uppercase text-left hover:text-purple-400 transition-colors ${currentView === 'credits' ? 'text-purple-500' : 'text-white'}`}
                      >
                        Crediti
                      </button>

                      <button 
                        onClick={() => navigateTo('shop_brainrot')}
                        className={`text-2xl font-heading font-bold uppercase text-left flex items-center gap-2 hover:text-fuchsia-400 transition-colors ${currentView === 'shop_brainrot' ? 'text-fuchsia-500' : 'text-white'}`}
                      >
                         Shop Brainrot ☢️
                      </button>
                      
                      <div className="h-px bg-white/10 my-4" />
                      
                      <button 
                        onClick={() => navigateTo('admin')}
                        className={`text-xl font-heading font-bold uppercase text-left flex items-center gap-3 hover:text-red-500 transition-colors ${currentView === 'admin' ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        <ShieldAlert className="w-5 h-5" /> Admin Zone
                      </button>

                      <button 
                        onClick={handleLogout}
                        className="text-lg font-heading font-bold uppercase text-left flex items-center gap-3 text-gray-500 hover:text-white transition-colors mt-4"
                      >
                        <Lock className="w-4 h-4" /> Esci
                      </button>
                    </div>

                    <div className="mt-auto border-t border-white/10 pt-8">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-gray-400">
                          <span>Utente</span>
                          <span className="text-white font-bold text-xs truncate max-w-[150px]">{user.username}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400">
                           <span>Versione</span>
                           <span className="text-purple-400 font-mono">v4.0 BRAINROT</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* VIEW CONTENT SWITCHER */}
            {currentView === 'admin' ? (
              <AdminPanel />
            ) : currentView === 'credits' ? (
              <div className="min-h-screen pt-32 px-4 pb-20 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                   <h1 className="text-4xl md:text-6xl font-heading font-black mb-4">
                     <span className="text-white stroke-black" style={{ WebkitTextStroke: '1px white' }}>STEAL A BRAINROT</span><br/>
                     <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                        CREDITS
                     </span>
                   </h1>
                   <p className="text-gray-400 text-lg mb-2">Completa missioni giornaliere per farmare crediti</p>
                   <p className="text-yellow-400 font-bold text-sm uppercase tracking-widest animate-pulse">
                      ⚠️ C'è l'1% di probabilità che appaia la ORO MISSION (1000 CR)
                   </p>
                </div>

                {/* Missions List */}
                <div className="grid gap-4">
                   {user.dailyMissions?.map((mission) => (
                      <motion.div 
                        key={mission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative p-6 rounded-xl border-2 flex flex-col md:flex-row justify-between items-center gap-4 overflow-hidden ${
                            mission.type === 'gold' 
                             ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-600/20 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.3)]' 
                             : 'bg-white/5 border-white/10'
                        }`}
                      >
                         {/* Shimmer Effect for Gold */}
                         {mission.type === 'gold' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                         )}

                         <div className="flex items-center gap-4 z-10">
                            <div className={`p-4 rounded-full ${mission.type === 'gold' ? 'bg-yellow-500 text-black' : 'bg-purple-600/20 text-purple-400'}`}>
                               {mission.type === 'gold' ? <Trophy className="w-8 h-8" /> : <Gift className="w-6 h-6" />}
                            </div>
                            <div className="text-center md:text-left">
                               <h3 className={`font-heading font-bold text-xl uppercase ${mission.type === 'gold' ? 'text-yellow-400' : 'text-white'}`}>
                                  {mission.title}
                               </h3>
                               <p className="text-gray-400 text-sm">
                                  Ricompensa: <span className="text-white font-bold">{mission.reward} Crediti</span>
                               </p>
                            </div>
                         </div>

                         <div className="z-10">
                            {mission.isClaimed ? (
                               <button disabled className="px-6 py-3 bg-gray-800 text-gray-500 font-bold uppercase rounded-lg border border-gray-700 flex items-center gap-2 cursor-not-allowed">
                                  <Check className="w-4 h-4" /> Riscattato
                               </button>
                            ) : mission.isCompleted ? (
                               <button 
                                  onClick={() => claimMission(mission.id)}
                                  className={`px-8 py-3 font-bold uppercase rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 ${
                                     mission.type === 'gold' 
                                      ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                                      : 'bg-green-600 text-white hover:bg-green-500'
                                  }`}
                               >
                                  RISCATTA <CreditIcon />
                               </button>
                            ) : (
                               <div className="px-6 py-3 bg-white/5 text-gray-500 font-bold uppercase rounded-lg border border-white/10 text-sm">
                                  In Corso...
                               </div>
                            )}
                         </div>
                      </motion.div>
                   ))}
                   
                   {(!user.dailyMissions || user.dailyMissions.length === 0) && (
                      <div className="text-center py-10 text-gray-500">
                         Caricamento missioni...
                      </div>
                   )}
                </div>
              </div>
            ) : currentView === 'shop_brainrot' ? (
              /* --- NEW: BRAINROT SHOP VIEW --- */
              <div className="min-h-screen pt-32 px-4 pb-20 max-w-7xl mx-auto">
                 <div className="flex items-center justify-between mb-16">
                      <div className="flex items-center gap-4">
                        <ShoppingCart className="w-8 h-8 text-fuchsia-400" />
                        <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter uppercase bg-gradient-to-r from-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                            Shop Brainrot
                        </h2>
                      </div>
                      <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-fuchsia-500/20 rounded-full bg-fuchsia-900/10">
                        <span className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold tracking-widest uppercase text-fuchsia-300">Esclusivo</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {SHOP_BRAINROT_ITEMS.map((product) => (
                        <div key={product.id} className="group relative bg-[#121212] border border-fuchsia-500/20 rounded-2xl overflow-hidden hover:border-fuchsia-500 transition-colors duration-500 shadow-lg shadow-fuchsia-900/20">
                          {/* Rarity Badge */}
                          <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border shadow-lg ${
                            product.rarity === 'Legendary' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 
                            product.rarity === 'Rare' ? 'bg-blue-500/20 border-blue-500 text-blue-500' :
                            product.rarity === 'SECRET' ? 'bg-black border-white text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' :
                            product.rarity === 'OG' ? 'bg-white/10 border-transparent text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-pulse' :
                            'bg-gray-500/20 border-gray-500 text-gray-500'
                          }`}>
                            {product.rarity === 'OG' ? (
                               <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">OG</span>
                            ) : product.rarity === 'SECRET' ? (
                               <span className="text-black bg-white px-1 rounded font-black shadow-[0_0_10px_white]">SECRET</span>
                            ) : (
                                product.rarity
                            )}
                          </div>

                          {/* Product Image */}
                          <div className="aspect-square relative overflow-hidden bg-black/50 p-8">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                              />
                          </div>

                          {/* Info */}
                          <div className="p-6">
                            <h3 className="text-2xl font-bold font-heading uppercase text-fuchsia-100 mb-6">{product.name}</h3>
                            
                            {/* Description removed as requested */}

                            {/* SINGLE BUY BUTTON (Unlimited - No Cooldown) */}
                            <button 
                              onClick={() => addToCart(product.name, product.priceValue, false)}
                              disabled={cart.includes(product.name)}
                              className={`w-full py-4 px-6 font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-between rounded-lg ${
                                cart.includes(product.name)
                                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-black hover:bg-fuchsia-500 hover:text-white hover:scale-105'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                  {cart.includes(product.name) ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                                  {cart.includes(product.name) ? 'Comprato' : 'Compra'}
                              </span>
                              <span className="flex items-center gap-1 font-mono text-xs bg-black/10 px-2 py-1 rounded">
                                  {product.price} <CreditIcon size="w-3 h-3"/>
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
              </div>
            ) : (
              /* HOME VIEW */
              <>
                {/* HERO SECTION */}
                <section className="relative h-screen flex flex-col items-center justify-center pt-20">
                  <motion.div 
                    style={{ y, opacity }}
                    className="container mx-auto px-4 z-10 text-center"
                  >
                    <h1 className="text-[12vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter mb-6">
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mix-blend-overlay">STEAL A</span><br />
                      <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 bg-clip-text text-transparent">BRAINROT OP!</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-light tracking-[0.2em] text-gray-300 mb-12 uppercase">
                      steal a brainrot op shop!
                    </p>
                  </motion.div>
                </section>

                {/* GALLERY SECTION */}
                <section className="py-32 px-4 md:px-8 bg-black/40 backdrop-blur-sm border-t border-white/10">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-16">
                      <Camera className="w-8 h-8 text-purple-500" />
                      <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter uppercase bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                        brainrot nuova uscita
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {GALLERY_ITEMS.map((item) => (
                        <div key={item.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/20 bg-gray-900 cursor-pointer">
                          {/* Image */}
                          <img 
                            src={item.src} 
                            alt={item.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale"
                          />
                          
                          {/* Hover Overlay - Chrome/Holographic Effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-gray-200/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-hard-light" />
                          
                          {/* Text Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-white/90 group-hover:via-white/50 transition-colors duration-500">
                             <h3 className="text-xl font-bold font-heading uppercase tracking-wider text-white group-hover:text-black transition-colors duration-500">
                               {item.caption}
                             </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* SHOP SECTION */}
                <section className="py-32 px-4 md:px-8 relative">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-16">
                      <div className="flex items-center gap-4">
                        <ShoppingBag className="w-8 h-8 text-yellow-400" />
                        <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter uppercase">Negozio Item</h2>
                      </div>
                      <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold tracking-widest uppercase">the best shop website</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {SHOP_ITEMS.map((product) => {
                        // LOCK LOGIC
                        let isLocked = false;
                        let lockMessage = '';

                        if (product.id === '2') { // Quest Time
                            if (!hasPurchasedRarity('SECRET')) {
                                isLocked = true;
                                lockMessage = 'Sblocca con Brainrot SECRET';
                            }
                        } else if (product.id === '3') { // Quest Time OG
                            if (!hasPurchasedRarity('OG')) {
                                isLocked = true;
                                lockMessage = 'Sblocca con Brainrot OG';
                            }
                        }

                        return (
                        <div key={product.id} className="group relative bg-[#121212] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-colors duration-500">
                          {/* Rarity Badge */}
                          <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                            product.rarity === 'Legendary' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 
                            product.rarity === 'Rare' ? 'bg-blue-500/20 border-blue-500 text-blue-500' :
                            product.rarity === 'Mythic' ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-500' :
                            'bg-gray-500/20 border-gray-500 text-gray-500'
                          }`}>
                            {product.rarity}
                          </div>

                          {/* Product Image */}
                          <div className="aspect-square relative overflow-hidden bg-black/50 p-8">
                            {product.id === '3' ? (
                                /* CUSTOM RENDER FOR PASS 3 (BLUE BG + RAINBOW TEXT) */
                                <div className={`absolute inset-0 flex items-center justify-center flex-col p-4 text-center ${isLocked ? 'bg-gray-900 grayscale' : 'bg-blue-700'}`}>
                                    <h2 className="text-4xl font-black text-white italic drop-shadow-lg">QUEST TIME</h2>
                                    <h2 className="text-6xl font-black mt-2 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                        OG
                                    </h2>
                                </div>
                            ) : (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className={`w-full h-full object-contain transition-transform duration-500 ${isLocked ? 'grayscale opacity-50' : 'group-hover:scale-110'}`}
                                />
                            )}
                            
                            {/* LOCK OVERLAY */}
                            {isLocked && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                    <Lock className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-2xl font-bold font-heading uppercase">{product.name}</h3>
                              <div className="flex flex-col items-end">
                                <span className={`text-xl font-bold flex items-center gap-1 ${isLocked ? 'text-gray-600' : 'text-yellow-400'}`}>
                                    {product.price} <CreditIcon />
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed border-t border-white/10 pt-4">
                              {product.description}
                            </p>

                            <button 
                              onClick={() => addToCart(product.name, product.priceValue, true)}
                              disabled={cart.includes(product.name) || isLocked}
                              className={`w-full py-4 px-6 font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                isLocked 
                                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                  : cart.includes(product.name)
                                    ? 'bg-green-600 text-white cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-purple-500 hover:text-white'
                              }`}
                            >
                              {isLocked ? (
                                <span className="flex items-center gap-2"><Lock className="w-4 h-4"/> {lockMessage}</span>
                              ) : cart.includes(product.name) ? (
                                <>Comprato <Check className="w-4 h-4" /></>
                              ) : (
                                <>Compra <Zap className="w-4 h-4" /></>
                              )}
                            </button>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* FOOTER - Contact Form */}
            <footer className="py-20 px-4 border-t border-white/10 bg-black text-center">
                <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
                   <Mail className="w-12 h-12 text-gray-600 mb-2" />
                   <h2 className="text-3xl font-heading font-bold">CONTATTACI</h2>
                   <p className="text-gray-400">Hai bisogno di aiuto? Mandaci un'email diretta.</p>
                   
                   <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4 mt-4">
                      <textarea 
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Scrivi qui il tuo messaggio..."
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none resize-none"
                      />
                      <button 
                        disabled={isSendingMail || !emailBody.trim()}
                        className="w-full py-4 bg-white text-black font-bold uppercase rounded-xl hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                         {isSendingMail ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                         INVIA MESSAGGIO
                      </button>
                   </form>
                   <p className="text-xs text-gray-600 mt-4">Brainrot OP Store © 2025</p>
                </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
