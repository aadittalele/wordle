import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%": { transform: "translateX(-10px)" },
          "25%": { transform: "translateX(10px)" },
          "50%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
          "100%": { transform: "translateX(0px)" }
        }
      },
      animation: {
        wiggle: 'wiggle ease-out 0.3s',
      }
    },
  },
  plugins: [],
};
export default config;
