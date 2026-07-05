import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paddy: {
          DEFAULT: "#1F4D2C",
          dark: "#12331C",
          light: "#3C7A4E"
        },
        turmeric: {
          DEFAULT: "#E8A419",
          dark: "#B87F0F"
        },
        clay: {
          DEFAULT: "#8B5E34",
          dark: "#5E3E22"
        },
        husk: "#F6F3EA",
        ink: "#1B1B16"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"]
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px"
      }
    }
  },
  plugins: []
};
export default config;
