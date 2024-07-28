import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";

import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
    iconsPlugin({
      collections: getIconCollections(["ph"]),
    }),
  ],
};
