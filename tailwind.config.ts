import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f7f7f4",
        mint: "#0f9f6e",
        coral: "#df3f45"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 51, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
