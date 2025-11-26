
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { User, PurchaseRecord } from '../types';
import { Lock, Search, PlusCircle, Database, History, Users, Mail, Ban, X, Check, Unlock, MinusCircle, Trophy } from 'lucide-react';
import CreditIcon from './CreditIcon';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');
  
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // BAN MODAL STATE
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');

  // Credentials
  const ADMIN_USERNAME = 'Valerio';
  const ADMIN_PASSWORD = 'Viaverdi9';

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const loadUsers = () => {
    const stored = localStorage.getItem('app_users');
    if (stored) {
      setUsers(JSON.parse(stored));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === ADMIN_USERNAME && adminPass === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Accesso Negato: Credenziali Admin Errate');
    }
  };

  const modifyCredits = (targetUsername: string, amount: number) => {
    const updatedUsers = users.map(u => {
      if (u.username === targetUsername) {
        // Prevent negative credits? Optional. Currently allowing debt.
        const newCredits = (u.credits || 0) + amount;
        return { ...u, credits: newCredits < 0 ? 0 : newCredits };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    // Update active session if it matches
    const currentUserStr = localStorage.getItem('current_user');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.username === targetUsername) {
            const newCredits = currentUser.credits + amount;
            currentUser.credits = newCredits < 0 ? 0 : newCredits;
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        }
    }
    const action = amount > 0 ? 'Aggiunti' : 'Rimossi';
    alert(`${action} ${Math.abs(amount)} crediti a ${targetUsername}`);
  };

  const spawnGoldMission = (targetUsername: string) => {
     const updatedUsers = users.map(u => {
      if (u.username === targetUsername) {
        return { ...u, nextMissionIsGold: true };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    alert(`ORO MISSION garantita attivata per ${targetUsername}! Apparirà al suo prossimo aggiornamento.`);
  };

  const openBanModal = (username: string) => {
    setUserToBan(username);
    setBanReason('');
    setBanModalOpen(true);
  };

  const executeBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToBan || !banReason.trim()) return;

    const updatedUsers = users.map(u => {
      if (u.username === userToBan) {
        return { ...u, isBanned: true, banReason: banReason };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    setBanModalOpen(false);
    setUserToBan(null);
    alert(`Utente ${userToBan} BANNATO con successo.`);
  };

  // REMOVED UNBAN FUNCTIONALITY AS REQUESTED (Permanent Ban)

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-black/80 border border-red-500/30 p-8 rounded-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-6 text-red-500">
            <Lock className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-heading font-bold uppercase">Admin Zone</h2>
            <p className="text-sm font-mono opacity-70">Area riservata. Accesso monitorato.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Username Admin"
              value={adminUser}
              onChange={e => setAdminUser(e.target.value)}
              className="w-full bg-black border border-red-900/50 p-3 rounded text-white focus:border-red-500 outline-none"
            />
            <input 
              type="password" 
              placeholder="Password"
              value={adminPass}
              onChange={e => setAdminPass(e.target.value)}
              className="w-full bg-black border border-red-900/50 p-3 rounded text-white focus:border-red-500 outline-none"
            />
            {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}
            
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded uppercase tracking-widest transition-colors">
              Verifica Accesso
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 max-w-7xl mx-auto relative">
      
      {/* BAN MODAL */}
      <AnimatePresence>
        {banModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] border-2 border-red-600 rounded-xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(220,38,38,0.3)]"
            >
              <div className="flex justify-between items-center mb-4 text-red-500">
                <h3 className="text-xl font-bold uppercase flex items-center gap-2"><Ban /> BANNA UTENTE</h3>
                <button onClick={() => setBanModalOpen(false)}><X /></button>
              </div>
              <p className="text-white mb-4">Stai per bannare: <span className="font-bold text-red-400">{userToBan}</span></p>
              
              <form onSubmit={executeBan}>
                 <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Motivazione (Obbligatoria)</label>
                 <textarea 
                   required
                   value={banReason}
                   onChange={(e) => setBanReason(e.target.value)}
                   className="w-full h-32 bg-black/50 border border-white/20 rounded p-3 text-white mb-4 focus:border-red-500 outline-none resize-none"
                   placeholder="Es. Comportamento scorretto, Spam, etc."
                 />
                 <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded uppercase">
                   CONFERMA BAN
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-white/10 pb-6">
        <div>
           <h1 className="text-4xl font-heading font-bold text-red-500 flex items-center gap-3">
             <Database className="w-8 h-8" /> DATABASE ADMIN
           </h1>
           <p className="text-gray-400 font-mono mt-2">Gestione Utenti & Transazioni</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Utenti Registrati</p>
            <p className="text-3xl font-heading font-bold text-white">{users.length}</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cerca username o email..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500"
          />
      </div>

      {/* USER LIST */}
      <div className="grid gap-6">
        {filteredUsers.map((user, idx) => (
          <div key={idx} className={`border rounded-xl overflow-hidden shadow-lg transition-colors ${user.isBanned ? 'bg-red-900/10 border-red-500/50' : 'bg-[#111] border-white/10'}`}>
            {/* Header User */}
            <div className="p-6 bg-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner ${user.isBanned ? 'bg-red-600 text-white' : 'bg-gradient-to-br from-purple-600 to-blue-600'}`}>
                   {user.isBanned ? <Ban className="w-6 h-6" /> : user.username.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h3 className="font-bold text-xl text-white flex items-center gap-2">
                     {user.username}
                     {user.isBanned && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">BANNATO</span>}
                     {user.nextMissionIsGold && <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center gap-1"><Trophy size={10}/> ORO PENDING</span>}
                   </h3>
                   <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm mt-1">
                     <span className="text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email || 'N/A'}
                     </span>
                     <span className="text-gray-500 font-mono">Pass: {user.password}</span>
                   </div>
                   {user.isBanned && (
                     <div className="mt-2 text-red-400 text-xs font-mono border-l-2 border-red-500 pl-2">
                       Motivo: {user.banReason}
                     </div>
                   )}
                 </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
                 <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs uppercase text-gray-500 font-bold">Saldo:</span>
                    <span className="text-yellow-400 font-bold flex items-center gap-1 text-lg">
                       {user.credits} <CreditIcon />
                    </span>
                 </div>

                 <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => modifyCredits(user.username, -100)}
                      className="px-3 py-2 bg-red-900/30 text-red-400 border border-red-500/30 rounded hover:bg-red-500/20 text-xs font-bold uppercase flex items-center gap-1"
                      title="Rimuovi 100 crediti"
                    >
                      <MinusCircle className="w-3 h-3" /> 100
                    </button>
                    <button 
                      onClick={() => modifyCredits(user.username, 100)}
                      className="px-3 py-2 bg-green-900/30 text-green-400 border border-green-500/30 rounded hover:bg-green-500/20 text-xs font-bold uppercase flex items-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" /> 100
                    </button>
                    <button 
                      onClick={() => modifyCredits(user.username, 500)}
                      className="px-3 py-2 bg-purple-900/30 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-500/20 text-xs font-bold uppercase flex items-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" /> 500
                    </button>
                    
                    <button 
                      onClick={() => spawnGoldMission(user.username)}
                      className="px-3 py-2 bg-yellow-900/30 text-yellow-400 border border-yellow-500/30 rounded hover:bg-yellow-500/20 text-xs font-bold uppercase flex items-center gap-1"
                      title="Forza Oro Mission al prossimo tentativo"
                    >
                      <Trophy className="w-3 h-3" /> GOLD
                    </button>

                    {user.isBanned ? (
                       <div className="px-3 py-2 bg-red-600 text-white font-bold text-xs uppercase rounded border border-red-500 flex items-center gap-1 cursor-not-allowed opacity-80">
                         <Ban className="w-3 h-3" /> BANNATO PERMANENTEMENTE
                       </div>
                    ) : (
                       <button 
                         onClick={() => openBanModal(user.username)}
                         className="px-3 py-2 bg-red-900/30 text-red-500 border border-red-500/30 rounded hover:bg-red-900/50 text-xs font-bold uppercase flex items-center gap-1"
                         title="Banna Utente"
                       >
                         <Ban className="w-3 h-3" /> BAN
                       </button>
                    )}
                 </div>
              </div>
            </div>

            {/* History Section */}
            <div className="p-6 border-t border-white/5 bg-black/20">
               <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                 <History className="w-3 h-3" /> Storico Acquisti
               </h4>
               
               {!user.history || user.history.length === 0 ? (
                 <p className="text-gray-600 text-sm italic">Nessun acquisto effettuato.</p>
               ) : (
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                   {user.history.map((record, hIdx) => {
                     const isRainbow = record.itemName.includes('(Arcobaleno)');
                     return (
                     <div key={hIdx} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                        <span className={`font-medium ${isRainbow ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent' : 'text-white'}`}>
                          {record.itemName}
                        </span>
                        <div className="flex gap-4">
                           <span className="text-red-400 flex items-center gap-1 font-mono">-{record.price} <CreditIcon size="w-3 h-3"/></span>
                           <span className="text-gray-500 text-xs">{record.date}</span>
                        </div>
                     </div>
                   )})}
                 </div>
               )}
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-xl">
            Nessun utente trovato nel database.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
