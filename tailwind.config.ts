import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        base: "#0b0d10",
        panel: "#111418",
        ink: "#e7edf2",
        muted: "#99a3ad",
        accent: "#8de36b",
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,.25)",
        glow: "0 0 0 2px rgba(141,227,107,.25), 0 12px 40px rgba(141,227,107,.15)",
      },
    },
  },
  plugins: [],
};
export default config;
