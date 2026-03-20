/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jinsoo: {
          pink: '#fce7f3',
          pinkDark: '#f472b6',
          blue: '#dbeafe',
          blueDark: '#60a5fa',
        }
      }
    },
  },
  plugins: [],
}
