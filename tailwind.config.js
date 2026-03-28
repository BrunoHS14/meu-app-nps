import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ecoa: {
          'blue': '#007BFF',   // Azul elétrico
          'purple': '#8E44AD', // Roxo vibrante
          'violet': '#D04AE2', // Violeta brilhante
          'dark': '#1A1A2E',   // Fundo escuro
        }
      },
    },
  },
  plugins: [],
};
export default config;