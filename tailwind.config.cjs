/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      outlineWidth: {
        5: "5px",
        6: "6px",
      },
      dropShadow: {
        "sm-all": "0 0 0.15rem #d1d5db", //dropshadow for OptionsMenu
      },
    },
  },
  plugins: [],
};

module.exports = config;
