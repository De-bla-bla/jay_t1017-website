/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f9f7f4",
          100: "#f3efeb",
          200: "#e7dfd7",
          300: "#d0bfb3",
          400: "#b0998f",
          500: "#8b7865",
          600: "#6b5d52",
          700: "#573d38",
          800: "#2d2420",
          900: "#1a1512",
          950: "#0d0905",
        },
        accent: {
          purple: "#c084fc",
          pink: "#ec4899",
          blue: "#0ea5e9",
          green: "#10b981",
        }
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
