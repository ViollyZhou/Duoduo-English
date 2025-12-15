import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home, Zap, Target, Flame } from 'lucide-react';
import { useStore } from '../store';

interface MissionSuccessViewProps {
  score: number;
  onHome: () => void;
}

export const MissionSuccessView: React.FC<MissionSuccessViewProps> = ({ score, onHome }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const { addXP } = useStore();

  useEffect(() => {
    // Animate numbers up
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setDisplayScore(Math.floor(score * ease));
      setAccuracy(Math.floor(96 * ease)); // Mock 96% accuracy for the demo

      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [score]);

  const handleContinue = () => {
    // Award 50 XP upon completion
    addXP(50);
    onHome();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* 1. Dark Background with subtle gradient matching the Cyber-Cockpit feel */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-950 to-emerald-900/20" />
      </div>

      {/* 2. Particles/Confetti Effect */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full bg-white/20"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
            y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
            opacity: 0 
          }}
          animate={{ 
            y: -100, 
            opacity: [0, 0.8, 0],
            x: `calc(${Math.random() * 100}vw)`
          }}
          transition={{ 
            duration: 3 + Math.random() * 4, 
            repeat: Infinity, 
            delay: Math.random() * 2,
            ease: "easeOut" 
          }}
        />
      ))}

      {/* 3. Glassmorphic Victory Card */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-md p-8 mx-4"
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-indigo-500/10" />
        
        <div className="relative flex flex-col items-center text-center">
            
            {/* Bouncing Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
              className="w-28 h-28 mb-6 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]"
            >
                <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <Trophy className="w-14 h-14 text-white fill-white" />
                </motion.div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight drop-shadow-lg">Mission Complete!</h2>
            <p className="text-slate-400 mb-8 font-medium">Conversational Mastery Achieved.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full mb-8">
                {/* XP */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm"
                >
                    <span className="text-yellow-400 mb-2"><Zap className="w-6 h-6 fill-yellow-400" /></span>
                    <span className="text-2xl font-bold text-white">+{displayScore}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">XP Gained</span>
                </motion.div>
                
                {/* Accuracy */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm"
                >
                    <span className="text-mint mb-2"><Target className="w-6 h-6" /></span>
                    <span className="text-2xl font-bold text-white">{accuracy}%</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Accuracy</span>
                </motion.div>
                
                {/* Streak */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm"
                >
                    <span className="text-orange-500 mb-2"><Flame className="w-6 h-6 fill-orange-500" /></span>
                    <span className="text-2xl font-bold text-white">5</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Day Streak</span>
                </motion.div>
            </div>

            {/* Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinue}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">Back to Menu <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /></span>
            </motion.button>

        </div>
      </motion.div>
    </div>
  );
};