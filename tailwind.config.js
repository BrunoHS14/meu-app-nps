/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ecoa-blue': '#3B82F6',
        'ecoa-purple': '#8B5CF6',
        'ecoa-violet': '#7C3AED',
        'ecoa-dark': '#0F172A',
      }
    }
  },
  plugins: [],
}