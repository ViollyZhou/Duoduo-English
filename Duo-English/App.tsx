import React, { useState } from 'react';
import { useStore } from './store';
import { SCENARIOS, generateDialogue } from './constants';
import { ScenarioCard } from './components/ScenarioCard';
import { ActiveMissionView } from './components/ActiveMissionView';
import { MissionSuccessView } from './components/MissionSuccessView';
import { Navbar } from './components/Navbar';
import { DailyMissionCard } from './components/DailyMissionCard';
import { fetchDailyMission } from './services/DailyContentService';
import { Mission } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const { 
    currentScenarioId, 
    setScenario, 
    step, 
    advanceStep, 
    resetSession,
    score
  } = useStore();

  const [dailyMission, setDailyMission] = useState<Mission | null>(null);
  const [isFetchingDaily, setIsFetchingDaily] = useState(false);

  // Helper to get the actual mission object (from standard list or daily state)
  const currentScenario = dailyMission?.id === currentScenarioId 
    ? dailyMission 
    : SCENARIOS.find(s => s.id === currentScenarioId);

  // Generate dialogue specifically for the current scenario
  const sessionDialogue = currentScenario ? generateDialogue(currentScenario) : [];
  
  // Only mark as complete if we have a valid scenario AND we've passed the last step
  const isComplete = !!currentScenario && sessionDialogue.length > 0 && step >= sessionDialogue.length;

  const handleDailyClick = async () => {
    if (isFetchingDaily) return;
    setIsFetchingDaily(true);
    try {
      const mission = await fetchDailyMission();
      setDailyMission(mission);
      setScenario(mission.id);
    } catch (error) {
      console.error("Failed to load daily mission", error);
    } finally {
      setIsFetchingDaily(false);
    }
  };

  return (
    <div className="h-screen bg-bg text-slate-800 font-sans relative overflow-y-auto overflow-x-hidden flex flex-col">
      
      {/* Dynamic Animated Background (Visible on Dashboard) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-periwinkle/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-mint/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-32 left-[20%] w-[500px] h-[500px] bg-coral/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
      </div>

      {/* Persistent Global Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow container mx-auto px-4 pt-24 pb-20 flex flex-col max-w-7xl">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: SCENARIO SELECTOR */}
          {!currentScenarioId && (
            <motion.div 
              key="dashboard"
              className="flex flex-col items-center py-8"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900 tracking-tight">Choose your Mission</h2>
                <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">Step into a role. Learn real-world collocations. Master the flow.</p>
              </div>

              {/* DAILY DROP SECTION */}
              <div className="w-full max-w-4xl mx-auto">
                <DailyMissionCard onClick={handleDailyClick} isLoading={isFetchingDaily} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-12">
                {SCENARIOS.map((scenario) => (
                  <ScenarioCard 
                    key={scenario.id} 
                    layoutId={`card-${scenario.id}`}
                    scenario={scenario} 
                    onClick={() => setScenario(scenario.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FULL SCREEN OVERLAY: IMMERSIVE SESSION */}
      <AnimatePresence>
        {currentScenarioId && !isComplete && currentScenario && (
            <ActiveMissionView 
                key="active-session"
                mission={currentScenario}
                dialogue={sessionDialogue}
                currentStep={step}
                onAdvance={advanceStep}
                onExit={() => setScenario(null)}
            />
        )}
      </AnimatePresence>

      {/* VIEW 3: SUCCESS STATE (Full Screen) */}
      <AnimatePresence>
      {isComplete && (
        <MissionSuccessView 
            key="success-view"
            score={score}
            onHome={resetSession}
        />
      )}
      </AnimatePresence>
      
      {/* Footer (Visible on Dashboard) */}
      {!currentScenarioId && (
        <footer className="relative z-10 w-full py-6 text-center text-slate-400 text-sm font-medium">
            <p className="opacity-70">Master Real-World English, One Mission at a Time.</p>
        </footer>
      )}
    </div>
  );
};

export default App;