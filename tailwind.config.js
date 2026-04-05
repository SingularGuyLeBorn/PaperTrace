/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans:  ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "ui-sans-serif", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono:  ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      colors: {
        paper: {
          50: "#fafaf8",
          100: "#f5f5f0",
          200: "#e8e8e0",
          800: "#2d2d2a",
          900: "#1a1a18",
        },
      },
    },
  },
  plugins: [],
};
