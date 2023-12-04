/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#f8f9fa",
        "primary-clr": "#2d2d2d",
      },
      gradientColorStops: (theme) => ({
        "light-green": "#42b883",
        "dark-green": "#52795f",
      }),
    },
  },
  plugins: [],
};
