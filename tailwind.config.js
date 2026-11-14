/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        verifyBlue: "#2B85E8",
        leadSky: "#5DA9FF",
        deepBlue: "#1D5FB8",
        ink: "#0F2540",
        slate: "#44546A",
        mist: "#EEF5FF",
        border: "#D5E3F5"
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        input: "10px",
        photo: "20px"
      },
      fontFamily: {
        poppins: ["Poppins", "Arial", "sans-serif"],
        inter: ["Inter", "Arial", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};