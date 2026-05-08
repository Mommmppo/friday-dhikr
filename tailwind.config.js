/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // we'll force it by adding 'dark' to body or html, or just let it be default if we set it
  theme: {
    extend: {
      colors: {
        background: "#111110", // Warm dark background
        surface: "#1f1d1b", // Slightly lighter for glass cards
        primary: {
          DEFAULT: "#d4af37", // Warm gold
          glow: "rgba(212, 175, 55, 0.4)"
        },
        text: {
          main: "#f3f2f1",
          muted: "#a19d98"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
