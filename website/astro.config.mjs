import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

// The canonical origin is the Cloudflare Pages domain. This must mirror the
// single constant in src/config.ts so sitemap/JSON-LD/OG tags all agree.
// Task 10 unified every origin reference onto this one value.
export default defineConfig({
  integrations: [svelte(), tailwind()],
  output: 'static',
  site: 'https://tarif-pajak-id.pages.dev',
});
