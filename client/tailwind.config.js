/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        accent: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        gold: {
          300: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
        }
      },
      boxShadow: {
        glow:        "0 0 40px rgba(168, 85, 247, 0.28)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.22)",
        "glow-gold": "0 0 30px rgba(251, 191, 36, 0.25)",
        "glow-sm":   "0 0 20px rgba(168, 85, 247, 0.18)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0f0518 0%, #0a0a1a 40%, #030718 100%)",
      },
      animation: {
        "pulse-slow":   "pulse 3s ease-in-out infinite",
        "float":        "float 6s ease-in-out infinite",
        "shimmer":      "shimmer 2.5s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
      },
    }
  },
  plugins: []
};
