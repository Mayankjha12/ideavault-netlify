/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to look in all files inside src
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }