// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

import node from "@astrojs/node";

import metaTags from "astro-meta-tags";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), sentry(), spotlightjs(), metaTags()],
  output: "server",
  prefetch: false,
  adapter: vercel({
    webAnalytics: {
      enabled: false,
    },
  }),
});
