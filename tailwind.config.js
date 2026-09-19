/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
