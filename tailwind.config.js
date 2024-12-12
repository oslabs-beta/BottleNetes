/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./signup.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        colorChange: {
          "0%": {
            textShadow: "0 0 5px rgb(21, 94, 117)",
            color: "rgb(21, 94, 117)",
          },
          "50%": {
            textShadow: "0 0 5px rgb(8, 145, 178)",
            color: "rgb(8, 145, 178)",
          },
          "100%": {
            textShadow: "0 0 5px rgb(21, 94, 117)",
            color: "rgb(21, 94, 117)",
          },
        },
      },

      animation: {
        'text-color-animation': {
          animation: 'colorChange 5s linear infinite',
          color: 'rgb(21, 94, 117)'
        },
        'slow-spin': 'spin 20s linear infinite'
      }
    },
  },
  plugins: [],
};
