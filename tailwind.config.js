/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
    content: [
      "./index.html",                      // For any HTML files in the root
      "./src/**/*.{js,jsx,ts,tsx}",         // For all JS/JSX/TS/TSX files inside src folder
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  