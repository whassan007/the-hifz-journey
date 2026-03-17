import UI from './data/ui-text.json';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, Trophy, BookOpen, Gamepad2, Brain, Star, Settings } from 'lucide-react';
import { SURAHS } from './data/registry';
import type { UserState, ReviewRecord, AgeGroup, SessionConfig } from './types';
import { getBiomeGradients, getSurahBiome } from './utils';
import { calculateSM2 } from './sm2';
import { createSession } from './services/apiMock/sessionApi';

import { Particles } from './components/shared/Particles';
import { HomeView } from './components/screens/HomeView';
import { JourneyMap } from './components/screens/JourneyMap';
import { GamesView } from './components/screens/GamesView';
import { ProfileView } from './components/screens/ProfileView';
import { SettingsView } from './components/screens/SettingsView';
import { ReviewView } from './components/screens/ReviewView';
import { DataSourcesView } from './components/screens/DataSourcesView';
import { BookmarksView } from './components/screens/BookmarksView';
import { SurahReaderView } from './components/screens/SurahReaderView';
import { GameWrapper } from './components/engine/GameWrapper';
import { OnboardingView } from './components/screens/OnboardingView';
import { TeacherOnboardingView } from './components/screens/teacher/TeacherOnboardingView';
import { TeacherDashboardView } from './components/screens/teacher/TeacherDashboardView';
import { SessionConfigView } from './components/screens/SessionConfigView';
import { TrainView } from './components/screens/TrainView';
import { IslamicKnowledgeView } from './components/screens/IslamicKnowledgeView';
import { ImamDrillWrapper } from './components/engine/ImamDrillWrapper';

const INITIAL_USER: UserState = {
  name: 'Student',
  role: 'student',
  xp: 1250,
  hikmah: 45,
  streak: 5,
  lastActive: new Date().toISOString(),
  completed: [SURAHS[0], SURAHS[1]],
  badges: ['first_step', 'consistent'],
  arabicFontSize: 32,
  audioEnabled: true,
  hapticEnabled: true,
  bgOpacity: 0.5,
  ageGroup: 'sapling',
  classes: [],
  bookmarks: [],
  highlights: [],
  readSurahs: [],
  readerSettings: {
    fontSize: 3,
    lineSpacing: 'normal',
    displayMode: 'arabic_translation',
    theme: 'match_app'
  },
  sessionHistory: {}
};

