import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mission } from '../types';
import { ArrowRight, MapPin } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Mission;
  onClick: () => void;
  layoutId?: string;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick, layoutId }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getButtonHoverClass = () => {
    switch (scenario.color) {
      case 'mint': return 'group-hover:bg-mint group-hover:border-mint group-hover:text-white';
      case 'coral': return 'group-hover:bg-coral group-hover:border-coral group-hover:text-white';
      case 'periwinkle': return 'group-hover:bg-periwinkle group-hover:border-periwinkle group-hover:text-white';
      default: return 'group-hover:bg-white group-hover:text-slate-900';
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative h-96 w-full rounded-3xl cursor-pointer group perspective-1000"
      // CHANGED: Removed initial="hidden" to ensure visibility
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        zIndex: 10
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Background Image/Gradient */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
        <img 
          src={scenario.bgImage} 
          alt={scenario.title} 
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white" style={{ transform: "translateZ(50px)" }}>
        
        {/* Top Badges */}
        <div className="mb-auto mt-2 flex justify-between items-start transform translate-z-20">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/10 ${
                scenario.level === 'Beginner' ? 'text-mint' : 
                scenario.level === 'Intermediate' ? 'text-periwinkle' : 'text-coral'
             }`}>
                {scenario.level}
             </span>
             <div className="text-4xl drop-shadow-md">{scenario.emoji}</div>
        </div>
        
        <div className="transform translate-z-30 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                <MapPin className="w-3 h-3" /> {scenario.location}
              </div>
              <h3 className="text-2xl font-display font-bold leading-tight">{scenario.title}</h3>
            </div>

            {/* Vocab Chips */}
            <div className="flex flex-wrap gap-2">
              {scenario.vocab.map((word, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-sm border border-white/10 text-[10px] text-white/90">
                  {word}
                </span>
              ))}
            </div>
            
            <motion.button 
                className={`w-full py-3 mt-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 ${getButtonHoverClass()}`}
            >
                Start Mission <ArrowRight className="w-4 h-4" />
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
};