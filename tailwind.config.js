import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities([
        {
          ".scrollbar-gutter-auto": {
            "scrollbar-gutter": "auto",
          },
          ".scrollbar-gutter-stable": {
            "scrollbar-gutter": "stable",
          },
        },
      ]);
    }),
  ],
};
