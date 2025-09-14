/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        glow: "0 0 8px rgba(255, 255, 255, 0.6)", // white glow
      },
    },
  },
  plugins: [],
}
