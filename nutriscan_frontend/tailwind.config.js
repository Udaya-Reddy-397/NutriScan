/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 100%)",
        "soft-orange": "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)",
      },
    },
  },
  plugins: [],
};
