/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0A0D14',
          card: '#111726',
          cardBorder: '#1F293D',
          hover: '#192238',
          accent: '#00F0FF',
          accentPurple: '#A855F7',
          accentGreen: '#10B981',
          accentOrange: '#F97316',
          accentRed: '#EF4444'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.7)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
      }
    },
  },
  plugins: [],
}
