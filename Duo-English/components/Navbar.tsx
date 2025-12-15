import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, LogOut, Hexagon, Loader2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, login, logout, isLoggingIn } = useStore();
  const [prevLevel, setPrevLevel] = useState(user?.level || 0);

  // Detect Level Up for Animation
  useEffect(() => {
    if (user && user.level > prevLevel) {
        setPrevLevel(user.level);
        // Could trigger confetti here if desired
    }
  }, [user?.level]);

  // Calculate Progress towards next level
  // Formula: Level = Math.floor(XP / 100) + 1
  // Therefore: XP for Current Level Start = (Level - 1) * 100
  // XP for Next Level = Level * 100
  const xpPerLevel = 100;
  const currentLevelXPStart = user ? (user.level - 1) * xpPerLevel : 0;
  const nextLevelXP = user ? user.level * xpPerLevel : 100;
  const currentProgressXP = user ? user.xp - currentLevelXPStart : 0;
  const progressPercent = Math.min((currentProgressXP / xpPerLevel) * 100, 100);

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-slate-900/40 backdrop-blur-md border-b border-white/5 shadow-lg transition-all duration-300">
      
      {/* 1. Left: Brand */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-10 h-10 group-hover:scale-105 transition-transform">
           <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
              <g transform="translate(15, 10)">
                   <rect x="0" y="0" width="60" height="50" rx="12" fill="#6A1B9A"/>
                  <path d="M10 50 L25 50 L10 65 Z" fill="#6A1B9A"/>
              </g>
              <g transform="translate(25, 25)">
                   <rect x="0" y="0" width="60" height="50" rx="12" fill="#FF8F00" stroke="white" strokeWidth="3"/>
                  <path d="M40 50 L55 50 L55 65 Z" fill="#FF8F00" stroke="white" strokeWidth="3" strokeLinejoin="round"/>
                  <text x="30" y="35" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">D</text>
              </g>
          </svg>
        </div>
        <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
          Duoduo English
        </h1>
      </div>

      {/* 2. Right: Auth Zone */}
      <div className="flex items-center gap-4">
        
        <AnimatePresence mode="wait">
          {!user ? (
            /* STATE A: GUEST (Login Button) */
            <motion.button
              key="login-btn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={login}
              disabled={isLoggingIn}
              className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-slate-800 font-bold text-sm"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </motion.button>
          ) : (
            /* STATE B: AGENT PROFILE */
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-4 bg-slate-800/50 p-1.5 pr-4 rounded-full border border-white/10 backdrop-blur-md"
            >
                {/* Level Badge */}
                <div className="relative flex items-center justify-center w-10 h-10">
                    <Hexagon className="w-10 h-10 text-indigo-500 fill-indigo-900/50 drop-shadow-lg" />
                    <span className="absolute text-[10px] font-bold text-white leading-none mt-0.5">
                        Lvl {user.level}
                    </span>
                    {/* Level Up Glow Effect */}
                    {user.level > prevLevel && (
                        <motion.div 
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 2, opacity: 0 }}
                            className="absolute inset-0 bg-indigo-400 rounded-full blur-xl"
                        />
                    )}
                </div>

                {/* XP Bar Section */}
                <div className="flex flex-col w-24">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        <span>XP</span>
                        <span>{user.xp} / {nextLevelXP}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-periwinkle to-mint"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        />
                    </div>
                </div>

                {/* Avatar with Menu Trigger */}
                <button onClick={logout} className="relative group">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 p-0.5 group-hover:border-red-400 transition-colors">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    {/* Tooltip-ish logout hint */}
                    <div className="absolute top-10 right-0 bg-red-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Logout
                    </div>
                </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};