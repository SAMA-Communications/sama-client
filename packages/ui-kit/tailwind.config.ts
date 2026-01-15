import type { Config } from "tailwindcss";

export default {
  prefix: "", //ui-

  content: ["./src/**/*.{ts,tsx}"],

  theme: {
    fontFamily: {
      base: "var(--ui-font-base)",
      accent: "var(--ui-font-accent)",
    },

    fontSize: {
      h1: "var(--ui-text-h1)",
      h2: "var(--ui-text-h2)",
      h3: "var(--ui-text-h3)",
      h4: "var(--ui-text-h4)",
      h5: "var(--ui-text-h5)",
      h6: "var(--ui-text-h6)",
      p: "var(--ui-text-p)",
      span: "var(--ui-text-span)",
      indicator: "var(--ui-text-indicator)",
    },

    colors: {
      white: "var(--ui-white)",
      black: "var(--ui-black)",

      "bg-light": "var(--ui-bg-light)",
      "bg-dark": "var(--ui-bg-dark)",

      "text-light": "var(--ui-text-light)",
      "text-dark": "var(--ui-text-dark)",

      "accent-light": "var(--ui-accent-light)",
      "accent-dark": "var(--ui-accent-dark)",

      indicator: "var(--ui-indicator)",
      danger: "var(--ui-red)",
    },
  },

  plugins: [],
} satisfies Config;
