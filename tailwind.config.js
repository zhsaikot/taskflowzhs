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
        obsidian: {
          950: '#05090C', // Ultra-deep midnight background
          900: '#081016', // Deep Obsidian surface with dark teal/blue tint
          800: '#0E1A24', // Elevated card surface
          750: '#132331',
          700: '#192C3D',
          600: '#233C52',
        },
        status: {
          not_started: '#64748B',
          planning: '#0284C7', // Deep Ocean Blue
          in_progress: '#0D9488', // Dark Teal
          done: '#059669', // Deep Emerald
          closed: '#475569',
        },
        brand: {
          50: '#F0FDF4',
          100: '#CCFBF1',
          400: '#2DD4BF',
          500: '#0D9488', // Dark Teal
          600: '#0F766E', // Deep Teal
          700: '#115E59', // Dark Forest Teal
          emerald: '#059669',
          ocean: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-brand': '0 0 20px -3px rgba(13, 148, 136, 0.45)',
        'glow-teal': '0 0 24px -2px rgba(20, 184, 166, 0.35)',
        'glow-done': '0 0 20px -3px rgba(5, 150, 105, 0.4)',
        'glow-overdue': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
