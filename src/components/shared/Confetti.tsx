import { motion } from 'framer-motion';

export const Confetti = () => {
  const emojis = ['🎉', '⭐', '🌙', '✨', '💎', '🔥'];
  return (
    <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: `${10 + Math.random() * 80}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '-20vh', x: `${10 + Math.random() * 80 + (Math.random() * 40 - 20)}vw`, opacity: 0, rotate: 720 }}
          transition={{ duration: 2.5 + Math.random() * 2, delay: Math.random() * 0.4, ease: 'easeOut' }}
          className="absolute text-4xl"
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
    </div>
  );
};
