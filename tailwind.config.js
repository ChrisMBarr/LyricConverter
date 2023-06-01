/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      // '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        "lc-1": "url('./assets/bg1.jpg')",
      },
      colors: {
        "lc-highlight": "#3ea8b2", //hsl(185.17deg 48.33% 47.06%);
        "lc-light": "#7bc9d1", //    hsl(185.17deg 48.33% 65%); - a lighter version of the highlight color
      },
    },
  },
  plugins: [],
};
