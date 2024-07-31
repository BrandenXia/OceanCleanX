import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "https://oceancleanx.org",
  integrations: [tailwind(), react(), sitemap()],
  output: "hybrid",
  adapter: vercel({
    webAnalytics: { enable: true },
  }),
  redirects: {
    "/": "/docs",
    "/docs": "/docs/intro",
  },
});
