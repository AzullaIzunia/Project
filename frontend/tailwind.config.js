/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0b1a",
        foreground: "#e8e0f5",
        primary: "#6d28d9",
        "primary-foreground": "#f3eeff",
        secondary: "#1e1640",
        "secondary-foreground": "#c4b5fd",
        accent: "#a855f7",
        "accent-foreground": "#f9f0ff",
        muted: "#1a1530",
        "muted-foreground": "#8b7cb3",
        card: "#130f2a",
        "card-foreground": "#e8e0f5",
        border: "rgba(109, 40, 217, 0.35)",
        input: "#1e1640",
        ring: "#7c3aed",
        gold: "#d4a843",
        "gold-muted": "#8a6820",
      },
      fontFamily: {
        body: ["var(--font-inter)", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
}
