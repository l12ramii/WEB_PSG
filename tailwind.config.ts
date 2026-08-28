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
          950: "#03060E",
          900: "#060D1E",
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
          electric: "#0077FF",
          gold: "#FFB800",
          crimson: "#FF2A55",
          emerald: "#10B981",
        },
        background: "#040711",
        surface: {
          DEFAULT: "#081023",
          hover: "#0D1936",
          active: "#12224A",
          border: "#182B57",
          muted: "#050B19",
          card: "#091228",
        },
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "'Inter'",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "sans-serif",
        ],
        display: [
          "'Rajdhani'",
          "'Teko'",
          "'Bebas Neue'",
          "'Impact'",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(0, 229, 255, 0.35)",
        "glow-lg": "0 0 50px -10px rgba(0, 229, 255, 0.45)",
        "glow-blue": "0 0 30px -5px rgba(43, 82, 172, 0.5)",
        "glow-gold": "0 0 30px -5px rgba(255, 184, 0, 0.4)",
        "glow-crimson": "0 0 30px -5px rgba(255, 42, 85, 0.4)",
        "glow-emerald": "0 0 30px -5px rgba(16, 185, 129, 0.4)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "hero-stadium":
          "radial-gradient(circle at 50% 0%, rgba(31, 61, 130, 0.4) 0%, rgba(6, 13, 30, 0.8) 50%, #040711 100%)",
        "stadium-spotlight":
          "radial-gradient(ellipse at top, rgba(0, 229, 255, 0.15) 0%, rgba(10, 20, 47, 0.6) 45%, #040711 90%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(14, 28, 64, 0.6) 0%, rgba(6, 13, 30, 0.85) 100%)",
        "accent-gradient":
          "linear-gradient(135deg, #00E5FF 0%, #0077FF 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #FFE066 0%, #FFB800 50%, #FF8800 100%)",
        "crimson-gradient":
          "linear-gradient(135deg, #FF5577 0%, #FF2A55 100%)",
        "emerald-gradient":
          "linear-gradient(135deg, #34D399 0%, #059669 100%)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
