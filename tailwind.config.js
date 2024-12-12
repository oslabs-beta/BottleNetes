// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "signup.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       keyframes: {
//         textColorAnimation: {
//           "0%": { backgroundPosition: "0% 50%" },
//           "100%": { backgroundPosition: "100 50%" },
//         },
//       },
//       animation: {
//         textColorAnimation: "textColorAnimation 3s linear infinite",
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./signup.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      screens: {
        "md-lg": "900px",
        "xl-2xl": "1400px",
        "3xl": "1750px",
      },
      boxShadow: {
        "custom-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(225deg, #e2e8f0 35%, #dbeafe 50%, #ede9fe 65%, #e2e8f0)",
      },
      keyframes: {
        colorChange: {
          "0%": {
            textShadow: "0 0 10px rgb(21, 94, 117)",
            color: "rgb(21, 94, 117)",
          },
          "50%": {
            textShadow: "0 0 10px rgb(8, 145, 178)",
            color: "rgb(8, 145, 178)",
          },
          "100%": {
            textShadow: "0 0 10px rgb(21, 94, 117)",
            color: "rgb(21, 94, 117)",
          },
        },
        textColorAnimation: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100 50%" },
        },
      },

      animation: {
        "text-color-animation": "colorChange 5s linear infinite",
        textColorAnimation: "textColorAnimation 3s linear infinite",
        "slow-spin": "spin 20s linear infinite",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

//"linear-gradient(45deg, #0f172a 30%, #082f49 55%, #172554 77%, #0f172a 100%)",
// "linear-gradient(135deg, #1E293B, #312E81, #3B4D71, #415A77)",
// "linear-gradient(135deg, #1C2A3A, #2A2E61, #224D52, #364156)",
// "linear-gradient(135deg, #1B264F, #283A73, #3D2C59, #2F3E5C)",