const App = () => {
  const [user, setUser] = useState<UserState | null>(() => {
    const saved = localStorage.getItem('hifz_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('home');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [currentSurahId, setCurrentSurahId] = useState(109);
  const [readerSurahId, setReaderSurahId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [isTeacherOnboarding, setIsTeacherOnboarding] = useState(false);
  const [initialSessionConfig, setInitialSessionConfig] = useState<SessionConfig | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hifz_user', JSON.stringify(user));
    }
  }, [user]);

  const handleOnboardingComplete = (name: string, ageGroup: AgeGroup) => {
    setUser({ ...INITIAL_USER, name, ageGroup, role: 'student', bgOpacity: 80 });
  };

  const handleTeacherOnboardingComplete = (name: string) => {
    setUser({ ...INITIAL_USER, name, role: 'teacher', bgOpacity: 80 });
  };

  if (!user) {
    return (
      <div className={`min-h-screen font-sans text-white overflow-hidden flex flex-col relative transition-colors duration-1000 ${getBiomeGradients('jungle')}`} dir="rtl">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-80"
          style={{ backgroundImage: "url('/main-bg-v2.png')" }}
        />
        <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none" />
        {isTeacherOnboarding ? (
          <TeacherOnboardingView 
            onComplete={(name) => handleTeacherOnboardingComplete(name)} 
            onBackToStudent={() => setIsTeacherOnboarding(false)} 
          />
        ) : (
          <OnboardingView 
            onComplete={handleOnboardingComplete} 
            onTeacherClick={() => setIsTeacherOnboarding(true)} 
          />
        )}
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('hifz_user');
    setUser(null);
  };

  if (user.role === 'teacher') {
    return (
      <div className={`min-h-screen font-sans text-white overflow-hidden flex flex-col relative transition-colors duration-1000 ${getBiomeGradients('jungle')}`} dir="rtl">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-80"
          style={{ backgroundImage: "url('/main-bg-v2.png')" }}
        />
        <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none" />
        <div className="relative z-10 w-full h-full overflow-y-auto">
          <TeacherDashboardView user={user} onLogout={handleLogout} />
        </div>
      </div>
    );
  }

  const currentSurahData = SURAHS.find(s => s.id === currentSurahId) || SURAHS[0];

  const handleGameComplete = (xpAward: number, qualityScore: number) => {
    setUser(prev => {
      if (!prev) return null;
      // 1. Progress unlocks
      const isNewCompletion = !prev.completed.find(s => s.id === currentSurahId);
      const newCompleted = isNewCompletion ? [...prev.completed, currentSurahData] : prev.completed;
      
      let nextSurah = currentSurahId;
      if (isNewCompletion) {
        const currentIndex = SURAHS.findIndex(s => s.id === currentSurahId);
        if (currentIndex > 0) {
          nextSurah = SURAHS[currentIndex - 1].id;
        }
      }

      // 2. SM-2 Update
      const existingReview = reviews.find(r => r.surahId === currentSurahId);
      const sm2Results = calculateSM2(
        qualityScore,
        existingReview ? existingReview.repetitionCount : 0,
        existingReview ? existingReview.easeFactor : 2.5,
        existingReview ? existingReview.intervalDays : 0
      );

      const newReviewRecord: ReviewRecord = {
        surahId: currentSurahId,
        verseNumber: 1,
        easeFactor: sm2Results.easeFactor,
        intervalDays: sm2Results.intervalDays,
        repetitionCount: sm2Results.repetitionCount,
        nextReviewDate: sm2Results.nextReviewDate,
        lastReviewed: new Date().toISOString(),
        qualityHistory: [...(existingReview?.qualityHistory || []), qualityScore],
        missCount: existingReview ? existingReview.missCount : 0
      };

      setReviews(prevReviews => {
        return existingReview 
          ? prevReviews.map(r => r.surahId === currentSurahId ? newReviewRecord : r)
          : [...prevReviews, newReviewRecord];
      });

      setCurrentSurahId(nextSurah);

      return {
        ...prev,
        xp: prev.xp + xpAward,
        completed: newCompleted,
      };
    });
    setActiveGame(null);
  };

  const handleImamDrillComplete = (xpAward: number, imamId: number, qualityScore: number) => {
    setUser(prev => {
      if (!prev) return null;
      
      const isNewCompletion = !(prev.completedImamIds || []).includes(imamId);
      const newCompleted = isNewCompletion ? [...(prev.completedImamIds || []), imamId] : (prev.completedImamIds || []);
      const newUnlocked = (prev.unlockedImamIds || [1]).includes(imamId + 1) ? prev.unlockedImamIds || [1] : [...(prev.unlockedImamIds || [1]), imamId + 1];

      // Note: Implement SM-2 for Imam reviews similarly here if desired, currently tracking basic unlock flow.
      console.log(`Earned ${xpAward} Islamic Knowledge XP with quality ${qualityScore}`);

      return {
        ...prev,
        islamicKnowledgeXp: (prev.islamicKnowledgeXp || 0) + xpAward,
        xp: prev.xp + xpAward,
        completedImamIds: newCompleted,
        unlockedImamIds: newUnlocked
      };
    });
    setActiveGame(null);
  };

  const handleLaunchSession = async (config: SessionConfig) => {
    try {
      const response = await createSession(config);
      console.log('Session created:', response.session_id);
      
      // Update current surah focus to the first one in the list so the game has a context
      if (config.surahIds.length > 0) {
        setCurrentSurahId(config.surahIds[0]);
      }
      
      setActiveTab('home'); // Go back to home routing
      setActiveGame('quiz'); // Launch blended quiz with config
    } catch (e) {
      console.error(e);
    }
  };

  const currentBiome = activeGame ? getSurahBiome(currentSurahData.id) : (readerSurahId ? getSurahBiome(readerSurahId) : 'jungle');
  const hideBottomNav = activeTab === 'reader' || activeTab === 'data_sources' || activeTab === 'bookmarks' || activeTab === 'session_config';

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
          {activeTab === 'home' && <HomeView user={user} reviews={reviews} setActiveGame={setActiveGame} setCurrentSurah={setCurrentSurahId} onOpenSessionConfig={(config) => { setInitialSessionConfig((config as SessionConfig) || null); setActiveTab('session_config'); }} />}
          {activeTab === 'journey' && <JourneyMap user={user} currentSurahId={currentSurahId} onReadSurah={(id) => { setReaderSurahId(id); setActiveTab('reader'); }} onOpenBookmarks={() => setActiveTab('bookmarks')} onOpenSessionConfig={(config) => { setInitialSessionConfig((config as SessionConfig) || null); setActiveTab('session_config'); }} />}
          {activeTab === 'games' && <GamesView setActiveGame={setActiveGame} />}
          {activeTab === 'train' && <TrainView setActiveTab={setActiveTab} setActiveGame={setActiveGame} currentSurahId={currentSurahId} setCurrentSurahId={setCurrentSurahId} />}
          {activeTab === 'review' && <ReviewView />}
          {activeTab === 'profile' && <div className="p-6"><ProfileView user={user} /></div>}
          {activeTab === 'settings' && <SettingsView user={user} onUpdate={(updates) => setUser(p => p ? {...p, ...updates} : null)} onOpenDataSources={() => setActiveTab('data_sources')} onLogout={handleLogout} />}
          {activeTab === 'islamic_knowledge' && <IslamicKnowledgeView user={user} setActiveGame={setActiveGame} />}
          {activeTab === 'data_sources' && <DataSourcesView onBack={() => setActiveTab('profile')} />}
          {activeTab === 'bookmarks' && <BookmarksView user={user} onUpdateUser={(updates: Partial<UserState>) => setUser(p => p ? {...p, ...updates} : null)} onBack={() => setActiveTab('journey')} onNavigateSurah={(id: number) => { setReaderSurahId(id); setActiveTab('reader'); }} />}
          {activeTab === 'reader' && readerSurahId && <SurahReaderView surahId={readerSurahId} user={user} onUpdateUser={(updates: Partial<UserState>) => setUser(p => p ? {...p, ...updates} : null)} onBack={() => setActiveTab('journey')} onNavigateSurah={setReaderSurahId} />}
          {activeTab === 'session_config' && <SessionConfigView user={user} reviews={reviews} initialConfig={initialSessionConfig} onLaunch={handleLaunchSession} onClose={() => setActiveTab('home')} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {activeGame && activeGame.startsWith('imam_drill_') ? (
          <ImamDrillWrapper 
             imamId={parseInt(activeGame.split('_')[2])}
             user={user}
             onClose={() => setActiveGame(null)}
             onComplete={handleImamDrillComplete}
          />
        ) : activeGame && (
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
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 w-full bg-jungle-dark/90 backdrop-blur-xl border-t border-white/10 pb-safe pt-2 px-6 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-center w-full max-w-md mx-auto mb-2">
          {[
            { id: 'home', icon: <Home size={24} />, label: UI.ui_5 },
            { id: 'journey', icon: <Map size={24} />, label: UI.ui_4 },
            /* eslint-disable-next-line local/no-hardcoded-arabic */
            { id: 'islamic_knowledge', icon: <Star size={24} />, label: 'المعارف' },
            /* eslint-disable-next-line local/no-hardcoded-arabic */
            { id: 'train', icon: <Brain size={24} />, label: (UI as Record<string, string>).ui_98 || 'التدريب' },
            { id: 'games', icon: <Gamepad2 size={24} />, label: UI.ui_3 },
            { id: 'review', icon: <BookOpen size={24} />, label: UI.ui_2 },
            { id: 'profile', icon: <Trophy size={24} />, label: UI.ui_1 },
            /* eslint-disable-next-line local/no-hardcoded-arabic */
            { id: 'settings', icon: <Settings size={24} />, label: 'الإعدادات' },
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
      )}
    </div>
  );
};

export default App;
