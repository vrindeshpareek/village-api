/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        mint: "#0f766e",
        coral: "#b45309",
        skyline: "#2563eb"
      }
    }
  },
  plugins: []
};
