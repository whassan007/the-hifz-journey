import { Leaf, Flame, Sparkles, Moon, Droplet, Edit3, Home } from 'lucide-react';
import type { Biome } from './types';

export const ranks = [
  { name: 'باحث', minXp: 0, icon: <Leaf size={24} className="text-statRank-start" /> },
  { name: 'طالب', minXp: 300, icon: <Edit3 size={24} className="text-accent" /> },
  { name: 'حافظ', minXp: 800, icon: <Sparkles size={24} className="text-yellow-600" /> },
  { name: 'عالم', minXp: 1500, icon: <Home size={24} className="text-statHikmah-start" /> },
  { name: 'مفسر', minXp: 3000, icon: <Moon size={24} className="text-purple-300" /> },
];

export const getRank = (xp: number) => {
  return [...ranks].reverse().find(r => xp >= r.minXp) || ranks[0];
};

export const getNextRank = (xp: number) => {
  const current = getRank(xp);
  const idx = ranks.findIndex(r => r.name === current.name);
  return idx < ranks.length - 1 ? ranks[idx + 1] : null;
};

export const getBiomeGradients = (biome: Biome) => {
  switch (biome) {
    case 'jungle': return 'bg-gradient-to-b from-jungle-dark via-jungle-mid to-jungle-light';
    case 'ocean': return 'bg-gradient-to-b from-ocean-dark via-ocean-mid to-ocean-light';
    case 'desert': return 'bg-gradient-to-b from-desert-dark via-desert-mid to-desert-light';
    case 'palace': return 'bg-gradient-to-b from-palace-dark via-palace-mid to-palace-light';
    case 'dream': return 'bg-gradient-to-b from-dream-dark via-dream-mid to-dream-light';
    default: return 'bg-gradient-to-b from-jungle-dark via-jungle-mid to-jungle-light';
  }
};

export const getBiomeEmojis = (biome: Biome) => {
  switch (biome) {
    case 'jungle': return [<Leaf opacity={0.4} />, <Leaf opacity={0.6} />, <Leaf opacity={0.2} />];
    case 'ocean': return [<Droplet opacity={0.4} />, <Droplet opacity={0.6} />];
    case 'desert': return [<Sparkles opacity={0.4} />, <Flame opacity={0.2} />];
    case 'palace': return [<Sparkles opacity={0.4} />];
    case 'dream': return [<Moon opacity={0.3} />, <Sparkles opacity={0.5} />];
    default: return [<Leaf opacity={0.4} />];
  }
};

export const getBiomeName = (biome: Biome) => {
  const names: Record<Biome, string> = { jungle: 'غابة', ocean: 'محيط', desert: 'صحراء', palace: 'قصر', dream: 'حلم' };
  return names[biome] || biome;
};

const biomesOrder: Biome[] = ['ocean', 'palace', 'desert', 'jungle', 'dream'];
export const getSurahBiome = (surahId: number): Biome => biomesOrder[surahId % 5];
export const getSurahDifficulty = (verseCount: number): number => Math.ceil(verseCount / 50);
