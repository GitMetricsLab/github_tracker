/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
    content: [
      "./index.html",                      // For any HTML files in the root
      "./src/**/*.{js,jsx,ts,tsx}",         // For all JS/JSX/TS/TSX files inside src folder
    ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        dark: {
          DEFAULT: '#0B0F1A',
          lighter: '#161B29',
          border: '#1F2937',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
    plugins: [],
  }
  