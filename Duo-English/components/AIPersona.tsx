import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Ear, Check, RefreshCcw } from 'lucide-react';

interface AIPersonaProps {
  status: 'idle' | 'listening' | 'analyzing' | 'success' | 'retry';
}

export const AIPersona: React.FC<AIPersonaProps> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'listening': return 'bg-periwinkle border-periwinkle-dim';
      case 'success': return 'bg-mint border-mint-dim';
      case 'retry': return 'bg-coral border-coral-dim';
      default: return 'bg-slate-200 border-slate-300';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'listening': return <Ear className="w-8 h-8 text-white" />;
      case 'success': return <Check className="w-8 h-8 text-white" />;
      case 'retry': return <RefreshCcw className="w-8 h-8 text-white" />;
      case 'analyzing': return <Sparkles className="w-8 h-8 text-white animate-spin" />;
      default: return <div className="flex space-x-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" /></div>;
    }
  };

  return (
    <div className="relative flex justify-center items-center py-6">
      {/* Background Blobs */}
      <div className={`absolute w-24 h-24 rounded-full blur-xl opacity-50 animate-blob ${getColors().split(' ')[0]} transition-colors duration-500`} />
      
      {/* Main Face */}
      <motion.div 
        className={`relative w-20 h-20 rounded-3xl border-4 shadow-lg flex items-center justify-center transition-colors duration-500 ${getColors()}`}
        animate={{
          scale: status === 'listening' ? 1.1 : 1,
          rotate: status === 'success' ? [0, -10, 10, 0] : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Eyes (if idle) or Icon */}
        <motion.div
          key={status}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          {getIcon()}
        </motion.div>
      </motion.div>

      {/* Helper Text Bubble */}
      <motion.div 
        className="absolute top-0 right-10 bg-white px-4 py-2 rounded-xl rounded-bl-none shadow-sm border border-slate-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm font-bold text-slate-600">
          {status === 'idle' && "Ready when you are!"}
          {status === 'listening' && "I'm all ears..."}
          {status === 'analyzing' && "Hmm, let me check..."}
          {status === 'success' && "Perfect accent!"}
          {status === 'retry' && "Let's try that again."}
        </p>
      </motion.div>
    </div>
  );
};
