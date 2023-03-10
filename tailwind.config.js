/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  purge: {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",

      // Or if using `src` directory:
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    enabled: true
  },

  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens
    },
    extend: {
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%"
      },
      maxWidth: {
        "8xl": "1920px"
      },
      opacity: ["disabled"],
      cursor: ["disabled"]
    }
  },
  plugins: []
};
