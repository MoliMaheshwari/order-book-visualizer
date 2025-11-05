/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/stores/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0b1220',
          panel: '#0f1724',
          accent: '#10b981',
          danger: '#ef4444',
          muted: '#94a3b8'
        }
      }
    },
  },
  plugins: [],
}
