import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WaveformProps {
  active: boolean;
  color: string;
  isTarget?: boolean; // If true, it's the "Goal" waveform (gray). If false, it's the user.
}

export const Waveform: React.FC<WaveformProps> = ({ active, color, isTarget = false }) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Generate random heights for the visualizer bars
    const initialBars = Array.from({ length: 20 }, () => Math.random());
    setBars(initialBars);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 h-16 w-full max-w-xs mx-auto">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className={`w-2 rounded-full ${isTarget ? 'bg-gray-300 opacity-50' : color}`}
          initial={{ height: 10 }}
          animate={{
            height: active 
              ? [10, 10 + height * 40, 10] 
              : isTarget 
                ? [10, 15, 10] // Subtle breathing for target
                : 8, // Flat for inactive user
          }}
          transition={{
            duration: active ? 0.3 : 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
