import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        psg: {
          950: "#040814",
          900: "#070E20",
          850: "#0A142F",
          800: "#0E1C40",
          700: "#152B5F",
          600: "#1F3D82",
          500: "#2B52AC",
          400: "#3D6DD8",
          300: "#638FF2",
          200: "#96B4FA",
          100: "#D3E1FD",
          50: "#EDF3FE",
        },
        accent: {
          cyan: "#00E5FF",
          electric: "#0088FF",
          gold: "#FFB800",
          crimson: "#FF3366",
          emerald: "#10B981",
        },
        background: "#050914",
        surface: {
          DEFAULT: "#0B152B",
          hover: "#101E3D",
          active: "#15274E",
          border: "#1C315E",
          muted: "#081022",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-teko)", "var(--font-inter)", "sans-serif"],
        mono: ["monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 229, 255, 0.3)",
        "glow-blue": "0 0 25px -5px rgba(61, 109, 216, 0.4)",
        "glow-gold": "0 0 25px -5px rgba(255, 184, 0, 0.4)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "hero-pattern": "radial-gradient(ellipse at top, #102454 0%, #050914 70%)",
        "card-gradient": "linear-gradient(135deg, rgba(16, 30, 61, 0.8) 0%, rgba(8, 16, 34, 0.9) 100%)",
        "accent-gradient": "linear-gradient(135deg, #00E5FF 0%, #0088FF 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #FF9900 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
