// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  prefetch: false,
  adapter: node({
    mode: "standalone",
  }),
});
