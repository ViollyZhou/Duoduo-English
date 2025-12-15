import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  score: number; // 0 to 100
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#1e293b" // slate-800
          strokeWidth="8"
        />
        {/* Foreground Circle */}
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={score > 80 ? '#34D399' : score > 50 ? '#FBBF24' : '#FB7185'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold font-display"
        >
          {score}%
        </motion.span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400">Match</span>
      </div>
    </div>
  );
};