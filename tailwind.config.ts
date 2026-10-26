import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      // Theme-driven: values are HSL channels set in globals.css (:root =
      // coffee) and overridden per colour theme by lib/themes.ts.
      colors: {
        cream: {
          50: "hsl(var(--cream-50) / <alpha-value>)",
          100: "hsl(var(--cream-100) / <alpha-value>)",
          200: "hsl(var(--cream-200) / <alpha-value>)",
        },
        espresso: {
          100: "hsl(var(--espresso-100) / <alpha-value>)",
          200: "hsl(var(--espresso-200) / <alpha-value>)",
          300: "hsl(var(--espresso-300) / <alpha-value>)",
          500: "hsl(var(--espresso-500) / <alpha-value>)",
          600: "hsl(var(--espresso-600) / <alpha-value>)",
          700: "hsl(var(--espresso-700) / <alpha-value>)",
          800: "hsl(var(--espresso-800) / <alpha-value>)",
        },
        surface: "hsl(var(--surface) / <alpha-value>)",
        shade: "hsl(var(--shade) / <alpha-value>)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
