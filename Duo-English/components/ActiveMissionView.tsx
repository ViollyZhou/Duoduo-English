import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mission, DialogueLine } from '../types';
import { CyberVisualizer } from './CyberVisualizer';
import { ConfidenceMeter } from './ConfidenceMeter';
import { Mic, Volume2, ArrowRight, Flame, Globe, Zap, X, Shield, Play } from 'lucide-react';

interface ActiveMissionViewProps {
  mission: Mission;
  dialogue: DialogueLine[];
  currentStep: number;
  onAdvance: () => void;
  onExit: () => void;
}

type InteractionPhase = 'intro' | 'listen' | 'speak' | 'analyzing' | 'result';

export const ActiveMissionView: React.FC<ActiveMissionViewProps> = ({
  mission,
  dialogue,
  currentStep,
  onAdvance,
  onExit
}) => {
  const currentLine = dialogue[currentStep % dialogue.length];
  const isUserTurn = currentLine?.userRole;
  const isBriefing = currentStep === 0;

  // Local State for the Listen-Then-Speak Loop
  const [phase, setPhase] = useState<InteractionPhase>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [confidence, setConfidence] = useState(0);
  
  // Ref to hold the utterance to prevent garbage collection
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Ensure voices are loaded (Chrome compatibility)
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Cleanup audio on unmount
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Reset phase when step changes
  useEffect(() => {
    if (isBriefing) {
        setPhase('intro');
        return;
    }

    if (!isUserTurn) {
        setPhase('intro');
    } else {
        setPhase('listen');
    }
  }, [currentStep, isUserTurn, isBriefing]);

  // Handler: Play Native Audio (TTS)
  const handlePlayAudio = () => {
    if (!currentLine?.text) return;

    // Stop any current playback to avoid overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentLine.text);
    // Critical: Assign to ref to prevent Garbage Collection from killing the event listeners
    utteranceRef.current = utterance;

    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;

    // Select Voice: Prefer "Google US English" or any "en-US"
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                           voices.find(v => v.lang === 'en-US');
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event Handlers for UI Sync
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      // Logic for flow advancement
      if (isUserTurn) {
        setPhase('speak'); // Ready for user input
      } else {
        // If it's opponent turn, we move on automatically after listening
        setTimeout(onAdvance, 500);
      }
    };

    utterance.onerror = (e) => {
      console.error("TTS Error:", e.error);
      setIsPlaying(false);

      // 'interrupted' or 'canceled' are expected if user clicks fast or unmounts
      if (e.error === 'interrupted' || e.error === 'canceled') {
         return;
      }
      
      // Fallback for actual errors: allow user to proceed
      if (isUserTurn) {
        setPhase('speak');
      } else {
        setTimeout(onAdvance, 500);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handler: Start Recording
  const handleStartRecording = () => {
    if (phase !== 'speak') return;
    setIsRecording(true);
  };

  // Handler: Stop Recording & Analyze
  const handleStopRecording = () => {
    if (phase !== 'speak') return;
    setIsRecording(false);
    setPhase('analyzing');
    
    // Simulate analysis delay
    setTimeout(() => {
      const calculatedScore = Math.floor(Math.random() * (100 - 85) + 85); // Random high score
      setConfidence(calculatedScore);
      setPhase('result');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white overflow-hidden flex flex-col font-sans">
      
      {/* 1. BACKGROUND LAYER (Blurred & Darkened) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={mission.bgImage} 
          alt="Atmosphere" 
          className="w-full h-full object-cover filter blur-3xl opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-black" />
      </div>

      {/* 2. TOP HUD (Progress & Streak) */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex gap-1 h-1 flex-1 max-w-[100px] mr-4">
           {dialogue.map((_, i) => (
             <div 
               key={i} 
               className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                 i <= currentStep ? 'bg-mint shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-white/20'
               }`} 
             />
           ))}
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-xs font-bold text-orange-200">5 Day Streak</span>
        </div>

        <button 
          onClick={onExit}
          className="ml-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-6 pb-48 px-6 overflow-y-auto no-scrollbar">
        
        {/* Scenario Visual (Rounded Glass) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative mb-8 group shrink-0"
        >
            <img src={mission.bgImage} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-mint mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Live Scenario
                </p>
                <h3 className="font-display font-bold text-lg leading-none">{mission.title}</h3>
            </div>
        </motion.div>

        {/* CONTENT SWITCHER: Briefing vs Dialogue */}
        {isBriefing ? (
            // BRIEFING LAYOUT
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-xl text-left space-y-6"
            >
                <div>
                   <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">
                     {mission.title}
                   </h2>
                   <p className="text-lg text-slate-200 italic leading-relaxed border-l-2 border-mint/50 pl-4">
                     "{mission.story_brief}"
                   </p>
                </div>

                <div className="pt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Shield className="w-3 h-3 text-mint" /> Mission Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {mission.vocab.map((word, i) => (
                             <span key={i} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/5 text-sm text-white/90 shadow-sm backdrop-blur-md">
                                {word}
                             </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        ) : (
            // KARAOKE/DIALOGUE LAYOUT
            <div className="w-full max-w-xl text-center space-y-6">
                {!isUserTurn && (
                    <p className="text-periwinkle text-xs font-bold uppercase tracking-widest animate-pulse">
                        Incoming Transmission...
                    </p>
                )}
                
                <h2 className="text-3xl md:text-4xl font-display font-medium leading-tight drop-shadow-lg">
                    <span className={isUserTurn ? "text-white" : "text-white/60"}>
                        "{currentLine?.text}"
                    </span>
                </h2>

                {/* Helper Hints (Only visible in speak mode) */}
                {isUserTurn && phase === 'speak' && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="flex justify-center gap-4 mt-4"
                   >
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] hover:bg-white/10 transition-colors">
                         <Globe className="w-3 h-3" /> Translate
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] hover:bg-white/10 transition-colors">
                         Slow Mode
                      </button>
                   </motion.div>
                )}
            </div>
        )}
      </div>

      {/* 4. THE CONTROL DECK (Bottom Anchored) */}
      <div className="absolute bottom-0 inset-x-0 h-[35vh] bg-black/40 backdrop-blur-xl border-t border-white/10 rounded-t-[3rem] z-20 flex flex-col items-center justify-between py-8 px-6 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
         
         {/* Visualizer Area (Hidden during briefing) */}
         <div className="w-full flex justify-center mb-4">
            {!isBriefing && (
                phase === 'analyzing' || phase === 'result' ? (
                    <div className="h-16 flex items-center">
                    {phase === 'analyzing' && <p className="text-mint animate-pulse font-mono text-sm">ANALYZING FREQUENCY...</p>}
                    </div>
                ) : (
                    <CyberVisualizer mode={isPlaying ? 'playing' : isRecording ? 'recording' : 'idle'} />
                )
            )}
         </div>

         {/* Dynamic Controls based on Phase */}
         <div className="w-full max-w-md flex flex-col items-center min-h-[100px]">
            <AnimatePresence mode="wait">
                
                {/* STATE 0: BRIEFING START */}
                {isBriefing && (
                    <motion.div
                        key="start-mission"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full"
                    >
                        <button 
                             onClick={onAdvance}
                             className="w-full py-4 bg-mint text-slate-900 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-mint-dim transition-colors shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                        >
                            <Play className="w-5 h-5 fill-slate-900" /> Start Mission
                        </button>
                    </motion.div>
                )}

                {/* STATE 1: LISTEN (Intro or Mandatory Listen) */}
                {!isBriefing && (phase === 'intro' || phase === 'listen') && (
                    <motion.div 
                        key="listen-btn"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <button
                            onClick={handlePlayAudio}
                            disabled={isPlaying}
                            className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isPlaying 
                                ? 'border-periwinkle bg-periwinkle/20 scale-110 shadow-[0_0_30px_rgba(129,140,248,0.4)]' 
                                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                            }`}
                        >
                            <Volume2 className={`w-8 h-8 ${isPlaying ? 'text-periwinkle' : 'text-white'}`} />
                        </button>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {isPlaying ? "Listening..." : "Tap to Listen"}
                        </p>
                    </motion.div>
                )}

                {/* STATE 2: SPEAK (Hold to Record) */}
                {!isBriefing && phase === 'speak' && (
                    <motion.div 
                        key="record-btn"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <button
                            onMouseDown={handleStartRecording}
                            onMouseUp={handleStopRecording}
                            onTouchStart={handleStartRecording}
                            onTouchEnd={handleStopRecording}
                            className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-100 ${
                                isRecording 
                                ? 'border-mint bg-mint/20 scale-110 shadow-[0_0_40px_rgba(52,211,153,0.5)]' 
                                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-mint/50'
                            }`}
                        >
                            <Mic className={`w-10 h-10 ${isRecording ? 'text-mint' : 'text-white'}`} />
                        </button>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {isRecording ? "Release to Send" : "Hold to Speak"}
                        </p>
                    </motion.div>
                )}

                {/* STATE 3: RESULT (Confidence + Continue) */}
                {!isBriefing && phase === 'result' && (
                    <motion.div 
                        key="result-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex w-full items-center justify-between gap-6"
                    >
                        <ConfidenceMeter score={confidence} />
                        
                        <div className="flex-1">
                             <h4 className="text-xl font-bold text-white mb-1">Excellent!</h4>
                             <p className="text-slate-400 text-sm mb-4">Your pronunciation is native-level.</p>
                             
                             <button 
                                onClick={onAdvance}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                             >
                                Continue <ArrowRight className="w-4 h-4" />
                             </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>

      </div>
    </div>
  );
};