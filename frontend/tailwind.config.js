/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          light: '#A5B4FC',
          dark: '#4338CA',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: {
          light: '#F3F4F6',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
};
