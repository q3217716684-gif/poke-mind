import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PTCG 主题色
        pokemon: {
          blue: "#3B4CCA",
          yellow: "#FFDE00",
          red: "#FF0000",
          dark: "#1A1A2E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
