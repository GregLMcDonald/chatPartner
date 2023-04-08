/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
   safelist: {
    patterns: [/^bg-/, /^text-/, /^border-/], // Use the 'patterns' array for regular expressions
  },
};
