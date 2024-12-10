/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "signup.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        textColorAnimation: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100 50%" },
        },
      },
      animation: {
        textColorAnimation: "textColorAnimation 3s linear infinite",
      },
    },
  },
  plugins: [],
};
