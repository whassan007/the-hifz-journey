import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, Trophy, BookOpen, Gamepad2 } from 'lucide-react';
import { SURAH_REGISTRY } from './data/registry';
import type { UserState, ReviewRecord } from './types';
import { getBiomeGradients } from './utils';
import { calculateSM2 } from './sm2';

import { Particles } from './components/shared/Particles';
import { HomeView } from './components/screens/HomeView';
import { JourneyMap } from './components/screens/JourneyMap';
import { GamesView } from './components/screens/GamesView';
import { ProfileView } from './components/screens/ProfileView';
import { ReviewView } from './components/screens/ReviewView';
import { GameWrapper } from './components/engine/GameWrapper';
import { OnboardingView } from './components/screens/OnboardingView';

const INITIAL_USER: UserState = {
  name: 'أسامة',
  xp: 450,
  hikmah: 120,
  streak: 5,
  completed: [114, 113, 112, 111, 110],
  badges: ['first_step', 'consistent'],
  currentSurah: 109,
  arabicFontSize: 30,
  lastActiveDate: new Date().toISOString(),
  reviews: [],
  mistakes: [],
  audioEnabled: true,
  hapticEnabled: true,
  bgOpacity: 80,
  ageGroup: 'sapling',
};

const App = () => {
  const [user, setUser] = useState<UserState | null>(() => {
    const saved = localStorage.getItem('hifz_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('home');
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hifz_user', JSON.stringify(user));
    }
  }, [user]);

  const handleOnboardingComplete = (name: string) => {
    setUser({ ...INITIAL_USER, name, bgOpacity: 80 });
  };

  if (!user) {
    return (
      <div className={`min-h-screen font-sans text-white overflow-hidden flex flex-col relative transition-colors duration-1000 ${getBiomeGradients('jungle')}`} dir="rtl">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-80"
          style={{ backgroundImage: "url('/main-bg-v2.png')" }}
        />
        <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none" />
        <OnboardingView onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  const currentSurahData = SURAH_REGISTRY.find(s => s.id === user.currentSurah) || SURAH_REGISTRY[0];

  const handleGameComplete = (xpAward: number, qualityScore: number) => {
    setUser(prev => {
      if (!prev) return null;
      // 1. Progress unlocks
      const isNewCompletion = !prev.completed.includes(prev.currentSurah);
      const newCompleted = isNewCompletion ? [...prev.completed, prev.currentSurah] : prev.completed;
      
      let nextSurah = prev.currentSurah;
      if (isNewCompletion) {
        const currentIndex = SURAH_REGISTRY.findIndex(s => s.id === prev.currentSurah);
        if (currentIndex < SURAH_REGISTRY.length - 1) {
          nextSurah = SURAH_REGISTRY[currentIndex + 1].id;
        }
      }

      // 2. SM-2 Update
      // Using surah index as verse 1 placeholder since prototype doesn't have verse granularity yet
      const existingReview = prev.reviews.find(r => r.surahId === prev.currentSurah);
      const sm2Results = calculateSM2(
        qualityScore,
        existingReview ? existingReview.repetitionCount : 0,
        existingReview ? existingReview.easeFactor : 2.5,
        existingReview ? existingReview.intervalDays : 0
      );

      const newReviewRecord: ReviewRecord = {
        surahId: prev.currentSurah,
        verseNumber: 1,
        easeFactor: sm2Results.easeFactor,
        intervalDays: sm2Results.intervalDays,
        repetitionCount: sm2Results.repetitionCount,
        nextReviewDate: sm2Results.nextReviewDate,
        lastReviewed: new Date().toISOString(),
        qualityHistory: [...(existingReview?.qualityHistory || []), qualityScore],
        missCount: existingReview ? existingReview.missCount : 0 // missCount would be updated by mistake tracking
      };

      const newReviews = existingReview 
        ? prev.reviews.map(r => r.surahId === prev.currentSurah ? newReviewRecord : r)
        : [...prev.reviews, newReviewRecord];

      return {
        ...prev,
        xp: prev.xp + xpAward,
        completed: newCompleted,
        currentSurah: nextSurah,
        reviews: newReviews
      };
    });
    setActiveGame(null);
  };

  const currentBiome = activeGame ? currentSurahData.biome : 'jungle';

  return (
    <div className={`min-h-screen font-sans text-white overflow-hidden flex flex-col relative transition-colors duration-1000 ${getBiomeGradients(currentBiome)}`} dir="rtl">
      {/* Custom Background Image Layer */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-80"
        style={{ backgroundImage: "url('/main-bg-v2.png')" }}
      />
      <div 
        className="fixed inset-0 bg-black z-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: user.bgOpacity / 100 }}
      />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles biome={currentBiome} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto pb-24 relative z-10 w-full max-w-4xl mx-auto"
        >
          {activeTab === 'home' && <HomeView user={user} currentSurahData={currentSurahData} setActiveGame={setActiveGame} />}
          {activeTab === 'journey' && <JourneyMap user={user} setCurrentSurah={(id) => setUser({...user, currentSurah: id})} />}
          {activeTab === 'games' && <GamesView setActiveGame={setActiveGame} />}
          {activeTab === 'review' && <ReviewView />}
          {activeTab === 'profile' && <div className="p-6"><ProfileView user={user} onUpdate={(updates) => setUser(p => p ? {...p, ...updates} : null)} /></div>}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {activeGame && (
          <GameWrapper 
            mode={activeGame}
            surah={currentSurahData}
            onClose={() => setActiveGame(null)}
            onComplete={handleGameComplete}
            audioEnabled={user.audioEnabled}
            hapticEnabled={user.hapticEnabled}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-jungle-dark/90 backdrop-blur-xl border-t border-white/10 pb-safe pt-2 px-6 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center w-full max-w-md mx-auto mb-2">
          {[
            { id: 'home', icon: <Home size={24} />, label: 'الرئيسية' },
            { id: 'journey', icon: <Map size={24} />, label: 'الرحلة' },
            { id: 'games', icon: <Gamepad2 size={24} />, label: 'الألعاب' },
            { id: 'review', icon: <BookOpen size={24} />, label: 'المراجعة' },
            { id: 'profile', icon: <Trophy size={24} />, label: 'إنجازاتي' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === tab.id ? 'text-accent scale-110' : 'text-paper/50 hover:text-paper/80'}`}
            >
              {tab.icon}
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
