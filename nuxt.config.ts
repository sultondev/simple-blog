// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/eslint-module",
    "nuxt-svgo",
    "@nuxtjs/tailwindcss",
  ],
  plugins: ["~/plugins/IntersectionObserver"],
  tailwindcss: {
    cssPath: "~/src/assets/styles/tailwindcss.scss",
  },
  svgo: {
    autoImportPath: "~/src/assets/icons/",
  },
});
