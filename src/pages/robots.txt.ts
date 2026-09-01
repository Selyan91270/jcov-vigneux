import type { APIRoute } from 'astro';

// Généré à partir de `site` dans astro.config.mjs, pour que l'URL du sitemap
// suive automatiquement un changement de nom de domaine.
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site);

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};
