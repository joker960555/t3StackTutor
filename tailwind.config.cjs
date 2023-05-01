/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      outlineWidth: {
        5: "5px",
        6: "6px",
      },
      boxShadow: {
        equal: "0 0 3px 1px rgba(0, 0, 0, 0.1)", //boxShadow for OptionsMenu
      },
      translate: {
        "4/5": "80%",
      },
    },
  },
  plugins: [],
};

module.exports = config;
