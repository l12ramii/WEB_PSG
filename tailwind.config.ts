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
        // 1.1. Fondos y Superficies (Dark Neutrals)
        background: "#050814",
        surface: {
          DEFAULT: "#0A1128",
          elevated: "#111A3A",
          hover: "#111A3A",
          active: "#16224D",
          border: "rgba(255, 255, 255, 0.1)",
          muted: "#050814",
          card: "#0A1128",
        },
        "surface-elevated": "#111A3A",

        // 1.2. Tipografía (Contraste WCAG)
        "text-primary": "#FFFFFF",
        "text-secondary": "#94A3B8",
        "text-muted": "#475569",
        primary: "#FFFFFF",
        secondary: "#94A3B8",
        muted: "#475569",

        // 1.3. Acentos Semánticos y Branding
        brand: {
          DEFAULT: "#001F54",
          primary: "#001F54",
        },
        "brand-primary": "#001F54",
        accent: {
          cyan: "#00E5FF",
          blue: "#3B82F6",
          electric: "#3B82F6",
          gold: "#F59E0B",
          crimson: "#EF4444",
          emerald: "#10B981",
        },
        "accent-cyan": "#00E5FF",
        "accent-blue": "#3B82F6",

        // 1.4. Estados (Feedback)
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",

        // Club PSG Palette (backward compatibility & subtle nuances)
        psg: {
          950: "#03060E",
          900: "#050814",
          850: "#0A1128",
          800: "#111A3A",
          700: "#152B5F",
          600: "#1F3D82",
          500: "#2B52AC",
          400: "#3D6DD8",
          300: "#638FF2",
          200: "#94A3B8",
          100: "#D3E1FD",
          50: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: [
          "'Inter'",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "sans-serif",
        ],
        display: [
          "'Oswald'",
          "'Tungsten'",
          "'Teko'",
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
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px / 16px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px / 20px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px / 24px
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px / 28px
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px / 32px
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px / 40px
        "6xl": ["3.75rem", { lineHeight: "1" }], // 60px / 1
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(0, 229, 255, 0.35)",
        "glow-subtle": "0 0 40px -10px rgba(0, 229, 255, 0.1)",
        "inner-light": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "glow-lg": "0 0 50px -10px rgba(0, 229, 255, 0.45)",
        "glow-blue": "0 0 30px -5px rgba(59, 130, 246, 0.5)",
        "glow-gold": "0 0 30px -5px rgba(245, 158, 11, 0.4)",
        "glow-crimson": "0 0 30px -5px rgba(239, 68, 68, 0.4)",
        "glow-emerald": "0 0 30px -5px rgba(16, 185, 129, 0.4)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "hero-stadium":
          "radial-gradient(circle at 50% 0%, rgba(31, 61, 130, 0.4) 0%, rgba(10, 17, 40, 0.8) 50%, #050814 100%)",
        "stadium-spotlight":
          "radial-gradient(ellipse at top, rgba(0, 229, 255, 0.15) 0%, rgba(10, 17, 40, 0.6) 45%, #050814 90%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(17, 26, 58, 0.6) 0%, rgba(10, 17, 40, 0.85) 100%)",
        "accent-gradient":
          "linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)",
        "crimson-gradient":
          "linear-gradient(135deg, #F87171 0%, #EF4444 100%)",
        "emerald-gradient":
          "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
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
