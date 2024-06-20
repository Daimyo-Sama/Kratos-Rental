/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5F1F',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 2s ease-in-out forwards',
        fadeInDelay1: 'fadeIn 2s ease-in-out 2s forwards',
        fadeInDelay2: 'fadeIn 2s ease-in-out 4s forwards',
        fadeInDelay3: 'fadeIn 2s ease-in-out 6s forwards',
      },
    },
  },
  plugins: [],
}
