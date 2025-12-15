import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CyberVisualizerProps {
  mode: 'idle' | 'playing' | 'recording';
}

export const CyberVisualizer: React.FC<CyberVisualizerProps> = ({ mode }) => {
  const [bars] = useState(Array.from({ length: 24 }));

  return (
    <div className="flex items-center justify-center gap-[3px] h-16 w-full max-w-sm mx-auto">
      {bars.map((_, i) => {
        // Calculate a center-weighted scale for idle/recording visuals
        const isCenter = i > 6 && i < 18;
        
        return (
          <motion.div
            key={i}
            className={`w-1.5 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] ${
              mode === 'recording' ? 'bg-mint shadow-mint' : 
              mode === 'playing' ? 'bg-periwinkle shadow-periwinkle' : 
              'bg-slate-700'
            }`}
            initial={{ height: 4 }}
            animate={{
              height: mode === 'idle' 
                ? 4 
                : mode === 'playing'
                  ? [8, 12 + Math.random() * 30, 8] // Random spikes for playback
                  : [8, isCenter ? 20 + Math.random() * 40 : 10 + Math.random() * 15, 8], // Voice pattern
              opacity: mode === 'idle' ? 0.3 : 1
            }}
            transition={{
              duration: mode === 'idle' ? 0 : 0.2,
              repeat: mode === 'idle' ? 0 : Infinity,
              repeatType: "reverse",
              delay: i * 0.02,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};