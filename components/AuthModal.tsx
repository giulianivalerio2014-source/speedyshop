
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, AlertTriangle, ArrowRight, Mail, AtSign, Ban } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onLogin: (user: UserType, isNewUser?: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (emailStr: string) => {
    return String(emailStr)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const storedUsersStr = localStorage.getItem('app_users');
    const storedUsers: UserType[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

    if (isLoginMode) {
      // --- LOGIN LOGIC (Username & Password) ---
      if (!username || !password) {
        setError('Inserisci Username e Password');
        return;
      }

      const foundUser = storedUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (foundUser) {
        // CHECK IF BANNED
        if (foundUser.isBanned) {
          setError(`ACCOUNT BANNATO: ${foundUser.banReason || 'Violazione dei termini.'}`);
          return;
        }

        // Ensure legacy compatibility
        if (foundUser.credits === undefined) foundUser.credits = 0;
        if (!foundUser.history) foundUser.history = [];
        
        onLogin(foundUser, false);
      } else {
        setError('Errore 403: Credenziali sbagliate');
      }

    } else {
      // --- REGISTRATION LOGIC (Username, Email, Password) ---
      if (!username || !email || !password) {
        setError('Compila tutti i campi');
        return;
      }

      // 1. Validate Email Format
      if (!validateEmail(email)) {
        setError('Indirizzo email non valido');
        return;
      }

      // 2. Check for Homonymy (Username must be unique)
      const usernameTaken = storedUsers.some((u) => u.username.toLowerCase() === username.toLowerCase());
      if (usernameTaken) {
        setError('Questo Username è già in uso! Scegline un altro.');
        return;
      }

      // 3. Create User
      // Start with 0 credits. The +100 bonus is handled in App.tsx after 5 seconds.
      const newUser: UserType = { 
        username, 
        email,
        password, 
        credits: 0, 
        history: [] 
      };
      
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      
      // Auto login after register
      onLogin(newUser, true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#121212] border border-white/10 p-8 rounded-2xl shadow-2xl shadow-purple-500/20 relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-purple-500/20 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4 border border-white/10">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl font-heading font-bold uppercase tracking-tight">
              {isLoginMode ? 'Accedi' : 'Registrati'}
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              {isLoginMode ? 'Inserisci le tue credenziali' : 'Crea il tuo profilo Brainrot'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* USERNAME FIELD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Nome Utente (Univoco)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="" 
                />
              </div>
            </div>

            {/* EMAIL FIELD (Only for Registration) */}
            <AnimatePresence>
              {!isLoginMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 mt-4">
                    Email (Contatto)
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="tuamail@esempio.com"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 mt-4">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-red-500 text-sm font-bold bg-red-500/10 p-3 rounded border border-red-500/20 mt-2"
                >
                  <div className="mt-0.5"><AlertTriangle className="w-4 h-4" /></div>
                  <span className="uppercase">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold uppercase py-4 rounded-lg hover:bg-purple-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {isLoginMode ? 'Entra' : 'Crea Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
                setUsername('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              {isLoginMode ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
