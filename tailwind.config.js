/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      // '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        "lc-1": "url('./assets/bg1.jpg')",
      },
      colors: {
        "lc-highlight": "#3ea8b2",
      },
    },
  },
  plugins: [],
};
