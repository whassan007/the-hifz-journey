/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F4F4F', // Dark slate/moss green
        accent: '#C19A6B', // Warm camel/wood tone
        bg: '#F5F5DC', // Beige/parchment base
        paper: '#FAF9F6', // Off-white for text
        // Biomes: Earthy replacements
        jungle: {
          dark: '#1B2A1E', // Deep forest night
          mid: '#2F4F2F',  // Pine green
          light: '#3C5B3E', // Moss
          accent: '#A4C3A2' // Sage
        },
        ocean: {
          dark: '#0A1B28', // Deep sea trench
          mid: '#1E3B4D', // Atlantic blue
          light: '#335C74', // River blue
          accent: '#8DB3C3' // Seafoam wash
        },
        desert: {
          dark: '#3A2012', // Deep canyon
          mid: '#5E3A1A', // Terra cotta
          light: '#8B5A2B', // Camel
          accent: '#D4B895' // Sandstone
        },
        palace: {
          dark: '#2A2338', // Night sky
          mid: '#443A5F', // Amethyst slate
          light: '#615A7A', // Dusky mauve
          accent: '#B0A8C9' // Twilight
        },
        dream: {
          dark: '#141E24', // Deep obsidian
          mid: '#2B3944', // Slate
          light: '#475C68', // Fog
          accent: '#9BB3C1' // Pearl
        },
        // Muted Stats Colors
        statXp: { start: '#B46A41', end: '#8C4E2B' }, // Warm terra cotta
        statStreak: { start: '#D98977', end: '#B35E4C' }, // Soft sunset coral 
        statRank: { start: '#8FBC8F', end: '#556B2F' }, // Light sage to olive
        statHikmah: { start: '#6A5ACD', end: '#483D8B' }, // Dusky slate blue
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', // Slower, softer bounce
        'shake': 'shake 0.6s ease-in-out',
        'pulse-glow': 'pulseGlow 3s infinite', // Slower pulse
        'float-up': 'floatUp 15s linear forwards', // Slower, lazier float
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-3px)' },
          '40%, 80%': { transform: 'translateX(3px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', boxShadow: '0 0 10px rgba(193, 154, 107, 0.2)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)', boxShadow: '0 0 25px rgba(193, 154, 107, 0.5)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-10vh) rotate(180deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
