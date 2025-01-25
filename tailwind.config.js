/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: ["light","dark","cupcake","forest"],
  },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

