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
        metro: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // primary indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        navy: {
          800: '#0f172a',
          850: '#0b1120',
          900: '#060a12',
          950: '#030712',
        },
        // Metro line specific signature colors
        line: {
          blue: '#2563eb',
          aqua: '#06b6d4',
          magenta: '#d946ef',
          yellow: '#eab308',
          red: '#ef4444',
          green: '#10b981',
          orange: '#f97316',
          airport: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'train-move': 'trainMove 4s ease-in-out infinite alternate',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan': 'scanLine 2.5s linear infinite',
      },
      keyframes: {
        trainMove: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      },
      boxShadow: {
        'glow-metro': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
