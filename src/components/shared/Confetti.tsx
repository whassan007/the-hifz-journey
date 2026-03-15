import { motion } from 'framer-motion';
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';

export const Confetti = () => {
  const emojis = ['🎉', '⭐', '🌙', '✨', '💎', '🔥'];
  const count = 12;

  // Generate static values to ensure render purity using useMemo instead of useEffect+setState
  const confettiProps = useMemo(() => {
    return [...Array(count)].map(() => ({
      x1: `${10 + Math.random() * 80}vw`,
      x2: `${10 + Math.random() * 80 + (Math.random() * 40 - 20)}vw`,
      duration: 2.5 + Math.random() * 2,
      delay: Math.random() * 0.4,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
  }, [count, emojis]); // emojis array is static inside the component

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiProps.map((props: { x1: string, x2: string, duration: number, delay: number, emoji: string }, i: number) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: props.x1, opacity: 1, rotate: 0 }}
          animate={{ y: '-20vh', x: props.x2, opacity: 0, rotate: 720 }}
          transition={{ duration: props.duration, delay: props.delay, ease: 'easeOut' }}
          className="absolute text-4xl"
        >
          {props.emoji}
        </motion.div>
      ))}
    </div>
  );
};
