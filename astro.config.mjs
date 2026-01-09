// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://dominikj111.github.io',
	base: '/', // Root site - repo must be named dominikj111.github.io
	integrations: [mdx(), sitemap(), react()],
});
