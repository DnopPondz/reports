/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "movaci-main": "#316FB7",
        "mvc-main-hover": "#80ACDC",
        "mvc-lg-1": "#DBEAFE",
      },
    },
  },
  plugins: [],
};
