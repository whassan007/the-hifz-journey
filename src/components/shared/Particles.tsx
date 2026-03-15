/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import type { Biome } from '../../types';
import { getBiomeEmojis } from '../../utils';

export const Particles = ({ biome = 'default' as Biome, count = 15 }: { biome?: Biome | string; count?: number }) => {
  const emojis = getBiomeEmojis(biome as Biome);

  // Generate static values to ensure render purity
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)], // Keep emoji generation here
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3
    }));
  }, [count, emojis]); // Add emojis to dependency array

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p: any) => (
        <div 
          key={p.id}
          className="absolute bottom-0 animate-float-up"
          style={{
            left: p.left,
            fontSize: p.fontSize,
            opacity: p.opacity,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-10 mix-blend-overlay pointer-events-none" />
    </div>
  );
};
