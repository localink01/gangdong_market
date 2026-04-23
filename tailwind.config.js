/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Display'",
          "'SF Pro Text'",
          "'Pretendard Variable'",
          "Pretendard",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#eef9f3",
          100: "#d7f0e0",
          200: "#a9e0bf",
          300: "#72cc98",
          400: "#37b070",
          500: "#0BB767",
          600: "#0a9458",
          700: "#0c7548",
          800: "#0e5c3c",
          900: "#0e4a32",
        },
        ink: {
          900: "#0b0f14",
          700: "#1e1e1e",
          500: "#616161",
          400: "#8e8e8e",
          300: "#d3d3d3",
        },
      },
      boxShadow: {
        glass:
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
        card: "0 10px 30px -12px rgba(16, 24, 40, 0.18)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "28px",
        "5xl": "36px",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.32s cubic-bezier(.2,.8,.2,1)",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
