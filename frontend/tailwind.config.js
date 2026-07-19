/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A1730",
        panel: "#0D2140",
        surface: "#0F2A4D",
        line: "#1D2D50",
        border: "#274C77",
        mint: "#5FD8B8",
        mintDark: "#173B36",
        amber: "#F2B705",
        text: {
          primary: "#EAF1FA",
          secondary: "#AEBBCF",
          muted: "#5B6884",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
