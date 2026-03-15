import { useState, useEffect } from 'react';
import type { Biome } from '../../types';
import { getBiomeEmojis } from '../../utils';

export const Particles = ({ biome }: { biome: Biome }) => {
  const emojis = getBiomeEmojis(biome);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      animationDuration: `${10 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${16 + Math.random() * 16}px`,
      opacity: 0.1 + Math.random() * 0.3
    }));
    setParticles(newParticles);
  }, [biome]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
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
